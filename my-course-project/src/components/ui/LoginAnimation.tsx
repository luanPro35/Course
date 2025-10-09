import React from "react";
import Lottie from "lottie-react";
import loginAnim from "../../../public/animations/login.json";

const LoginAnimation = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie animationData={loginAnim} loop={true} className="w-full h-full" />
    </div>
  );
};

export default LoginAnimation;
