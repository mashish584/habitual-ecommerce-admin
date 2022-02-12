import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import prisma from "../../utils/prisma";
import { generateResponse } from "../../utils";
import { validateCategory, validateImageUpload } from "../../utils/validation";
import { upload_on_imagekit } from "../../utils/upload";

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const categories = await prisma.category.findMany();
  return generateResponse("200", "Categories fetched.", res, { categories });
};

const postRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const validationResponse = await validateCategory(req.body);

  if (validationResponse) {
    return generateResponse("400", "Invalid input provided.", res, validationResponse);
  }

  const data = { name: req.body.name } as Prisma.CategoryCreateInput;

  if (req.file && validateImageUpload(req.file, res)) {
    const response = await upload_on_imagekit(req.file.buffer, req.file.originalname);
    data.image = response.url;
  }

  if (req.body.parent) {
    data.parentCategory = {
      connect: {
        id: req.body.parent,
      },
    };
  }

  const category = await prisma.category.create({ data });

  return generateResponse("200", "Category saved.", res, { category });
};

const patchRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
};

const deleteRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const categoryId = req.query?.id as string;

  const category = await prisma.category.delete({ where: { id: categoryId } });

  return generateResponse("200", `${category.name} is remvoed successfylly.`, res);
};

export default {
  getRequestHandler,
  postRequestHandler,
  patchRequestHandler,
  deleteRequestHandler,
};
