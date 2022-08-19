import React from "react";

interface ListContainerI {
  children: React.ReactNode;
  className?: string;
}

const ListContainer = ({ children, className }: ListContainerI) => (
  <div className={`w-full h-full bg-white list-row-shadow rounded ${className || ""}`}>{children}</div>
);

export default ListContainer;
