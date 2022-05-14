import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { checkRequestType, generateResponse, getUser } from "../../../utils";
import { RequestType } from "../../../utils/types";
import prisma from "../../../utils/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("GET", req.method as RequestType, res);
  try {
    const take = req.query.take !== undefined ? parseInt(req.query?.take as string) : 10;
    const skip = req.query.skip !== undefined ? parseInt(req.query?.skip as string) : 0;
    const user = await getUser(req);

    if (!user) {
      return generateResponse("401", "Please login to continue.", res);
    }

    const args: Prisma.ProductFindManyArgs = { where: { id: { in: user.favouriteProductIds } }, skip, take };

    if (req.query.select && typeof req.query?.select === "string") {
      const selection = req.query?.select
        .split(",")
        .reduce((previouseValue, currentValue) => ({ ...previouseValue, ...{ [currentValue]: true } }), {} as Prisma.ProductSelect);

      if (Object.keys(selection).length) {
        if (Object.keys(selection).includes("category")) {
          selection.category = {
            select: {
              id: true,
              name: true,
            },
          };
        }
        args.select = selection;
      }
    }

    const [products, count] = await Promise.all([prisma.product.findMany(args), prisma.product.count({ where: args.where })]);

    const prefix = req.headers.host?.includes("localhost") ? "http://" : "htttps://";
    const nextTake = skip + take;
    const next = nextTake >= count ? null : `${prefix}${req.headers.host}/api/user/favourites/?take=${take}&skip=${nextTake}`;

    return generateResponse("200", "Orders fetched.", res, { data: products, next });
  } catch (error) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
