"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCampaigns, deleteCampaign, fetchGenerateCampaign } from "@/services/api"; // Import fetchGenerateCampaign
import { handlePagination, handleSearch, HidePagination } from "@/services/utils";
import { useParams, useRouter } from "next/navigation";
import ChartAnalytics from "./chartAnalytics/chartAnalytics";

interface Campaign {
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
}

const CampaignList = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAll, setLoadingAll] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [valueTerm, setSearchTerm] = useState<string>("");

  const itemsPerPage = 10;

  // Fetch data berdasarkan pagination
  useEffect(() => {
    const fetchData = async () => {
      if (!id || typeof id !== "string") {
        setError("Invalid account ID.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const { data, totalPages, total, error } = await fetchCampaigns(id, currentPage, itemsPerPage, valueTerm);

        if (error) {
          setError(error);
        } else {
          setCampaigns(data);
          setTotalPages(totalPages);
          setTotalCampaigns(total);
          setError(null);
        }
      } catch {
        setError("Failed to fetch campaign data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage, valueTerm]);

  // Fetch semua data campaign untuk ChartAnalytics
  useEffect(() => {
    const fetchAllData = async () => {
      if (!id || typeof id !== "string") {
        return;
      }

      setLoadingAll(true);
      try {
        const { data } = await fetchCampaigns(id, 1, 1000, ""); // Ambil semua campaign tanpa pagination
        setAllCampaigns(data);
      } catch (err) {
        console.error("Error fetching all campaigns:", err);
      } finally {
        setLoadingAll(false);
      }
    };

    fetchAllData();
  }, [id]);

  const { handlePrevious, handleNext } = handlePagination(currentPage, totalPages, setCurrentPage);
  const hidePagination = HidePagination(campaigns.length, totalPages, undefined);

  const handleDelete = async (campaignId: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      const result = await deleteCampaign(campaignId, id);
      if (result.success) {
        alert("Campaign deleted successfully!");
        setCampaigns((prev) => prev.filter((campaign) => campaign.campaign_id !== campaignId));
        setTotalCampaigns((prev) => prev - 1);
        setAllCampaigns((prev) => prev.filter((campaign) => campaign.campaign_id !== campaignId));
      } else {
        alert(`Failed to delete campaign: ${result.message}`);
      }
    }
  };

  // Fungsi untuk generate campaign
  const handleGenerateCampaign = async () => {
    if (!id) {
      alert("Invalid account ID.");
      return;
    }

    try {
      const result = await fetchGenerateCampaign(id);
      if (result.success) {
        alert("Campaign generated successfully!");
        // Refresh data campaign setelah generate
        const { data } = await fetchCampaigns(id, currentPage, itemsPerPage, valueTerm);
        setCampaigns(data);
        // Refresh semua data untuk ChartAnalytics
        const { data: allData } = await fetchCampaigns(id, 1, 1000, "");
        setAllCampaigns(allData);
      } else {
        alert(`Failed to generate campaign: ${result.message}`);
      }
    } catch (error) {
      console.error("Error generating campaign:", error);
      alert("An unexpected error occurred while generating the campaign.");
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white hover:text-gray-300 transition-all duration-200 cursor-pointer">
          Campaign List
        </h1>
        <div className="relative w-1/4">
          <input
            type="text"
            placeholder="Search Campaigns..."
            value={valueTerm}
            onChange={(e) => handleSearch(e, setSearchTerm, setCurrentPage)}
            className="px-4 py-2 pl-10 w-full rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
      </div>

      <div className="bg-gray-800 text-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Campaign Name</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Created At</th>
              <th className="px-6 py-3 text-center">Schedule</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign.campaign_id} className="hover:bg-gray-600">
                  <td className="px-6 py-4">{campaign.name}</td>
                  <td className="px-6 py-4 text-center">{campaign.status}</td>
                  <td className="px-6 py-4 text-center">{new Date(campaign.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">{campaign.schedule ? new Date(campaign.schedule).toLocaleString() : "-"}</td>
                  <td className="px-6 py-4 text-center flex justify-center space-x-4">
                    <Link href={`/users/campaignDetail?campaign_id=${campaign.campaign_id}&account_id=${id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200">
                      Detail
                    </Link>
                    <button onClick={() => handleDelete(campaign.campaign_id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">There is no campaign data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button
            onClick={() => router.replace("/users")}
            className="px-4 py-2 bg-gray-700 text-white rounded transition-all duration-200 
              hover:bg-gray-600 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleGenerateCampaign}
            className="px-4 py-2 bg-green-600 text-white rounded transition-all duration-200 
              hover:bg-green-500 disabled:opacity-50"
          >
            Generate Campaign
          </button>
        </div>

        {!hidePagination && (
          <div className="flex space-x-2 items-center">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-700 text-white opacity-50 hover:bg-gray-600"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              Previous
            </button>
            <span className="text-white">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded transition-all duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-700 text-white opacity-50 hover:bg-gray-600"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {!loadingAll && <ChartAnalytics campaigns={allCampaigns} totalCampaigns={totalCampaigns} />}
      </div>
    </div>
  );
};

export default CampaignList;