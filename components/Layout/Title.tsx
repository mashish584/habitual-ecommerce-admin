import Head from "next/head";
import React from "react";

interface TitleI {
  text: string;
}

const Title = ({ text }: TitleI) => (
    <Head>
      <title>{text}</title>
    </Head>
);

export default Title;
