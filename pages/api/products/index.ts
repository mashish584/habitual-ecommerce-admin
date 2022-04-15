import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import controller from "../../../controllers/products";
import { catchAsyncError, generateResponse } from "../../../utils";

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: (req, res) => generateResponse("405", `Request type ${req.method} is not allowed.`, res),
}).get(catchAsyncError(controller.getRequestHandler));

export default handler;
