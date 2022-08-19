import React from "react";

interface ListRowI {
  children: React.ReactNode;
  className?: string;
}

export type LoaderRef = HTMLDivElement;

// bg-white list-row-shadow  rounded-xl
const ListRow = React.forwardRef<LoaderRef, ListRowI>((props, ref) => {
  const { children, className } = props;
  return (
    <div ref={ref} className={`w-full h-24 flex px-10 mb-4 border-b-2 border-lightGray items-center ${className || ""}`}>
      {children}
    </div>
  );
});

export default ListRow;
