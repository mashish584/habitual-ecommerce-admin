import { User } from "@prisma/client";
import { NextApiResponse, NextApiRequest } from "next";
import { v4 as uuidv4 } from "uuid";

import { checkRequestType, generateResponse, getUser } from "../../../../utils";
import prisma from "../../../../utils/prisma";
import { RequestType } from "../../../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    checkRequestType("POST", req.method as RequestType, res);
    const user = (await getUser(req)) as Partial<User>;
    const { body } = req;
    console.log(body);

    // ⚠️ User not authorised
    if (!user) {
      return generateResponse("401", "Please login to add address.", res);
    }

    // ⚠️ If address not exist
    if (!body.address) {
      return generateResponse("400", "Please provide address data.", res);
    }

    // 🔥 Update address
    const existingAddresses = user?.addresses || [];
    body.address.id = uuidv4();
    const updatedInfo = await prisma.user.update({ where: { id: user.id }, data: { addresses: [...existingAddresses, body.address] } });
    delete user.password;

    return generateResponse("200", "Address successfully updated.", res, { data: updatedInfo });
  } catch (err) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
