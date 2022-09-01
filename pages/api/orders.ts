import { Prisma, Transactions } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { checkRequestType, generateResponse, getUser } from "../../utils";
import prisma from "../../utils/prisma";
import { RequestType } from "../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized.", redirect: true });
  }

  checkRequestType("GET", req.method as RequestType, res);

  try {
    // const user = await getUser(req);

    const take = req.query.take !== undefined ? parseInt(req.query?.take as string) : 10;
    const skip = req.query.skip !== undefined ? parseInt(req.query?.skip as string) : 0;

    const options: Prisma.TransactionsFindManyArgs = {};

    options.orderBy = {
      createdAt: "desc",
    };

    options.include = {
      user: {
        select: {
          email: true,
          fullname: true,
          profile: true,
        },
      },
    };

    // if (!user) {
    //   return generateResponse("401", "Please login to continue.", res);
    // }

    const totalOrdersPromise = prisma.transactions.count({});
    const transactionsPromise = prisma.transactions.findMany({ skip, take, ...options });

    const [count, orders]: [number, Transactions[]] = await Promise.all([totalOrdersPromise, transactionsPromise]);

    const prefix = req.headers.host?.includes("localhost") ? "http://" : "https://";
    const url = `${prefix}${req.headers.host}/api/orders/`;
    const nextTake = skip + take;
    const next = nextTake >= count ? null : `${url}?take=${take}&skip=${nextTake}`;

    return generateResponse("200", "Card fetched successfull.", res, {
      data: orders,
      next,
      count,
    });
  } catch (error) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
