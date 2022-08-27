import React, { useEffect, useRef, useState } from "react";
import { CloseOutlined } from "@mui/icons-material";
import Portal from "../Layout/Portal";
import Layer from "./Layer";

export interface SideModalI {
  visible: boolean;
  onClose: () => void;
}

const SideModal: React.FC<SideModalI> = ({ visible, children, onClose }) => {
  const [translate, setTranslate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * → We've used timer to show and hide slide in order to be consistent with
   *   tab indexing when slide is off the screen
   */
  useEffect(() => {
    let timeoutId: any;

    if (visible && containerRef.current) {
      containerRef.current.style.display = "block";
      timeoutId = setTimeout(() => {
        setTranslate(true);
      }, 10);
    } else {
      setTranslate(false);
      timeoutId = setTimeout(() => {
        if (containerRef.current) containerRef.current.style.display = "none";
      }, 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visible]);

  return (
    <Portal>
      <Layer visible={translate} />
      <div
        ref={containerRef}
        className={`fixed bg-white inset-y-0 right-0 p-10 transition-transform duration-300 ease-in overflow-auto xl:w-2/4 xlMax:w-7/12 lgMax:w-9/12 mdMax:w-full ${
          !translate ? "translate-x-full" : "translate-x-0"
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
};
export default SideModal;
