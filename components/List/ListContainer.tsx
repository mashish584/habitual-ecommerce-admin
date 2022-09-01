import React from "react";
import Loader from "../Loader";

interface ListContainerI {
  children: React.ReactNode;
  message: string | null;
  isLoading?: boolean;
  className?: string;
}

const ListContainer = ({ children, isLoading, className, message }: ListContainerI) => (
  <div className={`w-full h-full bg-white list-row-shadow rounded ${className || ""}`}>
    {children}
    {isLoading && (
      <div className="w-full h-10 flex items-center justify-center">
        <Loader className="border-lightBlackHex left-2/4 " />
      </div>
    )}
    {!isLoading && message && <p className="w-full py-5 text-lightBlackHex text-center">No categories available.</p>}
  </div>
);

export default ListContainer;
