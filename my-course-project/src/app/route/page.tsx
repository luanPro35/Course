import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Path from "./Path";

export default function Route() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>
      h
      <div className="flex flex-1 pt-16">
        <aside className="w-28 flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>
        <div className="flex-1 px-6 md:px-12 py-8 pt-8 justify-start">
          <Path />
        </div>
      </div>
      <Footer />
    </div>
  );
}
