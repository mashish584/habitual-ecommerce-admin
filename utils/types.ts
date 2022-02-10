export type RequestType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type Status = "200" | "400" | "401" | "403" | "404" | "405";
export type ResponseError = {
  key: string;
  message: string;
};

//= => Body Types
export type SignupBody = {
  email: string;
  password: string;
};
