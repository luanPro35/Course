import React from "react";

interface ButtonRegisterProps {
  onClick: () => void;
}

export default function ButtonRegister({ onClick }: ButtonRegisterProps) {
  return (
    <div className="flex items-center justify-center bg-gray-900">
      <button
        onClick={onClick}
        className="relative block cursor-pointer text-white no-underline font-semibold rounded-md overflow-hidden p-[3px] isolate group"
      >
        <div
          className="absolute top-0 left-0 w-[400%] h-full -translate-x-[5%] transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:duration-[750ms]"
          style={{
            background:
              "linear-gradient(115deg, #4fcf70, #fad648, #a767e5, #12bcfe, #44ce7b)",
            backgroundSize: "25% 100%",
          }}
        />

        {/* Button content */}
        <span className="relative block px-6 py-4 text-lg bg-black rounded-[3px] h-full z-10">
          Đăng kí ngay
        </span>
      </button>

      <style jsx>{`
        @keyframes gradient-slide {
          0% {
            transform: translateX(-5%);
          }
          100% {
            transform: translateX(-30%);
          }
        }

        a > div:first-child {
          animation: gradient-slide 0.75s linear infinite;
          animation-play-state: paused;
        }

        a:hover > div:first-child {
          animation-play-state: running;
        }
      `}</style>
    </div>
  );
}
