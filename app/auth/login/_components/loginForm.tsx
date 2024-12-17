"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/services/api"; // Import fungsi fetchAPI

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State untuk pesan sukses
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Panggil fetchAPI untuk login
      const data = await fetchAPI<{ token: string }>("account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

       // Simpan token di localStorage
    localStorage.setItem("token", data.token);

    // Simpan token di cookies (max-age 1 hari)
    document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;

      // Set pesan sukses
      setSuccess("Login successful! Redirecting to dashboard...");
      setError(""); // Reset error jika ada
      setTimeout(() => router.push("/dashboard"), 1500); // Redirect dengan delay
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        setSuccess(""); // Reset success jika ada
      } else {
        setError("An unexpected error occurred.");
        setSuccess("");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="w-full max-w-md p-8 bg-[var(--backgroundSoft)] rounded-lg shadow-lg">
        <h2 className="mb-8 text-3xl font-bold text-center text-[var(--foreground)]">Login</h2>
        
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-500">{success}</p>} {/* Pesan sukses */}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-[var(--foregroundSoft)] bg-[var(--background)] border border-gray-600 rounded focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-[var(--foregroundSoft)] bg-[var(--background)] border border-gray-600 rounded focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-teal-500 rounded hover:bg-teal-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-[var(--foregroundSoft)]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-teal-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
