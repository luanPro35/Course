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
  const { user, token, loading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    
    if (!loading) {
      const isAdmin = 
        user?.email === "admin@gmail.com" || 
        user?.role === "admin" || 
        user?.role === "ADMIN" ||
        (Array.isArray(user?.roles) && 
         user.roles.some((r: any) => 
           r && (
             r === "ADMIN" || 
             r === "admin" || 
             r?.name === "ADMIN" || 
             r?.name === "admin"
           )
         ));

      if (!token || !isAdmin) {
        router.push("/auth/login");
      }
    }
  }, [user, token, loading, router]);

  
  if (loading) {
    return <Loading />;
  }

  
  const isAdmin = 
    user?.email === "admin@gmail.com" || 
    user?.role === "admin" || 
    user?.role === "ADMIN" ||
    (Array.isArray(user?.roles) && 
     user?.roles.some((r: any) => 
       r && (
         r === "ADMIN" || 
         r === "admin" || 
         r?.name === "ADMIN" || 
         r?.name === "admin"
       )
     ));

  if (!token || !isAdmin) {
    return <Loading />;
  }

  return (
    <div className="flex">
      <Navbar />
      <main className="ml-[20%] w-[80%] p-8">{children}</main>
    </div>
  );
}
