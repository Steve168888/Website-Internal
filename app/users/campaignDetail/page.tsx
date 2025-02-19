"use client";

import { useEffect, useState } from "react";
import { fetchCampaignDetail, fetchGenerateCampaignDetails, updateCampaignDetail } from "@/services/api"; // Import fungsi
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FiSend, FiPhone, FiUsers } from "react-icons/fi";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCallback } from "react";


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

interface Detail {
  recipient: string;
  customer: string;
  status: string;
  message: string;
}

const CampaignDetail = () => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [detailStatuses, setDetailStatuses] = useState<DetailStatuses | null>(null);
  const [details, setDetails] = useState<Detail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10; // Number of items per page

  const router = useRouter();

  // Fungsi untuk mengambil data campaign detail
  const fetchCampaignData = useCallback(async () => {
    try {
      setLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const campaignId = urlParams.get("campaign_id");
      const accountId = urlParams.get("account_id");

      if (!campaignId || !accountId) {
        setError("Campaign ID atau Account ID tidak ditemukan.");
        setLoading(false);
        return;
      }

      const {
        campaign,
        detailStatuses,
        details,
        pagination,
        error,
      } = await fetchCampaignDetail(campaignId, accountId, currentPage, itemsPerPage);

      if (error) {
        setError(error);
      } else {
        setCampaign(campaign);
        setDetailStatuses(detailStatuses);
        setDetails(details || []);
        setTotalPages(pagination?.totalPages || 1);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal mengambil data campaign.");
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Tambahkan dependensi yang diperlukan di sini

  // Fungsi untuk generate campaign detail
  const handleGenerateCampaignDetail = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const campaignId = urlParams.get("campaign_id");
      const accountId = urlParams.get("account_id");

      if (!campaignId || !accountId) {
        setError("Campaign ID atau Account ID tidak ditemukan.");
        return;
      }

      // Panggil fungsi fetchGenerateCampaignDetails
      const { data, error } = await fetchGenerateCampaignDetails(campaignId, accountId);

      if (error) {
        setError(error);
      } else {
        // Format data yang diterima dari fetchGenerateCampaignDetails
        const formattedDetails = data.map((item) => ({
          recipient: item.recipient,
          customer: item.name, // Sesuaikan dengan field yang diharapkan
          status: item.status,
          message: item.message,
        }));

        // Perbarui state details
        setDetails(formattedDetails);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal generate campaign detail.");
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk update campaign detail
  const handleUpdateCampaignDetail = async () => {
    try {
      setLoading(true);

      // Ambil campaignId dan accountId dari URL
      const urlParams = new URLSearchParams(window.location.search);
      const campaignId = urlParams.get("campaign_id");
      const accountId = urlParams.get("account_id");

      if (!campaignId || !accountId) {
        setError("Campaign ID atau Account ID tidak ditemukan.");
        return;
      }

      // Payload untuk update (contoh: update status dan message)
      const payload = {
        status: "Delivered", // Contoh status baru
        message: "Pesan telah diperbarui", // Contoh pesan baru
      };

      // Panggil fungsi updateCampaignDetail
      const { data, error } = await updateCampaignDetail(campaignId, accountId, payload);

      if (error) {
        setError(error);
      } else {
        // Jika berhasil, perbarui state atau tampilkan pesan sukses
        console.log("Campaign detail berhasil diperbarui:", data);
        alert("Campaign detail berhasil diperbarui!");
        // Refresh data campaign detail
        fetchCampaignData();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Gagal memperbarui campaign detail.");
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, [fetchCampaignData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "px-3 py-1 rounded-lg bg-green-500 text-white text-sm font-medium";
      case "failed":
        return "px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium";
      case "sent":
        return "px-3 py-1 rounded-lg bg-orange-500 text-white text-sm font-medium";
      case "pending":
        return "px-3 py-1 rounded-lg bg-yellow-500 text-black text-sm font-medium";
      case "read":
        return "px-3 py-1 rounded-lg bg-blue-500 text-white text-sm font-medium";
      default:
        return "px-3 py-1 rounded-lg bg-gray-500 text-white text-sm font-medium";
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-[#0D1B2A] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 hover:text-gray-300 transition-all duration-200 cursor-pointer">
        Campaign Details
      </h1>

      {/* Informasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition-all duration-200">
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

        <div className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition-all duration-200">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FiPhone /> SENDER
          </h2>
          <p className="mt-2">{campaign?.phone_sender || "Tidak tersedia"}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition-all duration-200">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FiUsers /> CONTACTS
          </h2>
          <p className="mt-2">{campaign?.customersCount || 0}</p>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center hover:bg-gray-700 transition-all duration-200">
          <AiOutlineCheckCircle className="text-green-400 text-4xl mx-auto hover:text-green-500 transition-all duration-200" />
          <h2 className="text-lg font-bold mt-4 hover:text-gray-300 transition-all duration-200">DELIVERED</h2>
          <p className="text-3xl font-bold mt-4 text-green-400 hover:text-green-500 transition-all duration-200">
            {detailStatuses?.Delivered || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center hover:bg-gray-700 transition-all duration-200">
          <AiOutlineCloseCircle className="text-red-400 text-4xl mx-auto hover:text-red-500 transition-all duration-200" />
          <h2 className="text-lg font-bold mt-4 hover:text-gray-300 transition-all duration-200">FAILED</h2>
          <p className="text-3xl font-bold mt-4 text-red-400 hover:text-red-500 transition-all duration-200">
            {detailStatuses?.Failed || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center hover:bg-gray-700 transition-all duration-200">
          <FiSend className="text-orange-400 text-4xl mx-auto hover:text-orange-500 transition-all duration-200" />
          <h2 className="text-lg font-bold mt-4 hover:text-gray-300 transition-all duration-200">SENT</h2>
          <p className="text-3xl font-bold mt-4 text-orange-400 hover:text-orange-500 transition-all duration-200">
            {detailStatuses?.Sent || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center hover:bg-gray-700 transition-all duration-200">
          <MdOutlineMarkEmailRead className="text-yellow-400 text-4xl mx-auto hover:text-yellow-500 transition-all duration-200" />
          <h2 className="text-lg font-bold mt-4 hover:text-gray-300 transition-all duration-200">PENDING</h2>
          <p className="text-3xl font-bold mt-4 text-yellow-400 hover:text-yellow-500 transition-all duration-200">
            {detailStatuses?.Pending || 0}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow text-center hover:bg-gray-700 transition-all duration-200">
          <FaEye className="text-blue-400 text-4xl mx-auto hover:text-blue-500 transition-all duration-200" />
          <h2 className="text-lg font-bold mt-4 hover:text-gray-300 transition-all duration-200">READ</h2>
          <p className="text-3xl font-bold mt-4 text-blue-400 hover:text-blue-500 transition-all duration-200">
            {detailStatuses?.Read || 0}
          </p>
        </div>
      </div>

      {/* Tombol Back, Generate Campaign Detail, dan Update Campaign Detail */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            const accountId = new URLSearchParams(window.location.search).get("account_id");
            router.replace(`/users/campaignList/${accountId}`);
          }}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 hover:text-gray-100 transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={handleGenerateCampaignDetail}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:text-gray-100 transition-all duration-200"
        >
          Generate Campaign Detail
        </button>
        <button
          onClick={handleUpdateCampaignDetail}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:text-gray-100 transition-all duration-200"
        >
          Update Campaign Detail
        </button>
      </div>

      {/* Tabel Detail */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden mt-6">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Recipient</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {details.map((detail, index) => (
              <tr key={index} className="hover:bg-gray-600">
                <td className="px-6 py-4">{detail.recipient}</td>
                <td className="px-6 py-4">{detail.customer}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(detail.status)}`}>
                    {detail.status}
                  </span>
                </td>
                <td className="px-6 py-4">{detail.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <span className="text-white font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;