import React from "react";
import styles from "./Input.module.css";

interface InputI extends React.HTMLProps<HTMLInputElement> {
  type: "email" | "password" | "text";
  label?: string;
}

const Input = ({ label, className, ...inputProps }: InputI) => {
  const labelProps = {} as React.HTMLProps<HTMLLabelElement>;

  if (inputProps.id) {
    labelProps.htmlFor = inputProps.id;
  }

  return (
    <div className="w-full mb-3.5">
      {label && (
        <label {...labelProps} className="ff-lato text-xs font-extrabold inline-block mb-1">
          {label}
        </label>
      )}
      <div className="w-full h-12 rounded-2xl border border-gray">
        <input {...inputProps} className={`w-full h-full rounded-2xl px-4 ${className || ""}`} />
      </div>
    </div>
  );
};

export default Input;
