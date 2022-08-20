import React, { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";

import { NextApiRequest, NextApiResponse } from "next";
import { Input } from "../../components/Form";
import Button from "../../components/Button";

import loginStyles from "../../styles/Login.module.css";
import { MessageT } from "../../components/Form/Input";
import { appFetch } from "../../utils/api";

interface Credential {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<Credential>();

  const onSubmit = async (data: Credential) => {
    setIsLoading(true);
    const response = await appFetch("signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, isAdmin: true }),
    });

    setIsLoading(false);

    if (response.status == 200) {
      window.location.href = "/admin";
      return;
    }

    if (response?.errors?.length) {
      response.errors.map((error: { key: keyof Credential; message: string }) => setError(error.key, { message: error.message }));
    }
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div className={`basis-3/5 ${loginStyles.loginBg}`}></div>
      <div className="basis-2/5 flex flex-col justify-center items-center">
        <Image
          src={"https://ik.imagekit.io/imashish/habitual-ecommerce/portal/logo?ik-sdk-version=javascript-1.4.3&updatedAt=1658368339830"}
          width={274}
          height={64}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="w-7/12 mx-auto mt-16">
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: "Please enter email address." }}
            render={({ field }) => {
              const additionalInputProps = {} as MessageT;

              if (errors.email) {
                additionalInputProps.messageType = "error";
                additionalInputProps.message = errors.email.message;
              }

              return <Input type="email" label="Email" {...field} {...additionalInputProps} />;
            }}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Please enter password." }}
            render={({ field }) => {
              const additionalInputProps = {} as MessageT;

              if (errors.password) {
                additionalInputProps.messageType = "error";
                additionalInputProps.message = errors.password.message;
              }

              return <Input type="password" label="Password" {...field} {...additionalInputProps} />;
            }}
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="mt-2">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export function getServerSideProps({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  if (req.cookies?.token) {
    // avoid HTML caching
    res.setHeader("Cache-Control", "no-store");
    res.writeHead(301, {
      Location: "/admin/",
    });
    res.end();
  }

  return { props: {} };
}

export default Login;
