import { NextApiRequest, NextApiResponse } from "next";

import { generateResponse } from "../../utils";
import { validateProduct } from "../../utils/validation";

const getRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {};

const postRequestHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const files = req.files || [];
  const validationResponse = await validateProduct({ ...req.body, images: files });

  if (validationResponse) {
    return generateResponse("400", "Invalid input provided.", res, validationResponse);
  }

  return generateResponse("200", `Product created endpoint hit.`, res);
};

export default {
  getRequestHandler,
  postRequestHandler,
};
