import { NextApiRequest, NextApiResponse } from "next";

export type RequestType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Status = "200" | "400" | "401" | "403" | "404" | "405";
export type AsyncFnType = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;

export type ResponseError = {
  key: string;
  message: string;
};

//→ Field Interfaces
export interface FileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: string;
  size: number;
}

export interface ProductVariant {
  image: FileType;
}

export interface SlideColors {
  color: string;
  backgroundColor: string;
}

//→ Request Body Types

export type SignupBody = {
  email: string;
  password: string;
};

export type UserInfoBody = {
  fullname: string | undefined | null;
};

export type CategoryBody = {
  name: string | undefined | null;
};

export type ProductBody = {
  title: string;
  description: string;
  images: FileType[];
  variants: Record<string, ProductVariant>;
  slideColors: SlideColors[];
  price: Number;
  discount: Number;
  quantity: Number;
  categories: string[];
};
