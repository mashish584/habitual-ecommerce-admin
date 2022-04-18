import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { PartialBy, RequestType } from "../../utils/types";
import { checkRequestType, createStripeUser, generateJWT, generateResponse, hashPhassword } from "../../utils";
import { validateUserCred } from "../../utils/validation";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);

  try {
    const body = (req.body || {}) as User;
    const validationResponse = await validateUserCred(body);

    if (validationResponse) {
      return generateResponse("400", "Invalid input provided.", res, validationResponse);
    }

    body.password = await hashPhassword(body.password);
    body.stripe_customer_id = await createStripeUser(body.email);

    const user: PartialBy<User, "password"> = await prisma.user.create({
      data: body,
    });

    const token = await generateJWT(user.id);

    delete user.password;

    return generateResponse("200", "Your account is successfully created.", res, {
      token,
      data: {
        ...user,
      },
    });
  } catch (error) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
