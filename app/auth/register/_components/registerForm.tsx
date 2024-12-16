"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/services/api"; // Import fungsi fetchAPI

function RegisterForm() {
  const [username, setUsername] = useState(""); // State untuk username
  const [email, setEmail] = useState(""); // State untuk email
  const [password, setPassword] = useState(""); // State untuk password
  const [error, setError] = useState(""); // State untuk error
  const [success, setSuccess] = useState(""); // State untuk sukses
  const router = useRouter(); // Untuk redirect ke halaman login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Hindari refresh halaman

    try {
      // Panggil fungsi fetchAPI untuk register
      await fetchAPI("account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      setSuccess("Registration successful! Redirecting to login...");
      setError(""); // Reset error
      setTimeout(() => router.push("/auth/login"), 2000); // Redirect ke halaman login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setSuccess(""); // Reset success state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="w-full max-w-md p-8 bg-[var(--backgroundSoft)] rounded-lg shadow-lg">
        <h2 className="mb-8 text-3xl font-bold text-center text-[var(--foreground)]">Register</h2>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>} {/* Pesan Error */}
        {success && <p className="mb-4 text-sm text-green-500">{success}</p>} {/* Pesan Sukses */}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Tangkap input username
              className="w-full px-4 py-3 text-[var(--foregroundSoft)] bg-[var(--background)] border border-gray-600 rounded focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Tangkap input email
              className="w-full px-4 py-3 text-[var(--foregroundSoft)] bg-[var(--background)] border border-gray-600 rounded focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Tangkap input password
              className="w-full px-4 py-3 text-[var(--foregroundSoft)] bg-[var(--background)] border border-gray-600 rounded focus:outline-none focus:border-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-teal-500 rounded hover:bg-teal-600"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-[var(--foregroundSoft)]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-teal-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
