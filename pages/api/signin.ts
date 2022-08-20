import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { PartialBy, RequestType } from "../../utils/types";
import { checkRequestType, comparePassword, generateJWT, generateResponse } from "../../utils";
import { validateUserCred } from "../../utils/validation";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);

  try {
    const body = req.body || {};
    const validationResponse = await validateUserCred(body);

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

    console.log(user);
    if (req.body.isAdmin && !user?.isAdmin) {
      throw new Error("You're not allowed to access the portal.");
    }

    // throw ⚠️ if password not matched else generate jwt
    const isPasswordMatched = comparePassword(body.password, user.password);

    if (!isPasswordMatched) {
      throw new Error("User credential not matched.");
    }

    if (user) {
      const data: PartialBy<User, "password"> = user;
      const token = await generateJWT(user.id);

      delete data.password;

      if (user.isAdmin && req.body.isAdmin) {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: "strict",
            path: "/",
          }),
        );
      }

      return generateResponse("200", "You have been successfully logged in.", res, {
        token,
        data: {
          ...data,
        },
      });
    }
  } catch (error: any) {
    const message = error?.message || "Something went wrong.";
    return generateResponse("401", message, res);
  }
};
