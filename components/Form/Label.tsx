import React from "react";

interface LabelI {
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  label: string;
  className?: string;
}

const Label = ({ labelProps = {}, label, className }: LabelI) => {
  return (
    <label {...labelProps} className={`ff-lato text-xs font-extrabold inline-block mb-1 ${className || ""}`}>
      {label}
    </label>
  );
};

export default Label;
