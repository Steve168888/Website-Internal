"use client"; 

import { usePathname } from "next/navigation";
import MainLayout from "./layout/mainLayout/page";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";

  return isAuthPage ? (
    
    <div className="auth-container">{children}</div>
  ) : (
    
    <MainLayout>{children}</MainLayout>
  );
}
