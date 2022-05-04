import nc from "next-connect";
import { NextApiResponse, NextApiRequest } from "next";

import controller from "../../../../controllers/address";
import { catchAsyncError, generateResponse } from "../../../../utils";

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: (req, res) => generateResponse("405", `Request type ${req.method} is not allowed.`, res),
})
  .patch(catchAsyncError(controller.patchRequestHandler))
  .delete(catchAsyncError(controller.deleteRequestHandler));

export default handler;
