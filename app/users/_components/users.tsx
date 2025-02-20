"use client";

import React, { useEffect, useState } from "react";
import { fetchAccount, deleteAccount } from "@/services/api";
import { handlePagination, HidePagination } from "@/services/utils";
import Chart from "@/app/users/_components/chart/chart";
import CreateAccount from "./createAccount/createAccount";
import Swal from "sweetalert2";

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
  const [searchValue, setSearchValue] = useState<string>(""); // Gunakan state untuk value
  const [accounts, setAccounts] = useState<Account[]>([]);


  const [isModalOpen, setModalOpen] = useState<boolean>(false); // Modal state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
      try {
        const [accountResponse, userResponse] = await Promise.all([
          fetchAccount(1, 100, ""), // Fetch all accounts untuk Chart
          fetchAccount(currentPage, 10, searchValue), // Fetch users dengan pagination
        ]);
  
        if (accountResponse.error) throw new Error(accountResponse.error);
        if (userResponse.error) throw new Error(userResponse.error);
  
        setAccounts(accountResponse.data); // Simpan akun untuk dikirim ke Chart
        setUsers(userResponse.data);
        setTotal_pages(userResponse.total_pages);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [currentPage, searchValue, users.length]);
  


  const handleDelete = async (accountId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1e293b",
      color: "#f8fafc",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteAccount(accountId);
          console.log("Delete response from API:", response); // Debugging
  
          if (response.success) {
            // **Update UI tanpa refresh**
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== accountId));
  
            // **Tampilkan notifikasi sukses**
            Swal.fire({
              title: "Deleted!",
              text: "The account has been deleted successfully.",
              icon: "success",
              background: "#1e293b",
              color: "#f8fafc",
            });
          } else {
            // Jika gagal, tampilkan error dengan pesan yang benar
            Swal.fire({
              title: "Error!",
              text: `Failed to delete account: ${response.message}`,
              icon: "error",
              background: "#1e293b",
              color: "#f8fafc",
            });
          }
        } catch (error) {
          console.error("Delete account error:", error);
          Swal.fire({
            title: "Error!",
            text: "An unexpected error occurred while deleting the account.",
            icon: "error",
            background: "#1e293b",
            color: "#f8fafc",
          });
        }
      }
    });
  };
  

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
              value={searchValue} // Gunakan searchValue
              onChange={(e) => {
                setSearchValue(e.target.value); // Update searchValue
                setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian
              }}
              className="px-4 py-2 pl-10 w-full rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
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
              <th className="px-6 py-3 text-center">Action</th>
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
                  <td className="px-6 py-4 text-center flex justify-center space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200"
                      onClick={() => window.location.href = `/users/campaignList/${user._id}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200"
                    >
                      Delete
                    </button>
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
      <Chart accounts={accounts} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreateAccount onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default User;
