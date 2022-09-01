import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

import { checkRequestType, fetchPaymentInfo, generateResponse, getUser } from "../../utils";
import prisma from "../../utils/prisma";
import { RequestType } from "../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);

  try {
    const user = await getUser(req);

    if (!user) {
      return generateResponse("401", "Please login to continue.", res);
    }

    const paymentIntentInfo = await fetchPaymentInfo(req.body.transactionId);
    let chargesData;
    if (paymentIntentInfo.charges.data.length) {
      chargesData = paymentIntentInfo.charges.data[0];
    }

    if (!paymentIntentInfo?.id) {
      throw new Error("Transaction not found.");
    }

    const transactionDetail = await prisma.transactions.create({
      data: {
        ...req.body,
        receiptUrl: chargesData ? chargesData.receipt_url : null,
        orderId: `hb-${v4().replace("-", "").substring(2, 14)}`,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Update purchase products quantity
    const orderedProducts = req.body.details;
    const updatePromise = Object.keys(orderedProducts).map(async (productId) => {
      const { quantity } = orderedProducts[productId];
      return prisma.product.update({
        where: { id: productId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });
    });

    await Promise.all(updatePromise);

    return generateResponse("200", "Purchased successfull.", res, {
      data: {
        ...transactionDetail,
      },
    });
  } catch (error) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
