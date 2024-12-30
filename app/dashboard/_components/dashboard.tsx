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
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const [loadingCampaigns, setLoadingCampaigns] = useState<boolean>(true);
  const [loadingLatestCampaigns, setLoadingLatestCampaigns] = useState<boolean>(true);
  const [errorAccounts, setErrorAccounts] = useState<string | null>(null);
  const [errorCampaigns, setErrorCampaigns] = useState<string | null>(null);
  const [errorLatestCampaigns, setErrorLatestCampaigns] = useState<string | null>(null);

  // Fetch total akun
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

  // Fetch total campaign
  useEffect(() => {
    const fetchTotalCampaigns = async () => {
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

    fetchTotalCampaigns();
  }, []);

  // Fetch dan tampilkan daftar campaign yang di-sort
  useEffect(() => {
    const fetchSortedCampaigns = async () => {
      setLoadingLatestCampaigns(true);

      // Tambahkan parameter `order` dan `sort`
      const { data, error } = await fetchAllCampaigns(1, 5, "", "created_at", -1);

      if (error) {
        setErrorLatestCampaigns(error);
      } else {
        setLatestCampaigns(data);
        setErrorLatestCampaigns(null);
      }
      setLoadingLatestCampaigns(false);
    };

    fetchSortedCampaigns();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Grid untuk 2 kartu */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/users">
          <div className="bg-[#1E293B] rounded-lg p-4 shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-all duration-200">
            <FaUsers className="text-4xl text-blue-400" />
            <div>
              <h3 className="text-gray-400 font-semibold">Total Akun</h3>
              {loadingAccounts ? (
                <p className="text-white text-xl font-bold">Memuat...</p>
              ) : errorAccounts ? (
                <p className="text-red-500 text-sm">{errorAccounts}</p>
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
              <h3 className="text-gray-400 font-semibold">Total Campaign</h3>
              {loadingCampaigns ? (
                <p className="text-white text-xl font-bold">Memuat...</p>
              ) : errorCampaigns ? (
                <p className="text-red-500 text-sm">{errorCampaigns}</p>
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
        <h2 className="text-gray-400 font-semibold mb-4">Campaign Terbaru</h2>
        {errorLatestCampaigns ? (
          <p className="text-red-500 text-center">{errorLatestCampaigns}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-gray-500 text-sm font-semibold py-2 text-left">Nama</th>
                  <th className="text-gray-500 text-sm font-semibold py-2 text-center">Status</th>
                  <th className="text-gray-500 text-sm font-semibold py-2 text-center">Dibuat Pada</th>
                  <th className="text-gray-500 text-sm font-semibold py-2 text-center">Jadwal</th>
                </tr>
              </thead>
              <tbody>
                {loadingLatestCampaigns ? (
                  <tr>
                    <td colSpan={4} className="text-center text-white py-4">
                      Memuat...
                    </td>
                  </tr>
                ) : latestCampaigns.length === 0 ? (
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
