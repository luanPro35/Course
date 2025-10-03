"use client";
import React from "react";
import Lottie from "lottie-react";
import errorAnim from "../../../public/animations/signer.json";

interface ErrorAnimationProps {
  mess: string;
  onComplete?: () => void;
}

export default function ErrorAnimation({
  mess,
  onComplete,
}: ErrorAnimationProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <Lottie
          animationData={errorAnim}
          loop={false}
          onComplete={onComplete}
          style={{ width: 150, height: 150 }}
        />
        <p className="text-red-600 font-bold text-lg mt-4">{mess}</p>
      </div>
    </div>
  );
}
