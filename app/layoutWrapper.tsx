"use client"; // Gunakan karena file ini membutuhkan logika klien

import { usePathname } from "next/navigation";
import MainLayout from "./layout/mainLayout/page";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Tentukan apakah halaman saat ini adalah login atau register
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";

  return isAuthPage ? (
    // Gunakan layout sederhana untuk halaman login dan register
    <div className="auth-container">{children}</div>
  ) : (
    // Gunakan MainLayout untuk halaman lainnya
    <MainLayout>{children}</MainLayout>
  );
}
