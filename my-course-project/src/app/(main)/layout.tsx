"use client";

import React from "react";
import RouteLayout from "@/components/layout/RouteLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteLayout>{children}</RouteLayout>;
}
