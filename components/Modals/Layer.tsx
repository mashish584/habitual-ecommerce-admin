import React, { useEffect } from "react";

interface LayerI {
  visible: boolean;
}

const Layer = ({ visible }: LayerI) => {
  useEffect(() => {
    document.body.style.overflowY = visible ? "hidden" : "unset";
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm bg-black/10 transition-opacity duration-300  ease-in ${
        visible ? "opacity-1 translate-x-0" : "opacity-0 translate-x-full"
      } `}
    />
  );
};

export default Layer;
