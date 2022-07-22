import Link from "next/link";
import React from "react";

interface SectionHeadingI {
  title: string;
  path?: string;
  className?: string;
}

const SectionHeading = ({ title, path, className }: SectionHeadingI) => {
  return (
    <div className={`mb-10 flex flex-row justify-between ${className || ""}`}>
      <h4 className="text-3xl font-extrabold opacity-70">{title}</h4>
      {path && (
        <Link href="">
          <a className="ff-lato font-bold underline text-lg">View All</a>
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
