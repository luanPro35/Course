"use client";

import Lottie from "lottie-react";
import animationData from "@/../public/animations/Page Not Found 404.json";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-screen h-screen">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
}
