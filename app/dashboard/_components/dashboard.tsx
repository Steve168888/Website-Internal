"use client";

import React, { useEffect, useState } from "react";
import { FaUsers, FaBox, FaDollarSign, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { fetchAccount, fetchTotalCampaigns } from "@/services/api"; // Import kedua fungsi fetch

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState<boolean>(true);
  const [errorAccounts, setErrorAccounts] = useState<string | null>(null);
  const [errorCampaigns, setErrorCampaigns] = useState<string | null>(null);

  // Fetch total accounts
  useEffect(() => {
    const fetchTotalAccounts = async () => {
      setLoadingAccounts(true);
      const { total, error } = await fetchAccount(1, 10, "");

      if (error) {
        setErrorAccounts(error);
      } else {
        setTotalAccounts(total);
        setErrorAccounts(null);
      }
      setLoadingAccounts(false);
    };

    fetchTotalAccounts();
  }, []);

  // Fetch total campaigns
  useEffect(() => {
    const fetchTotalCampaignsData = async () => {
      setLoadingCampaigns(true);
      const { total, error } = await fetchTotalCampaigns(1, 10, "");

      if (error) {
        setErrorCampaigns(error);
      } else {
        setTotalCampaigns(total);
        setErrorCampaigns(null);
      }
      setLoadingCampaigns(false);
    };

    fetchTotalCampaignsData();
  }, []);

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [120, 190, 300, 500, 200, 300],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Revenue",
        data: [150, 230, 250, 450, 350, 400],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sales and Revenue Chart",
      },
    },
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Grid untuk 4 kartu */}
      <div className="grid grid-cols-2 gap-4">
        {/* Kartu Total Accounts */}
        <Link href="/users">
          <div className="bg-[#1E293B] rounded-lg p-4 shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-all duration-200">
            <FaUsers className="text-4xl text-blue-400" />
            <div>
              <h3 className="text-gray-400 font-semibold">Total Accounts</h3>
              {loadingAccounts ? (
                <p className="text-white text-xl font-bold">Loading...</p>
              ) : errorAccounts ? (
                <p className="text-red-500 text-sm">{errorAccounts}</p>
              ) : (
                <p className="text-white text-2xl font-bold">{totalAccounts.toLocaleString()}</p>
              )}
              <p className="text-green-500 text-sm">+17% more than previous week</p>
            </div>
          </div>
        </Link>

        {/* Kartu Total Campaigns */}
        <div className="bg-[#1E293B] rounded-lg p-4 shadow-md flex items-center gap-4 hover:bg-gray-700 transition-all duration-200">
          <FaBox className="text-4xl text-yellow-400" />
          <div>
            <h3 className="text-gray-400 font-semibold">Total Campaigns</h3>
            {loadingCampaigns ? (
              <p className="text-white text-xl font-bold">Loading...</p>
            ) : errorCampaigns ? (
              <p className="text-red-500 text-sm">{errorCampaigns}</p>
            ) : (
              <p className="text-white text-2xl font-bold">{totalCampaigns.toLocaleString()}</p>
            )}
            <p className="text-green-500 text-sm">+5% more than previous week</p>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-lg p-4 shadow-md flex items-center gap-4">
          <FaDollarSign className="text-4xl text-green-400" />
          <div>
            <h3 className="text-gray-400 font-semibold">Revenue</h3>
            <p className="text-white text-2xl font-bold">$6,642</p>
            <p className="text-green-500 text-sm">+13% more than previous week</p>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-lg p-4 shadow-md flex items-center gap-4">
          <FaShoppingCart className="text-4xl text-purple-400" />
          <div>
            <h3 className="text-gray-400 font-semibold">New Orders</h3>
            <p className="text-white text-2xl font-bold">1,542</p>
            <p className="text-green-500 text-sm">+10% more than previous week</p>
          </div>
        </div>
      </div>

      {/* Latest Transactions Dummy */}
      <div className="bg-[#1E293B] rounded-lg p-4 shadow-md">
        <h2 className="text-gray-400 font-semibold mb-4">Latest Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">Name</th>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">Status</th>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">Date</th>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "John Doe", status: "pending", color: "bg-yellow-500", date: "14.02.2023", amount: 3200 },
                { name: "Jane Smith", status: "done", color: "bg-green-500", date: "14.02.2023", amount: 4500 },
                { name: "Mark Lee", status: "cancelled", color: "bg-red-500", date: "14.02.2023", amount: 2000 },
                { name: "Sarah Connor", status: "pending", color: "bg-yellow-500", date: "14.02.2023", amount: 1500 },
                { name: "Paul Walker", status: "done", color: "bg-green-500", date: "14.02.2023", amount: 5000 },
              ].map((transaction, index) => (
                <tr key={index} className="border-t border-gray-700 text-gray-200">
                  <td className="py-2">{transaction.name}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-lg ${transaction.color} text-white text-xs font-semibold`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">${transaction.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kotak untuk Grafik */}
      <div className="bg-[#1E293B] rounded-lg p-4 shadow-md">
        <h2 className="text-gray-400 font-semibold mb-4">Graph Component</h2>
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
