import { NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

import { RequestType, Status } from "./types";

export const generateResponse = (status: Status, message: string, res: NextApiResponse) => res.status(parseInt(status)).json({ message });

export const checkRequestType = (endPointRequestTYpe: RequestType, userRequestType: RequestType, res: NextApiResponse) => {
  if (userRequestType === endPointRequestTYpe) {
    return generateResponse("405", `Request type ${userRequestType} is not allowed`, res);
  }
};

export const decodeJWT = async (authHeader = "") => {
  const [, token] = authHeader.split("Bearer ");

  const decoded = await jwt.verify(token, process.env.JWT_SECRET as Secret);

  return decoded;
};

export const hashPhassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const generateJWT = async (userId: string) => {
  const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET as Secret);
  return token;
};

export const comparePassword = (password: string, currentPassword: string) => bcrypt.compare(password, currentPassword);
