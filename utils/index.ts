import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "@prisma/client";
import { Stripe } from "stripe";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import cookie from "cookie";

import { Address, AsyncFnType, RequestType, Status } from "./types";
import { PRISMA_ERRORS } from "./enum";
import prisma from "./prisma";

const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const generateResponse = (status: Status, message: string, res: NextApiResponse, extraInfo?: object) =>
  res.status(parseInt(status)).json({
    message,
    status,
    ...extraInfo,
  });

export const checkRequestType = (endPointRequestTYpe: RequestType, userRequestType: RequestType, res: NextApiResponse) => {
  if (userRequestType !== endPointRequestTYpe) {
    return generateResponse("405", `Request type ${userRequestType} is not allowed`, res);
  }
};

export const decodeJWT = async (authHeader = "") => {
  const [, token] = authHeader.split("Bearer ");

  const decoded = await jwt.verify(token, process.env.JWT_SECRET as Secret);

  return decoded;
};

export const hashPhassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const generateJWT = async (userId: string) => {
  const token = await jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET as Secret,
  );
  return token;
};

export const comparePassword = (password: string, currentPassword: string) => bcrypt.compareSync(password, currentPassword);

export const catchAsyncError = (fn: AsyncFnType) => (req: NextApiRequest, res: NextApiResponse) =>
  fn(req, res).catch((error) => {
    let status: Status = "400";
    let message = error?.message || "";

    if (
      error instanceof PrismaClientKnownRequestError &&
      [PRISMA_ERRORS.INCONSITENT, PRISMA_ERRORS.NOT_FOUND].includes(error.code as PRISMA_ERRORS)
    ) {
      message = "Record not found.";
      status = "404";
    }

    if (error instanceof PrismaClientValidationError) {
      message = "Please check field types.";
      status = "400";
    }

    if (error instanceof TypeError || error instanceof ReferenceError || error instanceof SyntaxError) {
      message = null;
      status = "500";
    }

    return generateResponse(status, message || "Something went wrong.", res);
  });

export const isInvalidObject = (keys: string[], object: Object) => Object.keys(object).some((key) => !keys.includes(key));
export const isValidJSONString = (value: string) => {
  try {
    JSON.parse(value);
  } catch (error) {
    return false;
  }
  return true;
};

export const getUser = async (request: NextApiRequest) => {
  try {
    let token = request?.headers?.token as string;
    if (!token && request.headers.cookie) {
      token = `Bearer ${cookie.parse(request.headers.cookie).token}`;
    }

    const decoded = (await decodeJWT(request?.headers?.authorization || token)) as User;

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
      include: {
        interests: {
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const createStripeUser = async (email: string) => {
  const customer = await stripe.customers.create({
    email,
    name: email,
    address: {
      city: "Kashiput",
      country: "India",
      line1: "Chamunda Vihar",
      postal_code: "244714",
    },
  });

  return customer.id;
};

export const createEphemeralKeys = (stripeCustomerId: string): Promise<Stripe.Response<Stripe.EphemeralKey>> =>
  stripe.ephemeralKeys.create(
    {
      customer: stripeCustomerId,
    },
    {
      apiVersion: "2020-08-27",
    },
  );

export const createPaymentIntent = (
  total: number,
  stripeCustomerId: string,
  defaultAddress: Address,
): Promise<Stripe.Response<Stripe.PaymentIntent>> =>
  stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
    description: `Payment of amount $${total / 100} successfully done.`,
    customer: stripeCustomerId,
    shipping: {
      name: `${defaultAddress.firstName} ${defaultAddress.lastName}`,
      address: {
        line1: defaultAddress.streetName,
        postal_code: defaultAddress.pin,
        city: defaultAddress.city,
        state: defaultAddress.state,
        country: "US",
      },
    },
  });

export const fetchPaymentMethods = async (customerId: string) => {
  try {
    const response = await stripe.customers.listPaymentMethods(customerId, { type: "card" });
    return response.data;
  } catch (error) {
    throw new Error("Error while fetching cards");
  }
};

export const fetchPaymentInfo = (paymentIntentId: string) => stripe.paymentIntents.retrieve(paymentIntentId);

export const wait = (delay: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};
