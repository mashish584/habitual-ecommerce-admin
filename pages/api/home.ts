import { NextApiResponse, NextApiRequest } from "next";

import { Product } from "@prisma/client";
import { RequestType } from "../../utils/types";
import { catchAsyncError, checkRequestType, generateResponse, getUser } from "../../utils";
import prisma from "../../utils/prisma";

const HomeAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("GET", req.method as RequestType, res);

  const isAdmin = req.query.isAdmin || false;

  if (!isAdmin) {
    /**
     * Information required for mobile home screen
     * - Feature product listing (max:10)
     * - Hot deals (max:10)
     * - Your interests if interests added in a profile
     */
    const user = await getUser(req);

    const fetchFeaturedProductPromise = prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
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

    const userInterests: Record<string, Partial<Product>[]> = {};
    if (user?.id && user?.interests?.length) {
      const categoryIds: string[] = [];

      user.interests.map((interest) => {
        if (interest.id && !categoryIds.includes(interest.id)) {
          categoryIds.push(interest.id);
        }
      });

      for (let productIdIndex = 0; productIdIndex < categoryIds.length; productIdIndex++) {
        const products = await prisma.product.findMany({
          where: {
            categoryIds: {
              hasSome: [categoryIds[productIdIndex]],
            },
          },
          skip: 0,
          take: 3,

          select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            images: true,
            category: {
              select: {
                name: true,
                parentCategory: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        products.map((product) => {
          const category = product.category[0];
          const key = category.parentCategory ? category.parentCategory.name : category.name;
          if (!userInterests[key]) {
            userInterests[key] = [];
          }

          const index = userInterests[key].findIndex((existProduct) => existProduct.id === product.id);
          if (index === -1) {
            userInterests[key].push(product);
          }
        });
      }
    }

    const [featuredProducts, hotDeals] = await Promise.all([fetchFeaturedProductPromise, fetchHotDealsPromise]);

    return generateResponse("200", "Home data fetched.", res, {
      data: {
        featuredProducts,
        hotDeals,
        userInterests,
      },
    });
  }
  const usersCountPromise = prisma.user.count();
  const productsCountPromise = prisma.product.count();
  const ordersCountPromise = prisma.transactions.count();

  const [user, product, order] = await Promise.all([usersCountPromise, productsCountPromise, ordersCountPromise]);

  const recentOrders = await prisma.transactions.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          email: true,
          fullname: true,
          profile: true,
        },
      },
    },
  });

  return generateResponse("200", "Home data fetched", res, {
    data: {
      count: {
        user,
        product,
        order,
      },
      recentOrders,
    },
  });
};

export default catchAsyncError(HomeAPI);
