import { Prisma, User } from "@prisma/client";
import { NextApiResponse, NextApiRequest } from "next";

import { generateResponse, getUser } from "../../utils";
import prisma from "../../utils/prisma";

type UserInfo = Partial<User> & { ordersCount?: Number };

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized." });
  }

  const take = req.query.take !== undefined ? parseInt(req.query?.take as string) : 10;
  const skip = req.query.skip !== undefined ? parseInt(req.query?.skip as string) : 0;

  const options: Prisma.ProductFindManyArgs = {};

  const totalCountPromise = prisma.user.count({ where: options.where });
  const usersPromise = prisma.user.findMany({
    skip,
    take,
    include: {
      interests: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  const [count, users]: [number, UserInfo[]] = await Promise.all([totalCountPromise, usersPromise]);

  for (const user of users) {
    const totalTransactions = await prisma.transactions.count({
      where: {
        userId: user.id,
      },
    });
    delete user.password;
    user.ordersCount = totalTransactions;
  }

  const prefix = req.headers.host?.includes("localhost") ? "http://" : "https://";
  const url = `${prefix}${req.headers.host}/api/users/`;
  const nextTake = skip + take;
  const next = nextTake >= count ? null : `${url}?take=${take}&skip=${nextTake}`;

  return generateResponse("200", "Products fetched..", res, { data: users, next, count });
};

export default { getRequestHandler };
