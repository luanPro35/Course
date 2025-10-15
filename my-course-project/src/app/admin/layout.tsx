"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/content/AuthContent";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      router.push("/auth/login");
    }
  }, [user, token, router]);

  if (!token || user?.role !== "admin") {
    return <Loading />;
  }

  return <div>{children}</div>;
}
