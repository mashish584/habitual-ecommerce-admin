import React from "react";
import { Portal } from "../Layout";
import Layer from "./Layer";

export interface CenterModalI {
  visible: boolean;
  onClose: () => void;
}

const CenterModal: React.FC<CenterModalI> = ({ visible, children, onClose }) => (
  <Portal>
    <Layer visible={visible} />
    <div
      className={`absolute flex items-center justify-center inset-0 transition-transform duration-300 ease-in ${
        !visible ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className={"bg-white w-fit h-fit py-10 px-10 rounded-lg"}>{children}</div>
    </div>
  </Portal>
);

export default CenterModal;
