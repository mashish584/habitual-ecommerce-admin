import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import { Prisma } from "@prisma/client";
import upload, { upload_on_imagekit } from "../../../utils/upload";
import { catchAsyncError, generateResponse, isValidJSONString } from "../../../utils";
import { validateImageUpload } from "../../../utils/validation";
import prisma from "../../../utils/prisma";

const patchHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.query?.id as string;

  const { fullname, profile, interests } = req.body;
  const data = {} as Prisma.UserCreateInput;

  if (req.file && validateImageUpload(req.file, res)) {
    const response = await upload_on_imagekit(req.file.buffer, req.file.originalname);
    data.profile = response.url;
  }

  if (fullname || fullname?.trim() === "") {
    data.fullname = fullname || "";
  }

  if (profile?.trim() === "") {
    data.profile = "";
  }

  if (isValidJSONString(interests)) {
    const selectedInterests = JSON.parse(interests);
    if (!Array.isArray(selectedInterests)) {
      throw new Error("Interests value is not valid.");
    }

    data.interests = {
      connect: JSON.parse(interests).map((interest: string) => ({ id: interest })),
    };
  }

  await prisma.user.update({ where: { id: userId }, data });

  return generateResponse("200", "Profile info updated.", res);
};

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch: (req, res) => generateResponse("405", `Request type ${req.method} is not allowed.`, res),
})
  .use(upload().single("profile"))
  .patch(catchAsyncError(patchHandler));

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
