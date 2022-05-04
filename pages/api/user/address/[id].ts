import { User } from "@prisma/client";
import { NextApiResponse, NextApiRequest } from "next";

import { checkRequestType, generateResponse, getUser } from "../../../../utils";
import prisma from "../../../../utils/prisma";
import { Address, RequestType } from "../../../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    checkRequestType("PATCH", req.method as RequestType, res);
    let user = (await getUser(req)) as Partial<User>;
    const addressId = req.query?.id as string;
    const { body } = req;

    // ⚠️ User not authorised
    if (!user) {
      return generateResponse("401", "Please login to update address.", res);
    }

    // ⚠️ If address not exist
    if (!body.address && !body.default) {
      return generateResponse("400", "Please provide  data.", res);
    }

    // ⚠️ if addressId not in records
    const existingAddresses = user?.addresses || [];
    let addressIndex = -1;
    const isAddressExist = user.addresses?.some((address, index) => {
      const existingAddress = address as Address;
      if (existingAddress.id === addressId) {
        addressIndex = index;
        return true;
      }
    });

    if (!user?.addresses || !isAddressExist) {
      return generateResponse("400", "Address id not associate with any address in system.", res);
    }

    // 🔥 Update address
    if (body.default) {
      existingAddresses.map((address) => {
        const addr = address as Address;
        if (addr.id === addressId) {
          addr.default = true;
        } else {
          addr.default = false;
        }
      });
    }

    if (body.address) {
      const lastAddressUpdate = existingAddresses[addressIndex] as Object;
      existingAddresses[addressIndex] = { ...lastAddressUpdate, ...body.address };
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: { addresses: [...existingAddresses] },
    });

    delete user.password;

    return generateResponse("400", "Address successfully updated.", res, { data: user });
  } catch (err) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
