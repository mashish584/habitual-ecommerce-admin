import type { NextApiRequest, NextApiResponse } from "next";

import { checkRequestType, fetchPaymentMethods, generateResponse, getUser } from "../../utils";
import { RequestType } from "../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("GET", req.method as RequestType, res);

  try {
    const user = await getUser(req);

    if (!user) {
      return generateResponse("401", "Please login to continue.", res);
    }

    const cards = await fetchPaymentMethods(user.stripe_customer_id);

    return generateResponse("200", "Card fetched successfull.", res, {
      data: { cards },
    });
  } catch (error) {
    console.log({ error });
    return generateResponse("400", "Something went wrong.", res);
  }
};
