import React from "react";
import Image from "next/image";
import { Layout } from "../components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col w-96 mx-auto py-10">
        <Image
          src={"https://ik.imagekit.io/imashish/habitual-ecommerce/portal/logo?ik-sdk-version=javascript-1.4.3&updatedAt=1658368339830"}
          width={150}
          height={34.95}
          objectFit="contain"
        />

        <div className="mt-20">
          <h2 className="mb-2 font-bold text-center text-5xl">404</h2>
          <p className="text-lightBlackHex text-lg text-center">
            Requested page not found. Go to{" "}
            <a href="/admin" className="font-bold underline pointer">
              home
            </a>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
