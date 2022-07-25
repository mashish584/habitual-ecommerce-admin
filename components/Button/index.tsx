import React from "react";
import { IconType } from "../types";

type ButtonVariant = "primary" | "secondary";

interface ButtonI extends React.HTMLProps<HTMLButtonElement> {
  type: "submit" | "button";
  variant: "primary" | "secondary";
  rightIcon?: IconType;
  children: React.ReactNode;
}

const buttonThemes: Record<ButtonVariant, string[]> = {
  primary: ["bg-theme", "text-black"],
  secondary: ["bg-black", "text-white"],
};

function getButtonClassNames(variant: ButtonVariant = "primary", className?: string, isRightIcon?: boolean) {
  const buttonClasses = ["w-full bg-theme rounded-2xl h-12 px-5", ...buttonThemes[variant]];

  if (isRightIcon) {
    buttonClasses.push("flex flex-row justify-evenly items-center");
  }

  return `${buttonClasses.join(" ")} ${className || ""}`;
}

const Button = ({ variant, children, className, rightIcon, ...buttonProps }: ButtonI) => {
  const classNames = getButtonClassNames(variant, className, Boolean(rightIcon));
  const Icon = rightIcon || null;

  return (
    <button {...buttonProps} className={classNames}>
      {children}
      {Icon && <Icon fontSize={"small"} style={{ width: 15 }} />}
    </button>
  );
};

export default Button;
