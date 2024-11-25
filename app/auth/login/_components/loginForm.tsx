// app/auth/login/page.tsx

import React from 'react';

function LoginForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="w-full max-w-md p-8 bg-[var(--backgroundSoft)] rounded-lg shadow-lg">
        <h2 className="mb-8 text-3xl font-bold text-center text-[var(--foreground)]">Login</h2>
        <form>
          <div className="mb-6">
            <input
              type="text"
              placeholder="username"
              className="w-full px-4 py-3 text-[var(--foregroundSoft)] bg-[var(--background)] border border-gray-600 rounded focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="password"
              className="w-full px-4 py-3 text-[var(--foregroundSoft)] bg-[var(--background)] border border-gray-600 rounded focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-teal-500 rounded hover:bg-teal-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
