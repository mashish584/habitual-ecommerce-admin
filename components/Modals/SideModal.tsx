import { CloseOutlined } from "@mui/icons-material";
import React from "react";
import Portal from "../Layout/Portal";
import Layer from "./Layer";

interface SideModalI {
  visible: boolean;
  onClose: () => void;
}

const SideModal = ({ visible, onClose }: SideModalI) => {
  return (
    <Portal>
      <Layer visible={visible} />
      <div
        className={`absolute w-2/5 bg-white inset-y-0 right-0 p-10 transition-transform duration-300 ease-in ${
          !visible ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <button className="w-8 h-8 bg-transparent border-0" onClick={onClose}>
          <CloseOutlined />
        </button>
      </div>
    </Portal>
  );
};

export default SideModal;
