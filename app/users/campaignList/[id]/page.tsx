"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/services/api";
import Link from "next/link";

interface Campaign {
  campaign_id: string;
  name: string;
  status: string;
  created_at: string;
}

const CampaignList = () => {
  const { id } = useParams();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak tersedia. Silakan login terlebih dahulu.");
          setLoading(false);
          return;
        }

        // Fetch data dengan search dan pagination
        const data = await fetchAPI<{
          data: Campaign[];
          total: number;
          page: string;
          total_pages: number;
          limit: number;
        }>(`campaign/get?account_id=${id}&limit=${itemsPerPage}&page=${currentPage}&search=${searchTerm}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCampaigns(data?.data || []);
        setTotalPages(data?.total_pages || 1);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Gagal mengambil data kampanye. Periksa token atau server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [id, currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Header dan Kotak Pencarian */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-1/4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 pl-10 w-full rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.32-4.32a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabel Kampanye */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Campaign Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign.campaign_id}>
                  <td className="px-6 py-4">{campaign.name}</td>
                  <td className="px-6 py-4">{campaign.status}</td>
                  <td className="px-6 py-4">{new Date(campaign.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/users/campaignDetail?campaign_id=${campaign.campaign_id}&account_id=${id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                  Tidak ada data kampanye yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => router.push("/users")}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Back
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignList;
