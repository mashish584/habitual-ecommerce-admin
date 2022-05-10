import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { User } from "@prisma/client";

import { catchAsyncError, generateResponse, getUser } from "../../../utils";
import prisma from "../../../utils/prisma";
import { PartialBy } from "../../../utils/types";

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);
  const productId = req?.query?.id;

  if (!user) {
    throw new Error("You're not allowed to perform this action.");
  }

  if (!productId) {
    throw new Error("Please provide product id.");
  }

  const isProductExist = await prisma.product.findFirst({ where: { id: productId as string } });

  if (!isProductExist) {
    throw new Error("Product id not exist in system.");
  }

  const updatedInfo: PartialBy<User, "password"> = await prisma.user.update({
    where: { id: user.id },
    data: {
      favouriteProducts: {
        connect: {
          id: productId as string,
        },
      },
    },
  });

  delete updatedInfo.password;

  return generateResponse("200", "Product marked as favourite.", res, { data: updatedInfo });
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);
  const productId = req.query?.id;

  if (!user) {
    throw new Error("You're not allowed to perform this action.");
  }

  if (!productId) {
    throw new Error("Please provide product id.");
  }

  const isProductExist = await prisma.product.findFirst({ where: { id: productId as string } });

  if (!isProductExist) {
    throw new Error("Product id not exist in system.");
  }

  const updatedInfo: PartialBy<User, "password"> = await prisma.user.update({
    where: { id: user.id },
    data: {
      favouriteProducts: {
        disconnect: {
          id: productId as string,
        },
      },
    },
  });

  return generateResponse("200", "Product unmarked as favourite.", res, { data: updatedInfo });
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: (req, res) => generateResponse("405", `Request type ${req.method} is not allowed.`, res),
})
  .post(catchAsyncError(postHandler))
  .delete(catchAsyncError(deleteHandler));

export default handler;
