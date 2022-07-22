import React from "react";
import ListItem from "./ListItem";

interface ListRowI {
  children: React.ReactNode;
  className?: string;
}

const ListRow = ({ children, className }: ListRowI) => {
  return <div className={`w-full h-24 flex bg-white list-row-shadow rounded-xl px-10 items-center ${className || ""}`}>{children}</div>;
};

export default ListRow;
