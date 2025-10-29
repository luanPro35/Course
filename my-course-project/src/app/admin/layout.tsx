"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import Navbar from "./Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading } = useAuth(); // Destructure loading state
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is false before checking auth state
    if (!loading) {
      console.log("Admin layout check - user:", user, "token:", token, "role:", user?.role);
      if (!token || user?.role !== "admin") {
        console.log("Not admin, redirecting to login");
        router.push("/auth/login");
      }
    }
  }, [user, token, loading, router]);

  // Show loading indicator while checking auth state
  if (loading) {
    return <Loading />;
  }

  if (!token || user?.role !== "admin") {
    return <Loading />;
  }

  return (
    <div className="flex">
      <Navbar />
      <main className="ml-[20%] w-[80%] p-8">{children}</main>
    </div>
  );
}
