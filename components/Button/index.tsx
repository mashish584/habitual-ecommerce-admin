import React, { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonI extends React.HTMLProps<HTMLButtonElement> {
  type: "submit" | "button";
  variant: "primary" | "secondary";
  children: string;
}

const buttonThemes: Record<ButtonVariant, string[]> = {
  primary: ["bg-theme", "text-black"],
  secondary: ["bg-black", "text-white"],
};

function getButtonClassNames(variant: ButtonVariant = "primary", className?: string) {
  const buttonClasses = ["w-full bg-theme rounded-2xl h-12", ...buttonThemes[variant]];
  return `${buttonClasses.join(" ")} ${className || ""}`;
}

const Button = ({ type, variant, children, className, ...buttonProps }: ButtonI) => {
  const classNames = getButtonClassNames(variant, className);

  return (
    <button {...buttonProps} className={classNames}>
      {children}
    </button>
  );
};

export default Button;
