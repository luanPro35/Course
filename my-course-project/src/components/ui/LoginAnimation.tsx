"use client";
import React from "react";
import Lottie from "lottie-react";
import loginAnim from "../../../public/animations/login.json";

const LoginAnimation = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie
        animationData={loginAnim}
        loop={true}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", minHeight: "300px" }}
      />
    </div>
  );
};

export default LoginAnimation;
