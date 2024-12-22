"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/services/api";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Login request
      const result = await fetchAPI<{
        token: string;
        user: { id: string; username: string };
      }>("account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Save token, admin ID, and username in localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("adminId", result.user.id);
      localStorage.setItem("adminUsername", result.user.username);

      // Success feedback and redirect
      setSuccess("Login successful! Redirecting to dashboard...");
      setError("");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      handleError(err);
      setSuccess("");
    }
  };

  // Error handling
  const handleError = (err: unknown) => {
    if (isAPIError(err)) {
      switch (err.message) {
        case "User not found.":
          setError("Email is not registered.");
          break;
        case "Invalid credentials.":
          setError("Wrong password.");
          break;
        default:
          setError("An unexpected error occurred.");
      }
    } else {
      setError("An unexpected error occurred.");
    }
  };

  // Type guard for API errors
  const isAPIError = (err: unknown): err is { message: string } =>
    typeof err === "object" && err !== null && "message" in err;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="w-full max-w-md p-8 bg-[var(--backgroundSoft)] rounded-lg shadow-lg">
        <h2 className="mb-8 text-3xl font-bold text-center text-[var(--foreground)]">
          Login
        </h2>

        {/* Error or Success Messages */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-500">{success}</p>}

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
};

export default LoginForm;
