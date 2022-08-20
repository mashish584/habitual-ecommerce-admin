import { NextApiRequest, NextApiResponse } from "next";

export type RequestType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Status = "200" | "400" | "401" | "403" | "404" | "405";
export type AsyncFnType = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;

export type ResponseError = {
  key: string;
  message: string;
};

// → Field Interfaces
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
  color: string;
}

export interface SlideColors {
  color: string;
  backgroundColor: string;
}

// → Request Body Types

export type AuthBody = {
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
  variants: ProductVariant[];
  slideColors: SlideColors[];
  price: Number;
  discount: Number;
  quantity: Number;
  categories: string[];
};

export type Address = {
  id: string;
  firstName: string;
  lastName: string;
  streetName: string;
  state: string;
  city: string;
  pin: string;
  mobileNumber: string;
  default: boolean;
};

// TS Utils
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Frontend Fetch Types
export type FetchHeader = {
  "Content-Type": "application/json" | "multipart/form-data";
  Authorization?: string;
  token?: string;
};

export type RequestMethods = "POST" | "GET" | "PATCH" | "DELETE" | "PUT";

export type ErrorMessage<T> = {
  key: T;
  message: string;
};

/**
 *  *** Frontend ***
 */

export interface FetchConfig {
  method: RequestMethods;
  headers?: FetchHeader;
  body?: any;
  path?: string;
  query?: string;
  url?: string;
  isFormData?: boolean;
  disableUrlAppend?: boolean;
}

export interface ErrorResponse<T> {
  errorMessage: ErrorMessage<T>;
  errors: ErrorMessage<T>[];
  message: string;
}

export interface SuccessResponse<T> {
  message: string;
  token: string;
  data: T;
  next: string;
}

export interface LoadingI<T> {
  type: T;
  isLoading: boolean;
}

export type StateUpdateType = "add" | "update" | "delete";
