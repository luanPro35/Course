import React from "react";

interface ButtonRegisterProps {
  onClick: () => void;
}

export default function ButtonRegister({ onClick }: ButtonRegisterProps) {
  return (
    <button
      onClick={onClick}
      className="relative block cursor-pointer text-white no-underline font-semibold rounded-md overflow-hidden p-[3px] isolate group"
    >
      <div
        className="absolute top-0 left-0 w-[400%] h-full animate-gradient-flow"
        style={{
          background:
            "linear-gradient(115deg, #4fcf70, #fad648, #a767e5, #12bcfe, #44ce7b)",
          backgroundSize: "25% 100%",
        }}
      />

      <span className="relative block px-6 py-4 text-lg bg-black rounded-[3px] h-full z-10">
        Đăng kí ngay
      </span>

      <style jsx>{`
        @keyframes gradient-flow {
          0% {
            transform: translateX(-5%);
          }
          100% {
            transform: translateX(-75%);
          }
        }

        .animate-gradient-flow {
          animation: gradient-flow 3s linear infinite;
        }

        button:hover .animate-gradient-flow {
          animation-duration: 1.5s;
        }
      `}</style>
    </button>
  );
}
