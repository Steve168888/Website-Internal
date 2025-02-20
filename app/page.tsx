"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login"); // Redirect ke halaman login
  }, [router]);

  return null; // Tidak menampilkan apa pun karena langsung redirect
}
