import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { RequestType } from "../../utils/types";
import {
  checkRequestType, createStripeUser, generateResponse, hashPhassword,
} from "../../utils";
import { validateUserCred } from "../../utils/validation";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);

  try {
    const user = (req.body || {}) as User;
    const validationResponse = await validateUserCred(user);

    if (validationResponse) {
      return generateResponse("400", "Invalid input provided.", res, validationResponse);
    }

    user.password = await hashPhassword(user.password);
    user.stripe_customer_id = await createStripeUser(user.email);

    await prisma.user.create({
      data: user,
    });

    return generateResponse("200", "Your account is successfully created.", res);
  } catch (error) {
    console.log({ error });
    return generateResponse("400", "Something went wrong.", res);
  }
};
