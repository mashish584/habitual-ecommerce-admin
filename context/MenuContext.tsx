import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";

interface MenuContextI {
  activePath: string;
  isMobileNavigationActive: boolean;
  showMobileNavigation: boolean;
  onMobileNavigationToggle: () => void;
}

const initalState: MenuContextI = {
  activePath: "",
  isMobileNavigationActive: false,
  showMobileNavigation: false,
  onMobileNavigationToggle: () => {},
};

const MenuContext = React.createContext(initalState);

const useMenuContext = () => {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error("[MenuContext] Context can't be used outside provider.");
  }

  return context;
};

const MenuContextProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [width] = useWindowSize();
  const [path, setPath] = useState(router.route);
  const [showMobileNavigation, setShowMobileNavigation] = useState(false);

  const isMobileNavigationActive = width < 1024;

  const onMobileNavigationToggle = useCallback(() => {
    setShowMobileNavigation((prev) => !prev);
  }, []);

  const values = { activePath: path, showMobileNavigation, isMobileNavigationActive, onMobileNavigationToggle };

  useEffect(() => {
    const handleRouteChange = (path: string) => setPath(path);

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return <MenuContext.Provider value={values}>{children}</MenuContext.Provider>;
};

export { useMenuContext, MenuContextProvider };
