"use client";

import React, { useEffect, useState } from "react";
import { FaUsers, FaBox } from "react-icons/fa";
import Link from "next/link";
import { formatDate } from "@/services/utils";

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
import { fetchAccount, fetchAllCampaigns } from "@/services/api";

// Register Chart.js components
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
      const { total, error } = await fetchAllCampaigns(1, 10, "");

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
      {/* Grid for 2 cards */}
      <div className="grid grid-cols-2 gap-4">
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

        <Link href="/users">
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
        </Link>
      </div>

      {/* Latest Campaigns */}
      <div className="bg-[#1E293B] rounded-lg p-4 shadow-md">
        <h2 className="text-gray-400 font-semibold mb-4">Latest Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-gray-500 text-sm font-semibold py-2 text-left">Name</th>
                <th className="text-gray-500 text-sm font-semibold py-2 text-center">Status</th>
                <th className="text-gray-500 text-sm font-semibold py-2 text-center">Created At</th>
                <th className="text-gray-500 text-sm font-semibold py-2 text-center">Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700 text-gray-200">
                <td className="py-2">Campaign Alpha</td>
                <td className="px-4 py-2 text-center">
                  <span className="px-3 py-1 rounded-lg bg-[#9966FF] text-white text-sm font-medium">
                    created
                  </span>
                </td>
                <td className="py-2 text-center">{formatDate("2023-12-20T10:00:00Z")}</td>
                <td className="py-2 text-center">{formatDate("2023-12-25T12:00:00Z")}</td>
              </tr>
              <tr className="border-t border-gray-700 text-gray-200">
                <td className="py-2">Campaign Beta</td>
                <td className="px-4 py-2 text-center">
                  <span className="px-3 py-1 rounded-lg bg-gray-500 text-white text-sm font-medium">
                    running
                  </span>
                </td>
                <td className="py-2 text-center">{formatDate("2023-12-15T09:30:00Z")}</td>
                <td className="py-2 text-center">{formatDate("2023-12-26T15:00:00Z")}</td>
              </tr>
              <tr className="border-t border-gray-700 text-gray-200">
                <td className="py-2">Campaign Gamma</td>
                <td className="px-4 py-2 text-center">
                  <span className="px-3 py-1 rounded-lg bg-gray-500 text-white text-sm font-medium">
                    completed
                  </span>
                </td>
                <td className="py-2 text-center">{formatDate("2023-12-10T14:45:00Z")}</td>
                <td className="py-2 text-center">-</td>
              </tr>
              <tr className="border-t border-gray-700 text-gray-200">
                <td className="py-2">Campaign Delta</td>
                <td className="px-4 py-2 text-center">
                  <span className="px-3 py-1 rounded-lg bg-[#9966FF] text-white text-sm font-medium">
                    created
                  </span>
                </td>
                <td className="py-2 text-center">{formatDate("2023-12-05T08:20:00Z")}</td>
                <td className="py-2 text-center">{formatDate("2023-12-27T16:00:00Z")}</td>
              </tr>
              <tr className="border-t border-gray-700 text-gray-200">
                <td className="py-2">Campaign Epsilon</td>
                <td className="px-4 py-2 text-center">
                  <span className="px-3 py-1 rounded-lg bg-gray-500 text-white text-sm font-medium">
                    running
                  </span>
                </td>
                <td className="py-2 text-center">{formatDate("2023-12-01T11:15:00Z")}</td>
                <td className="py-2 text-center">{formatDate("2023-12-28T18:00:00Z")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Graph */}
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
