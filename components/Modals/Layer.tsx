import React from "react";

interface Layer {
  visible: boolean;
}

const Layer = ({ visible }: Layer) => {
  return (
    <div
      className={`absolute inset-0 backdrop-blur-sm bg-black/10 transition-opacity duration-300 delay-100 ease-in ${
        visible ? "opacity-1 translate-x-0" : "opacity-0 translate-x-full"
      } `}
    />
  );
};

export default Layer;
