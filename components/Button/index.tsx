import React from "react";
import Loader from "../Loader";
import { IconType } from "../types";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonI extends React.HTMLProps<HTMLButtonElement> {
  type: "submit" | "button";
  variant: "primary" | "secondary" | "danger";
  children: React.ReactNode;
  isLoading?: boolean;
  rightIcon?: IconType;
}

const buttonThemes: Record<ButtonVariant, string[]> = {
  primary: ["bg-theme", "text-black"],
  secondary: ["bg-black", "text-white"],
  danger: ["bg-danger", "text-white"],
};

function getButtonClassNames(variant: ButtonVariant = "primary", className?: string, isRightIcon?: boolean) {
  const buttonClasses = ["w-full bg-theme rounded-2xl h-12 px-5", ...buttonThemes[variant]];

  if (isRightIcon) {
    buttonClasses.push("flex flex-row justify-evenly items-center");
  }

  return `${buttonClasses.join(" ")} ${className || ""}`;
}

const Button = ({ variant, children, className, rightIcon, isLoading, ...buttonProps }: ButtonI) => {
  const classNames = getButtonClassNames(variant, className, Boolean(rightIcon));
  const Icon = rightIcon || null;

  return (
    <button {...buttonProps} className={`relative  ${classNames}`} disabled={isLoading}>
      {children}
      {Icon && <Icon fontSize={"small"} style={{ width: 15 }} />}
      {isLoading && <Loader className="ml-2 right-7 top-4 absolute" />}
    </button>
  );
};

export default Button;
