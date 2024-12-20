"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/services/api";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FiSend, FiPhone, FiUsers } from "react-icons/fi";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaEye } from "react-icons/fa"; // Ikon untuk Read
import { useRouter } from "next/navigation"; // Untuk navigasi tombol back

// Definisi tipe data
interface Campaign {
  campaign_id: string;
  name: string;
  template: string;
  created_at: string;
  phone_sender: string;
  customersCount: number;
}

interface DetailStatuses {
  Pending: number;
  Failed: number;
  Sent: number;
  Delivered: number;
  Read: number;
}

const CampaignDetail = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [detailStatuses, setDetailStatuses] = useState<DetailStatuses | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Gunakan router untuk tombol Back

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);

        // Ambil token dari localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak tersedia. Silakan login terlebih dahulu.");
          setLoading(false);
          return;
        }

        // Ambil parameter dari URL
        const urlParams = new URLSearchParams(window.location.search);
        const campaignId = urlParams.get("campaign_id");
        const accountId = urlParams.get("account_id");

        if (!campaignId || !accountId) {
          setError("Campaign ID atau Account ID tidak ditemukan.");
          setLoading(false);
          return;
        }

        // Fetch data menggunakan fetchAPI
        const data = await fetchAPI<{
          campaign: Campaign;
          detailStatuses: DetailStatuses;
        }>(`campaign-detail/get/${campaignId}?account_id=${accountId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set data ke state
        setCampaign(data.campaign);
        setDetailStatuses(data.detailStatuses);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching campaign data:", err);
          setError(err.message || "Gagal mengambil data campaign.");
        } else {
          console.error("Unknown error:", err);
          setError("Terjadi kesalahan yang tidak diketahui.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-[#0D1B2A] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Campaign Details</h1>


      {/* Informasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">TEMPLATE NAME</h2>
          <p className="mt-2 bg-yellow-500 text-black px-3 py-1 inline-block rounded">
            {campaign?.name || "Tidak tersedia"}
          </p>
          <p className="mt-2">
            {campaign?.created_at
              ? new Date(campaign.created_at).toLocaleString()
              : "Tidak tersedia"}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FiPhone /> SENDER
          </h2>
          <p className="mt-2">{campaign?.phone_sender || "Tidak tersedia"}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FiUsers /> CONTACTS
          </h2>
          <p className="mt-2">{campaign?.customersCount || 0}</p>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <AiOutlineCheckCircle className="text-green-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">DELIVERED</h2>
          <p className="text-3xl font-bold mt-4 text-green-400">
            {detailStatuses?.Delivered || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <AiOutlineCloseCircle className="text-red-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">FAILED</h2>
          <p className="text-3xl font-bold mt-4 text-red-400">
            {detailStatuses?.Failed || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <FiSend className="text-orange-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">SENT</h2>
          <p className="text-3xl font-bold mt-4 text-orange-400">
            {detailStatuses?.Sent || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <MdOutlineMarkEmailRead className="text-yellow-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">PENDING</h2>
          <p className="text-3xl font-bold mt-4 text-yellow-400">
            {detailStatuses?.Pending || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <FaEye className="text-blue-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">READ</h2>
          <p className="text-3xl font-bold mt-4 text-blue-400">
            {detailStatuses?.Read || 0}
          </p>
        </div>
      </div>
            {/* Tombol Back */}
            <button
        onClick={() => {
          const accountId = new URLSearchParams(window.location.search).get("account_id");
          router.push(`/users/campaignList/${accountId}`);
        }}
        className="mb-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        Back
      </button>
    </div>
    
  );
};

export default CampaignDetail;
