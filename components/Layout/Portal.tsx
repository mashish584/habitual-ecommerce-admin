import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

let portal: Element | null;

const Portal: React.FC = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    portal = document.querySelector("#myportal");
    return () => setMounted(false);
  }, []);

  return mounted && portal ? createPortal(children, portal) : null;
};

export default Portal;
