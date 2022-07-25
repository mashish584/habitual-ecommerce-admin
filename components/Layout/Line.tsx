import React from "react";

interface LineI {
  className?: string;
}

const Line = ({ className }: LineI) => {
  return <div className={`w-full h-px bg-gray/50 my-8 ${className || ""}`} />;
};

export default Line;
