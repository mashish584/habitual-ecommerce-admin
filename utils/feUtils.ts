import dayjs from "dayjs";
import { toast } from "react-toastify";
import { DateFormats } from "./types";

export const generateKeyValuePair = <T extends { id: string }>(data: T[]): Record<string, T> =>
  data.reduce((previousValue, currentItem) => {
    previousValue[currentItem.id] = currentItem;
    return previousValue;
  }, {} as Record<string, T>);

export const formatDate = (date: Date, format: DateFormats) => dayjs(date).format(format);

export const showToast = (message: string, type: "info" | "success" | "warning" | "error") => {
  toast(message, {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type,
  });
};
