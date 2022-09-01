import { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";

import prisma from "../../utils/prisma";
import { generateResponse, getUser } from "../../utils";
import { validateCategory, validateImageUpload } from "../../utils/validation";
import { delete_image_from_imagekit, upload_on_imagekit } from "../../utils/upload";

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { parent, child, parentId, childLimit, exclude } = req.query;
  const search = req.query.search as string;

  const options: Prisma.CategoryFindManyArgs = {};

  if (parent) {
    options.where = {
      parentId: {
        isSet: false,
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
        not: null,
      },
      name: {
        contains: search,
      },
    };
  }

  if (exclude) {
    const ids = typeof exclude === "string" ? [exclude] : exclude;
    options.where = {
      ...options.where,
      id: {
        notIn: ids,
      },
    };
  }

  let categories;
  if (childLimit && typeof parentId !== "string" && parentId) {
    categories = await Promise.all(
      parentId.map((id) => {
        options.where = { parentId: id };
        options.take = parseInt(childLimit as string);
        return prisma.category.findMany({
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
      }),
    );
    categories = categories.flat(1);
  } else {
    categories = await prisma.category.findMany({
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
  }

  return generateResponse("200", "Categories fetched.", res, { data: categories });
};

const postRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized.", redirect: true });
  }

  const validationResponse = await validateCategory(req.body);

  if (validationResponse) {
    return generateResponse("400", "Invalid input provided.", res, validationResponse);
  }

  const data = { name: req.body.name } as Prisma.CategoryCreateInput;

  if (req.file && validateImageUpload(req.file, res)) {
    const response = await upload_on_imagekit(req.file.buffer, req.file.originalname);
    data.image = response.url;
    data.categoryImageId = response.fileId;
  }

  if (req.body.parent) {
    data.parentCategory = {
      connect: {
        id: req.body.parent,
      },
    };
  }

  const category = await prisma.category.create({
    data,
    include: {
      parentCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return generateResponse("200", "Category saved.", res, { data: category });
};

const patchRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized.", redirect: true });
  }

  const categoryId = req.query?.id as string;

  const validateResponse = await validateCategory(req.body);

  if (validateResponse) {
    return generateResponse("400", "Invalid input provided.", res, validateResponse);
  }

  const category = await prisma.category.findFirst({ where: { id: categoryId } });

  if (!category?.id) {
    throw new Error("Category not found.");
  }

  const data = {} as Prisma.CategoryUpdateInput;

  if (req.body.name) {
    data.name = req.body.name;
  }

  if (req.body.parent) {
    data.parentCategory = {
      connect: {
        id: req.body.parent,
      },
    };
  }

  if (req.file && validateImageUpload(req.file, res)) {
    // → remove old image if exist in records from imagekit server
    if (category.categoryImageId) {
      await delete_image_from_imagekit(category.categoryImageId);
    }

    const response = await upload_on_imagekit(req.file.buffer, req.file.originalname);
    data.image = response.url;
    data.categoryImageId = response.fileId;
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data,
    include: {
      parentCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return generateResponse("200", "Category updated.", res, { data: updatedCategory });
};

const deleteRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized.", redirect: true });
  }

  const categoryId = req.query?.id as string;

  const category = await prisma.category.findFirst({ where: { id: categoryId } });

  if (!category?.id) {
    throw new Error("Category not found");
  }

  // → Delete category image from imagekit server if exist
  if (category.categoryImageId) {
    await delete_image_from_imagekit(category.categoryImageId);
  }

  await prisma.category.delete({ where: { id: categoryId } });

  return generateResponse("200", `${category.name} is removed successfylly.`, res);
};

export default {
  getRequestHandler,
  postRequestHandler,
  patchRequestHandler,
  deleteRequestHandler,
};
