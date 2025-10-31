import React from "react";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-orange-50 to-blue-50 justify-center items-center">
      <main className="flex-1 p-10 bg-gradient-to-br from-white to-blue-50">
        {children}
      </main>
    </div>
  );
}
