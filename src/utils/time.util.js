import { format } from "date-fns";

export const getGMTMinus3Date = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes());
  return format(date, "yyyy-MM-dd HH:mm");
};

export const getDateGMT = () => {
  const now = new Date();
  const gmtMinus3 = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  return gmtMinus3;
};
