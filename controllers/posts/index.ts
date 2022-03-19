import { NextApiRequest, NextApiResponse } from "next";

import { generateResponse } from "../../utils";
import prisma from "../../utils/prisma";
import { FileType } from "../../utils/types";
import { upload_on_imagekit } from "../../utils/upload";
import { validateProduct } from "../../utils/validation";

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {};

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
  data.category = JSON.parse(req.body.categories);
  data.slideColors = JSON.parse(req.body.slideColors);
  data.discount = parseFloat(req.body.discount) || 0;

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

export default {
  getRequestHandler,
  postRequestHandler,
};
