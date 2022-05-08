import { NextApiRequest, NextApiResponse } from "next";

import {
  checkRequestType, fetchPaymentInfo, generateResponse, getUser,
} from "../../utils";
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

    if (!paymentIntentInfo?.id) {
      throw new Error("Transaction not found.");
    }

    const transactionDetail = await prisma.transactions.create({
      data: {
        ...req.body,
        receiptUrl: paymentIntentInfo.invoice,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return generateResponse("200", "Purchased successfull.", res, {
      data: {
        ...transactionDetail,
      },
    });
  } catch (error) {
    console.log({ error });
    return generateResponse("400", "Something went wrong.", res);
  }
};
