import React from "react";
import ListRow from "./ListRow";

interface ListContainerI {
  children: React.ReactNode;
  className?: string;
}

const ListContainer = ({ children, className }: ListContainerI) => {
  console.log({ children });
  return <div className={`w-full h-full ${className || ""}`}>{children}</div>;
};

export default ListContainer;
