"use client";
import React from "react";
import Lottie from "lottie-react";
import registerAnim from "../../../public/animations/register.json";

const RegisterAnimation = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie
        animationData={registerAnim}
        loop={true}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", minHeight: "300px" }}
      />
    </div>
  );
};

export default RegisterAnimation;
