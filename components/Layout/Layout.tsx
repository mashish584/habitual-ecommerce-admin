import React from "react";
import Head from "next/head";
import { UIProvider } from "../../context/UIContext";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>Habitual Ecommerce</title>
      </Head>
      <UIProvider>{children}</UIProvider>
    </>
  );
};

export default Layout;
