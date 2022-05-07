import { NextApiRequest, NextApiResponse } from "next";

import {
  checkRequestType, createEphemeralKeys, createPaymentIntent, generateResponse, getUser,
} from "../../utils";
import prisma from "../../utils/prisma";
import { Address, RequestType } from "../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);

  try {
    const cartItems = req.body?.cart || {}; // { quantity : 3 }
    const user = await getUser(req);

    if (!user) {
      return generateResponse("401", "Please login to continue.", res);
    }

    const ephemeralKey = await createEphemeralKeys(user.stripe_customer_id);
    const productIds = Object.keys(cartItems);

    if (!productIds.length) {
      return generateResponse("200", "Cart is empty.", res);
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        price: true,
        title: true,
      },
    });

    const cartTotal = products.reduce((prevValue, product) => prevValue + product.price * cartItems[product.id].quantity, 0);

    const defaultAddress = user.addresses.filter((address) => {
      const userAddress = address as Address;
      return userAddress.default;
    })[0];
    const paymentIntent = await createPaymentIntent(cartTotal * 100, user.stripe_customer_id, defaultAddress as Address);

    return generateResponse("200", "Purchased successfull.", res, {
      data: {
        paymentId: paymentIntent.id,
        publishableKey: process.env.STRIPE_PUBLIC,
        paymentIntent: paymentIntent.client_secret,
        customer: user.stripe_customer_id,
        ephemeralKey: ephemeralKey.secret,
        cartTotal,
      },
    });
  } catch (error) {
    console.log({ error });
    return generateResponse("400", "Something went wrong.", res);
  }
};
