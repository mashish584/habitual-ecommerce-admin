import React from "react";

type chipVariant = "primary" | "secondary" | "success";

interface ChipI {
  text: string;
  variant?: chipVariant;
  className?: string;
}

function getChipClasses(variant: chipVariant | undefined, className: string) {
  let classes: string[] = [];

  switch (variant) {
    case "primary":
      classes = ["bg-theme", "text-lightBlack"];
      break;
    case "secondary":
      classes = ["bg-lightBlack", "text-white"];
      break;
    case "success":
      classes = ["bg-lightGreen/30", "text-lightGreen"];
      break;
    default:
      classes = ["bg-darkGray", "text-white"];
      break;
  }

  return `${classes.join(" ")} ${className}`;
}

const Chip = ({ variant, className, text }: ChipI) => {
  const chipClasses = getChipClasses(variant, className || "");
  return (
    <span className={`min-w-fit h-3 bg-theme rounded-xl overflow-hidden px-2 font-bold text-xs py-1 mr-1 ${chipClasses || ""}`}>
      {text}
    </span>
  );
};

export default Chip;
