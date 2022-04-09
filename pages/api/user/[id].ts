import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import { Prisma, User } from "@prisma/client";
import upload, { delete_image_from_imagekit, upload_on_imagekit } from "../../../utils/upload";
import { catchAsyncError, generateResponse, isValidJSONString } from "../../../utils";
import { validateImageUpload } from "../../../utils/validation";
import prisma from "../../../utils/prisma";
import { PartialBy } from "../../../utils/types";

const patchHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.query?.id as string;

  const { fullname, profile, interests, joining_reasons } = req.body;
  const data = {} as Prisma.UserCreateInput;
  const user = await prisma.user.findFirst({ where: { id: userId } });

  if (req.file && validateImageUpload(req.file, res)) {
    const response = await upload_on_imagekit(req.file.buffer, req.file.originalname);
    data.profile = response.url;
    data.profileImageId = response.fileId;

    if (user?.profileImageId) {
      delete_image_from_imagekit(user.profileImageId);
    }
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

  if (isValidJSONString(joining_reasons)) {
    const selectedReasons = JSON.parse(joining_reasons);

    const isNotStringValue = selectedReasons.some((value: any) => typeof value !== "string");

    if (isNotStringValue) throw new Error("Invalid reason value provided.");

    data.joining_reasons = selectedReasons;
  }

  const updatedInfo: PartialBy<User, "password"> = await prisma.user.update({ where: { id: userId }, data });

  delete updatedInfo.password;

  return generateResponse("200", "Profile info updated.", res, { data: updatedInfo });
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
