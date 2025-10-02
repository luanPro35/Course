import React from "react";
import { Atom } from "react-loading-indicators";
export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <Atom color="#fc3900" size="large" textColor="#fc3900" />
    </div>
  );
}
