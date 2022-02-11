import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../utils/prisma";
import { RequestType } from "../../utils/types";
import {
  checkRequestType, comparePassword, generateJWT, generateResponse,
} from "../../utils";
import { validateUserRegister } from "../../utils/validation";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);

  try {
    const body = req.body || {};
    const validationResponse = await validateUserRegister(body);

    if (validationResponse) {
      return generateResponse("400", "Invalid input provided.", res, validationResponse);
    }

    // 👀  for a user with email throw ⚠️  if not found
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) throw new Error("User credential not matched.");

    // throw ⚠️ if password not matched else generate jwt
    const isPasswordMatched = comparePassword(body.password, user.password);

    if (!isPasswordMatched) {
      throw new Error("User credential not matched.");
    }

    const token = await generateJWT(user.id);

    return generateResponse("200", "You have been successfully logged in.", res, {
      token,
    });
  } catch (error: any) {
    const message = error?.message || "Something went wrong.";

    return generateResponse("400", message, res);
  }
};
