"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/services/api"; // Import fetchAPI dari file lain

interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  campaignCount: number;
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]); // Default state kosong
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Ambil token dari localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak tersedia. Silakan login terlebih dahulu.");
          setLoading(false);
          return;
        }

        // Ambil data dari API
        const data = await fetchAPI<{ data: User[] }>("account/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token di header
          },
        });

        // Set 'users' dari properti 'data' dalam respons
        setUsers(data?.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Gagal mengambil data user. Periksa token atau server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
      <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">Total Campaign</th>
              <th className="px-6 py-3">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">${user.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center align-middle">{user.campaignCount}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/users/campaignList/${user._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  Tidak ada data user yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
