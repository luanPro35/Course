import PersonalPage from "@/app/(main)/profile/PersonalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "User profile page",
};

import React from "react";

export default function Route() {
  return <PersonalPage />;
}
