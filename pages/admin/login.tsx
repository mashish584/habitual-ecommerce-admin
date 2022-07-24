import React from "react";
import Image from "next/image";
import loginStyles from "../../styles/Login.module.css";
import { Input } from "../../components/Form";
import Button from "../../components/Button";

const Login = () => {
  return (
    <div className="flex flex-row h-full">
      <div className={`basis-3/5 ${loginStyles.loginBg}`}></div>
      <div className="basis-2/5 flex flex-col justify-center items-center">
        <Image
          src={"https://ik.imagekit.io/imashish/habitual-ecommerce/portal/logo?ik-sdk-version=javascript-1.4.3&updatedAt=1658368339830"}
          width={274}
          height={64}
        />
        <div className="w-7/12 mx-auto mt-16">
          <Input type="email" label="Email" />
          <Input type="password" label="Password" />
          <Button variant="primary" type="button" className="mt-2">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
