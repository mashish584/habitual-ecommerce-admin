import { NextApiRequest, NextApiResponse } from "next";
import { checkRequestType, generateResponse } from "../../utils";
import prisma from "../../utils/prisma";
import { RequestType } from "../../utils/types";
import { validateCategory } from "../../utils/validation";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  checkRequestType("POST", req.method as RequestType, res);
  try {
    const validationResponse = await validateCategory(req.body);

    if (validationResponse) {
      return generateResponse("400", "Invalid input provided.", res, validationResponse);
    }

    const category = await prisma.category.create({ data: req.body });

    return generateResponse("200", "Category saved.", res, { category });
  } catch (error) {
    return generateResponse("400", "Something went wrong.", res);
  }
};
