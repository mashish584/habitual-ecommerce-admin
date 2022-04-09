import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import prisma from "../../utils/prisma";
import { generateResponse } from "../../utils";
import { validateCategory, validateImageUpload } from "../../utils/validation";
import { upload_on_imagekit } from "../../utils/upload";

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { parent, child, parentId } = req.query;
  const search = req.query.search as string;

  const options: Prisma.CategoryFindManyArgs = {};

  if (parent) {
    options.where = {
      parentId: {
        equals: null,
      },
    };
  }

  if (child) {
    options.where = {
      parentId: {
        not: null,
      },
    };
  }

  if (parentId) {
    const parentIds = typeof parentId === "string" ? [parentId] : parentId;

    options.where = {
      parentId: {
        in: parentIds,
      },
    };
  }

  if (typeof search === "string" && search.trim() !== "") {
    options.where = {
      parentId: {
        equals: null,
      },
      name: {
        contains: search,
      },
    };
  }

  const categories = await prisma.category.findMany({
    ...options,
    include: {
      parentCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return generateResponse("200", "Categories fetched.", res, { data: categories });
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

  const data = { name: req.body.name } as Prisma.CategoryUpdateInput;

  if (req.file && validateImageUpload(req.file, res)) {
    const response = await upload_on_imagekit(req.file.buffer, req.file.originalname);
    data.image = response.url;
  }

  await prisma.category.update({ where: { id: categoryId }, data });

  return generateResponse("200", "Category updated.", res);
};

const deleteRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const categoryId = req.query?.id as string;

  const category = await prisma.category.delete({ where: { id: categoryId } });

  return generateResponse("200", `${category.name} is removed successfylly.`, res);
};

export default {
  getRequestHandler,
  postRequestHandler,
  patchRequestHandler,
  deleteRequestHandler,
};
