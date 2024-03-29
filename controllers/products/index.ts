import { Category, Prisma, Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../utils/prisma";
import { FileType } from "../../utils/types";
import { delete_image_from_imagekit, upload_on_imagekit } from "../../utils/upload";
import { validateProduct } from "../../utils/validation";
import { generateResponse, getUser } from "../../utils";

type CategoryInfo = Pick<Category, "id" | "name">[];
type ProductInfo = Partial<Product> & { categories?: CategoryInfo };

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const take = req.query.take !== undefined ? parseInt(req.query?.take as string) : 10;
  const skip = req.query.skip !== undefined ? parseInt(req.query?.skip as string) : 0;

  const options: Prisma.ProductFindManyArgs = {};

  // 🔍 product based on title and description
  if (req.query?.search) {
    const searchText = req.query.search as string;
    options.where = {
      OR: [
        {
          title: {
            contains: searchText,
            mode: "insensitive",
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
  if (req?.query?.select) {
    const selectedFields = typeof req?.query?.select === "string" ? [req.query.select] : req.query.select;

    const selection = selectedFields.reduce(
      (previousValues, currentValue) => ({ ...previousValues, ...{ [currentValue]: true } }),
      {} as Prisma.ProductSelect,
    );

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

  const [count, products]: [number, ProductInfo[]] = await Promise.all([totalCountPromise, productsPromise]);

  const prefix = req.headers.host?.includes("localhost") ? "http://" : "https://";
  const url = `${prefix}${req.headers.host}/api/products/`;
  const nextTake = skip + take;
  const next = nextTake >= count ? null : `${url}?take=${take}&skip=${nextTake}`;

  return generateResponse("200", "Products fetched..", res, { data: products, next, count });
};

const getIndividualProductHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const productId = req.query?.id as string;

  const product = await prisma.product.findFirst({
    where: { id: productId },
    include: {
      category: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  return generateResponse("200", "Product info fetched.", res, { data: product });
};

const postRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized.", redirect: true });
  }

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
    data: product,
  });
};

const patchRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized.", redirect: true });
  }

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

  const product = await prisma.product.update({
    where: { id: productId },
    data,
    include: {
      category: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return generateResponse("200", "Product created endpoint hit.", res, { data: product });
};

const deleteProductImageHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getUser(req);

  if (!user?.isAdmin) {
    return generateResponse("403", "Unauthorized access.", res, { errorMessage: "You're not authorized.", redirect: true });
  }

  const imageId = req.query?.id;
  const productId = req.body?.productId;

  if (!productId) {
    throw new Error("Product id not provided.");
  }

  // ⚠️ productId not exist
  const productInfo = await prisma.product.findFirst({ where: { id: productId } });

  if (!productInfo) {
    throw new Error("Product id not found.");
  }

  const images = productInfo.images || [];

  if (productInfo.images.length === 1) {
    throw new Error("You're not allowed to delete only present image of product.");
  }

  // ⚠️ imageId not exist
  const imageIndex = images?.findIndex((product: any) => product?.fileId === imageId);

  if (imageIndex === -1) {
    throw new Error("Image id not found in product.");
  }

  const slideColors = productInfo.slideColors || [];
  if (slideColors.length > 1) {
    slideColors.splice(imageIndex, 1);
  }

  // 🗑 image from imagekit and update product image field
  await delete_image_from_imagekit(imageId as string);
  images.splice(imageIndex, 1);

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      images,
      slideColors,
    },
    include: {
      category: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  return generateResponse("200", "Product image removed.", res, { data: product });
};

export default {
  getRequestHandler,
  getIndividualProductHandler,
  postRequestHandler,
  patchRequestHandler,
  deleteProductImageHandler,
};
