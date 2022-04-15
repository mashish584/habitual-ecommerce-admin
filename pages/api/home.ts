import { NextApiResponse, NextApiRequest } from "next";

import { RequestType } from "../../utils/types";
import { checkRequestType, generateResponse } from "../../utils";
import prisma from "../../utils/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("GET", req.method as RequestType, res);
  /**
   * Information required for mobile home screen
   * - Feature product listing (max:10)
   * - Hot deals (max:10)
   * - Your interests if interests added in a profile
   */
  // const user = await getUser(req);

  const fetchFeaturedProductPromise = prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    skip: 0,
    take: 10,
  });

  const fetchHotDealsPromise = prisma.product.findMany({
    where: {
      quantity: { gt: 0 },
    },
    orderBy: {
      discount: "desc",
    },
  });

  await Promise.all([fetchFeaturedProductPromise, fetchHotDealsPromise]);

  return generateResponse("200", "Home data fetched.", res);
};
