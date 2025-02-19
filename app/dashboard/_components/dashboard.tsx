"use client";

import React, { useEffect, useState } from "react";
import { FaUsers, FaBox } from "react-icons/fa";
import Link from "next/link";
import { formatDate } from "@/services/utils";
import { fetchAccount, fetchAllCampaigns } from "@/services/api";

export interface Campaign {
  campaign_id: string;
  name: string;
  status: string;
  created_at: string;
  schedule: string | null;
  detailStatuses?: {
    Delivered?: number;
    Read?: number;
    Failed?: number;
    Pending?: number;
    Sent?: number;
  };
  detailCount?: number;
}

const Dashboard = () => {
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [latestCampaigns, setLatestCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch data secara paralel menggunakan Promise.all
        const [accountRes, campaignsRes] = await Promise.all([
          fetchAccount(1, 10, ""),
          fetchAllCampaigns(1, 1000, ""), // Ambil semua campaign untuk total & sorting
        ]);

        // Set total accounts
        if (accountRes.error) {
          setError(accountRes.error);
        } else {
          setTotalAccounts(accountRes.total);
        }

        // Set total campaign dan sort 5 campaign terbaru
        if (campaignsRes.error) {
          setError(campaignsRes.error);
        } else {
          const allCampaigns = campaignsRes.data || [];

          // Total campaign
          setTotalCampaigns(allCampaigns.length);

          // Sort campaign berdasarkan created_at descending (-1)
          const sortedCampaigns = allCampaigns
            .sort((a: Campaign, b: Campaign) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5); // Ambil 5 campaign terbaru

          setLatestCampaigns(sortedCampaigns);
        }
      } catch (err) {
        setError("Terjadi kesalahan dalam mengambil data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Memuat...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Grid untuk 2 kartu */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/users">
          <div className="bg-[#1E293B] rounded-lg p-4 shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-all duration-200">
            <FaUsers className="text-4xl text-blue-400" />
            <div>
              <h3 className="text-gray-400 font-semibold">Total Accounts</h3>
              {error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <p className="text-white text-2xl font-bold">{totalAccounts.toLocaleString()}</p>
              )}
              <p className="text-green-500 text-sm">+17% lebih banyak dari minggu lalu</p>
            </div>
          </div>
        </Link>

        <Link href="/users">
          <div className="bg-[#1E293B] rounded-lg p-4 shadow-md flex items-center gap-4 hover:bg-gray-700 transition-all duration-200">
            <FaBox className="text-4xl text-yellow-400" />
            <div>
              <h3 className="text-gray-400 font-semibold">Total Campaigns</h3>
              {error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <p className="text-white text-2xl font-bold">{totalCampaigns.toLocaleString()}</p>
              )}
              <p className="text-green-500 text-sm">+5% lebih banyak dari minggu lalu</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Campaign Terbaru */}
      <div className="bg-[#1E293B] rounded-lg p-4 shadow-md">
        <h2 className="text-gray-400 font-semibold mb-4">Latest Campaigns</h2>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
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
                {latestCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-4">
                      Tidak ada campaign yang tersedia.
                    </td>
                  </tr>
                ) : (
                  latestCampaigns.map((campaign) => (
                    <tr key={campaign.campaign_id} className="border-t border-gray-700 text-gray-200">
                      <td className="py-2">{campaign.name}</td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-3 py-1 rounded-lg text-white text-sm font-medium ${
                            campaign.status === "created" ? "bg-[#9966FF]" : "bg-gray-500"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-2 text-center">{formatDate(campaign.created_at)}</td>
                      <td className="py-2 text-center">
                        {campaign.schedule ? formatDate(campaign.schedule) : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
