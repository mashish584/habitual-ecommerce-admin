import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface InputI extends React.HTMLProps<HTMLInputElement> {
  type: "email" | "password" | "text" | "textarea";
  label?: string;
  className?: string;
  errorMessage?: string;
}

export type InputRef = HTMLInputElement;
export type TextAreaRef = HTMLTextAreaElement;

const Input = React.forwardRef<InputRef & TextAreaRef, InputI>((props, ref) => {
  const { type, label, className, ...inputProps } = props;
  const [showPassword, setShowPassword] = useState(false);

  const labelProps = {} as React.HTMLProps<HTMLLabelElement>;
  let inputType = type;

  if (inputProps.id) {
    labelProps.htmlFor = inputProps.id;
  }

  if (type === "password") {
    inputType = showPassword ? "text" : "password";
  }

  const togglePasswordInput = () => setShowPassword(!showPassword);

  return (
    <div className={`w-full mb-3.5 ${className || ""}`}>
      {label && (
        <label {...labelProps} className="ff-lato text-xs font-extrabold inline-block mb-1">
          {label}
        </label>
      )}
      <div className={`relative w-full ${type === "textarea" ? "h-24" : "h-12"} rounded-2xl border border-gray`}>
        {type === "textarea" ? (
          <textarea ref={ref} className={`w-full h-full rounded-2xl p-4 ${className || ""}`}></textarea>
        ) : (
          <input {...inputProps} ref={ref} type={inputType} className={`w-full h-full rounded-2xl p-4 ${className || ""}`} />
        )}
        {type === "password" && (
          <button onClick={togglePasswordInput} className="absolute top-3 right-4 w-6 h-6">
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </button>
        )}
      </div>
    </div>
  );
});

export default Input;
