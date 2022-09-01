import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

import { RequestType } from "../../utils/types";
import { checkRequestType, generateResponse } from "../../utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
        path: "/",
      }),
    );
    return generateResponse("200", "You have been successfully logged in.", res);
  } catch (error: any) {
    const message = error?.message || "Something went wrong.";
    return generateResponse("401", message, res);
  }
};
