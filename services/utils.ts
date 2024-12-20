import { NextRouter } from "next/router";

/**
 * Fungsi untuk menangani logout pengguna.
 * @param router Instance router dari useRouter().
 */
export const handleLogout = (router: NextRouter) => {
  try {
    // Hapus token dari localStorage
    localStorage.removeItem("token");

    // Redirect ke halaman login
    router.push("/auth/login");
  } catch (error) {
    console.error("Terjadi kesalahan saat logout:", error);
  }
};
