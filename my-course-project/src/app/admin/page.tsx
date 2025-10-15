import Link from "next/link";
import React from "react";
import ManagerPosts from "./courses/page";
import Navbar from "./Navbar";
export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <ManagerPosts />
    </div>
  );
}
