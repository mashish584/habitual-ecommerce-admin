import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { checkRequestType, generateResponse, getUser } from "../../../utils";
import prisma from "../../../utils/prisma";
import { RequestType } from "../../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("GET", req.method as RequestType, res);
  try {
    const take = req.query.take !== undefined ? parseInt(req.query?.take as string) : 10;
    const skip = req.query.skip !== undefined ? parseInt(req.query?.skip as string) : 0;
    const user = await getUser(req);

    if (!user) {
      return generateResponse("401", "Please login to continue.", res);
    }

    const args: Prisma.TransactionsFindManyArgs = { where: { userId: user.id }, skip, take };

    const [orders, count] = await Promise.all([prisma.transactions.findMany(args), prisma.transactions.count({ where: args.where })]);

    const prefix = req.headers.host?.includes("localhost") ? "http://" : "https://";
    const nextTake = skip + take;
    const next = nextTake >= count ? null : `${prefix}${req.headers.host}/api/user/orders/?take=${take}&skip=${nextTake}`;

    return generateResponse("200", "Orders fetched.", res, { data: orders, next });
  } catch (error) {
    console.log({ error });
    return generateResponse("400", "Something went wrong.", res);
  }
};
