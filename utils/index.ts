import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

import { RequestType, Status } from "./types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PRISMA_ERRORS } from "./enum";

export const generateResponse = (status: Status, message: string, res: NextApiResponse, extraInfo?: object) =>
  res.status(parseInt(status)).json({
    message,
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

export const comparePassword = (password: string, currentPassword: string) => bcrypt.compare(password, currentPassword);

export const catchAsyncError =
  (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<any>) => (req: NextApiRequest, res: NextApiResponse) => {
    return fn(req, res).catch((error) => {
      let message = "";

      if (
        error instanceof PrismaClientKnownRequestError &&
        [PRISMA_ERRORS.INCONSITENT, PRISMA_ERRORS.NOT_FOUND].includes(error.code as PRISMA_ERRORS)
      ) {
        message = "Parent not found.";
      }

      return generateResponse("400", message || "Something went wrong.", res);
    });
  };
