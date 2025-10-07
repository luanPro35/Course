"use client";

import { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";

export function NextRouterProvider({ children }: { children: ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
