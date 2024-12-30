"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAccount } from "@/services/api";
import { handlePagination, handleSearch, HidePagination } from "@/services/utils";
import Chart from "@/app/users/_components/chart/chart";
import CreateAccount from "./createAccount/createAccount";

interface Account {
  _id: string;
  name: string;
  email: string;
  balance: number;
  campaignCount: number;
}

const User = () => {
  const [users, setUsers] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total_pages, setTotal_pages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isModalOpen, setModalOpen] = useState<boolean>(false); // Modal state
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, total_pages, error } = await fetchAccount(currentPage, itemsPerPage, searchTerm);

      if (error) {
        setError(error);
      } else {
        setUsers(data);
        setTotal_pages(total_pages);
        setError(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchTerm]);

  const { handlePrevious, handleNext } = handlePagination(currentPage, total_pages, setCurrentPage);
  const hidePagination = HidePagination(users.length, total_pages, undefined);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Header dengan Campaign List dan Search */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white hover:text-gray-300 transition-all duration-200 cursor-pointer">
          Account List
        </h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e, setSearchTerm, setCurrentPage)}
              className="px-4 py-2 pl-10 w-full rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.32-4.32a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Balance</th>
              <th className="px-6 py-3 text-center">Total Campaign</th>
              <th className="px-6 py-3 text-center">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-600">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 text-center">${user.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">{user.campaignCount}</td>
                  <td className="px-6 py-4 text-center">
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
                  There is no account data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!hidePagination && (
        <div className="flex justify-end items-center mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 hover:text-gray-100 transition-all duration-200"
            >
              Previous
            </button>
            <span className="text-white text-center">
              Page {currentPage} of {total_pages > 1 ? total_pages : 1}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === total_pages}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 hover:text-gray-100 transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <Chart />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreateAccount onClose={closeModal}/>
        </div>
      )}
    </div>
  );
};

export default User;
