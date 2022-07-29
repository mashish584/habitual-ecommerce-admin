import React from "react";
import { CloseOutlined } from "@mui/icons-material";
import Portal from "../Layout/Portal";
import Layer from "./Layer";

export interface SideModalI {
  visible: boolean;
  onClose: () => void;
}

const SideModal: React.FC<SideModalI> = ({ visible, children, onClose }) => (
  // useEffect(() => {
  //   document.body.style.overflow = visible ? "hidden" : "visible";
  // }, [visible]);

  <Portal>
    <Layer visible={visible} />
    <div
      className={`absolute bg-white inset-y-0 right-0 p-10 transition-transform duration-300 ease-in overflow-auto xl:w-2/5 xlMax:w-7/12 lgMax:w-9/12 mdMax:w-full ${
        !visible ? "translate-x-full" : "translate-x-0"
      }`}
    >
      <button className="w-8 h-8 bg-transparent border-0 mb-14" onClick={onClose}>
        <CloseOutlined />
      </button>
      <div className="px-2" style={{ height: "calc(100% - 140px)" }}>
        {children}
      </div>
    </div>
  </Portal>
);
export default SideModal;
