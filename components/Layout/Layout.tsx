import React from "react";
import Head from "next/head";

import Navigation from "../Navigation";
import { MenuContextProvider } from "../../context/MenuContext";

const Layout: React.FC = ({ children }) => (
  <MenuContextProvider>
    <Head>
      <title>Habitual Ecommerce</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    </Head>
    <div className="flex flex-row w-full h-full">
      <Navigation />
      {children}
    </div>
  </MenuContextProvider>
);

export default Layout;
