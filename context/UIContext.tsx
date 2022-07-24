import React, { useContext, useState } from "react";
import { UIContextInterface } from "./types";

const initialValues: UIContextInterface = {
  showSideModal: false,
  toggleSideModal: null,
};

const UIContext = React.createContext(initialValues);

const UIProvider: React.FC = ({ children }) => {
  const [showSideModal, setShowSideModal] = useState(false);

  const toggleSideModal = (value: boolean) => setShowSideModal(value);

  const values = { showSideModal, toggleSideModal };

  return <UIContext.Provider value={values}>{children}</UIContext.Provider>;
};

function useUIContext() {
  const context = useContext(UIContext);
  if (!context) throw new Error("Please wrap component around UIProvider.");
  return context;
}

export { UIProvider, useUIContext };
