import dayjs from "dayjs";
import { DateFormats } from "./types";

export const generateKeyValuePair = <T extends { id: string }>(data: T[]): Record<string, T> =>
  data.reduce((previousValue, currentItem) => {
    previousValue[currentItem.id] = currentItem;
    return previousValue;
  }, {} as Record<string, T>);

export const formatDate = (date: Date, format: DateFormats) => dayjs(date).format(format);
