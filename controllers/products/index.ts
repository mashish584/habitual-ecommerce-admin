import { Category, Prisma, Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import { generateResponse } from "../../utils";
import prisma from "../../utils/prisma";
import { FileType } from "../../utils/types";
import { delete_image_from_imagekit, upload_on_imagekit } from "../../utils/upload";
import { validateProduct } from "../../utils/validation";

type CategoryInfo = Pick<Category, "id" | "name">[];
type ProductInfo = Partial<Product> & { categories?: CategoryInfo };

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const skip = parseInt((req.query?.skip || "0") as string);
  const take = parseInt((req?.query?.take || "10") as string);

  const options: Prisma.ProductFindManyArgs = {};

  // 🔍 product based on title and description
  if (req.query?.search) {
    const searchText = req.query.search as string;
    options.where = {
      OR: [
        {
          title: {
            contains: searchText,
          },
        },
        {
          description: {
            contains: searchText,
          },
        },
      ],
    };
  }

  // 👀 for products with category
  if (req?.query?.category) {
    const categories = typeof req.query.category === "string" ? [req.query.category] : req?.query?.category;

    options.where = {
      categoryIds: {
        hasSome: categories,
      },
    };
  }

  // 👀 for featured products
  if (req?.query?.isFeatured === "true") {
    options.where = {
      ...options.where,
      isFeatured: true,
    };
  }

  // 👀 for products with hot deals
  if (req.query?.isHotDeals === "true") {
    options.where = {
      ...options.where,
      discount: {
        gt: 0,
      },
    };

    options.orderBy = {
      discount: "desc",
    };
  }

  // 👀 for selection fields
  // expecting to be a string with comma seperated values
  if (req?.query?.select && typeof req.query?.select === "string") {
    const selection = req.query?.select
      .split(",")
      .reduce((previousValues, currentValue) => ({ ...previousValues, ...{ [currentValue]: true } }), {} as Prisma.ProductSelect);

    if (Object.keys(selection).length) {
      // if category field in selection
      if (Object.keys(selection).includes("category")) {
        selection.category = {
          select: {
            id: true,
            name: true,
          },
        };
      }

      options.select = selection;
    }
  }

  const totalCountPromise = prisma.product.count({ where: options.where });
  const productsPromise = prisma.product.findMany({ skip, take, ...options });

  const [totalCount, products]: [number, ProductInfo[]] = await Promise.all([totalCountPromise, productsPromise]);

  return generateResponse("200", "Products fetched..", res, { totalCount, products });
};

const postRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const files = req.files || [];

  const data = { ...req.body, images: files };
  const validationResponse = await validateProduct(data);

  if (validationResponse) {
    return generateResponse("400", "Invalid input provided.", res, validationResponse);
  }

  // → Parsing data in type defined in schema
  data.price = parseFloat(req.body.price);
  data.quantity = parseInt(req.body.quantity);
  data.discount = parseFloat(req.body.discount) || 0;

  const categories = JSON.parse(req.body.categories);

  if (categories.length) {
    data.category = {
      connect: categories.map((categpry: string) => ({ id: categpry })),
    };
  }

  // → Check for slide colors
  if (data.slideColors) {
    data.slideColors = JSON.parse(req.body.slideColors);
  }

  // → Check for variants property
  if (data.variants) {
    data.variants = JSON.parse(data.variants);
  }

  delete data.categories;

  // → uploading images to imagekit
  const images = await Promise.all(files.map((image: FileType) => upload_on_imagekit(image.buffer, image.originalname)));

  // → Add product
  const product = await prisma.product.create({ data: { ...data, images } });

  return generateResponse("200", "Product created endpoint hit.", res, {
    product,
  });
};

const patchRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const productId = req.query?.id as string;

  // → Fetch product details
  const productInfo = await prisma.product.findFirst({ where: { id: productId } });

  // ⚠️ Product not exist
  if (!productInfo) {
    throw new Error("Product not found.");
  }

  const files = req.files || [];

  const data = { ...req.body, images: files };
  const validationResponse = await validateProduct(data, productInfo);

  if (validationResponse) {
    return generateResponse("400", "Invalid input provided.", res, validationResponse);
  }

  // → If data is ✌️ parse the required values and if
  // → new images added by user upload them
  if (data.price) data.price = parseFloat(req.body.price);
  if (data.quantity) data.quantity = parseInt(req.body.quantity);
  if (data.slideColors) data.slideColors = JSON.parse(req.body.slideColors);
  if (data.discount) data.discount = parseFloat(req.body.discount) || 0;
  if (data.categories) {
    const categories = JSON.parse(req.body.categories);
    data.category = {
      disconnect: productInfo.categoryIds.map((id) => ({ id })),
      connect: categories.map((categpry: string) => ({ id: categpry })),
    };
    delete data.categories;
  }

  if (data.images.length) {
    const images = await Promise.all(files.map((image: FileType) => upload_on_imagekit(image.buffer, image.originalname)));
    data.images = [...productInfo.images, ...images];
  } else {
    delete data.images;
  }

  const product = await prisma.product.update({ where: { id: productId }, data });

  return generateResponse("200", "Product created endpoint hit.", res, { product });
};

const deleteProductImageHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const imageId = req.query?.id;
  const productId = req.body?.productId;

  // ⚠️ productId not exist
  const productInfo = await prisma.product.findFirst({ where: { id: productId } });

  if (!productInfo) {
    throw new Error("Product id not found.");
  }

  const images = productInfo.images || [];

  // ⚠️ imageId not exist
  const imageIndex = images?.findIndex((product: any) => product?.fileId === imageId);

  if (imageIndex === -1) {
    throw new Error("Image id not found in product.");
  }

  // 🗑 image from imagekit and update product image field
  await delete_image_from_imagekit(imageId as string);
  images.splice(imageIndex, 1);

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      images,
    },
  });

  return generateResponse("200", "Product image removed.", res, { product });
};

export default {
  getRequestHandler,
  postRequestHandler,
  patchRequestHandler,
  deleteProductImageHandler,
};
