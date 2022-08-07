import React from "react";

interface ListRowI {
  children: React.ReactNode;
  className?: string;
}

export type LoaderRef = HTMLDivElement;

const ListRow = React.forwardRef<LoaderRef, ListRowI>((props, ref) => {
  const { children, className } = props;
  return (
    <div ref={ref} className={`w-full h-24 flex bg-white list-row-shadow rounded-xl px-10 mb-4 items-center ${className || ""}`}>
      {children}
    </div>
  );
});

export default ListRow;
