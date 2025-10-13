import React from "react";
import SettingsSidebar from "./SettingsSidebar";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-orange-50 to-blue-50">
      <aside className="w-1/4 p-8 border-r bg-white sticky top-0">
        <SettingsSidebar />
      </aside>
      <main className="flex-1 p-10 bg-gradient-to-br from-white to-blue-50">
        {children}
      </main>
    </div>
  );
}
