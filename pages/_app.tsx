import type { AppProps } from "next/app";
import "../styles/globals.css";

import { Layout } from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const NextComponent = Component as any;
  return (
    <Layout>
      <NextComponent {...pageProps} />
    </Layout>
  );
}

export default MyApp;
