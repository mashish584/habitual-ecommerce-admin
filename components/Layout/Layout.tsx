import React from "react";
import Head from "next/head";

const Layout: React.FC = ({ children }) => (
  <>
    <Head>
      <title>Habitual Ecommerce</title>
    </Head>
    {children}
  </>
);

export default Layout;
