import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import Error from "next/error";

import { generateResponse } from "../../utils";
import { ErrorMessages } from "../../utils/preconfig";

import prisma from "../../utils/prisma";
import { RequestType } from "../../utils/types";
import { validateCategory } from "../../utils/validation";

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const categories = await prisma.category.findMany({});
    return generateResponse("200", "Categories fetched.", res, { categories });
  } catch (error) {
    return generateResponse("400", "Something went wrong.", res);
  }
};

const postRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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

const patchRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const categoryId = req.query?.id as string;

    const validateResponse = await validateCategory(req.body);

    if (validateResponse) {
      return generateResponse("400", "Invalid input provided.", res, validateResponse);
    }

    const category = await prisma.category.findFirst({ where: { id: categoryId } });

    if (!category?.id) {
      throw new Error("Category not found.");
    }

    await prisma.category.update({ where: { id: categoryId }, data: req.body });

    return generateResponse("200", "Category updated.", res);
  } catch (error) {
    return generateResponse("400", "Somthing went wrong", res);
  }
};

const deleteRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const categoryId = req.query?.id as string;

    const category = await prisma.category.delete({ where: { id: categoryId } });

    return generateResponse("200", `${category.name} is remvoed successfylly.`, res);
  } catch (error) {
    let message = "";

    if (error instanceof PrismaClientKnownRequestError) {
      message = ErrorMessages[error.code];
    }

    return generateResponse("400", message || "Somthing went wrong", res);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.method);
  switch (req.method as RequestType) {
    case "GET":
      return getRequestHandler(req, res);
    case "POST":
      return postRequestHandler(req, res);
    case "PATCH":
      return patchRequestHandler(req, res);
    case "DELETE":
      return deleteRequestHandler(req, res);
    default:
      return generateResponse("405", `Request type ${req.method} is not allowed.`, res);
  }
};
