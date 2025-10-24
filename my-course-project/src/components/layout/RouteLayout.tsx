"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { NextRouterProvider } from "../../app/NextRouterProvider";
import { ROUTES_WITH_BACK_BUTTON } from "@/constants/routes";
import { usePathname } from "next/navigation";

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSideBar = ROUTES_WITH_BACK_BUTTON.some((route: string) =>
    pathname.startsWith(route)
  );
  return (
    <NextRouterProvider>
      <div className="flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <Navbar />
        </header>
        <div className="flex flex-1 pt-16">
          {!hideSideBar && (
            <aside className="w-28 flex-shrink-0 mt-4">
              <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
                <Sidebar />
              </div>
            </aside>
          )}

          <main className="flex-1 px-6 md:px-12 py-8 pt-8 justify-start">
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </NextRouterProvider>
  );
}
