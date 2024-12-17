// app/users/campaignList/[id]/page.tsx
"use client"; // Menandakan ini adalah komponen client-side

import { useParams } from 'next/navigation'; // Gunakan useParams dari next/navigation
import { useEffect, useState } from 'react'; // Import useState dan useEffect untuk mengelola state
import { fetchAPI } from "@/services/api"; // Fungsi fetchAPI untuk mengambil data dari API
import Link from 'next/link'; // Import Link untuk navigasi ke halaman detail

interface Campaign {
  campaign_id: string;
  name: string;
  status: string;
  created_at: string;
  
}

const CampaignList = () => {
  const { id } = useParams(); // Mengambil id dari URL
  const [campaigns, setCampaigns] = useState<Campaign[]>([]); // State untuk menyimpan data kampanye
  const [loading, setLoading] = useState<boolean>(true); // State untuk status loading
  const [error, setError] = useState<string | null>(null); // State untuk menangani error

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        // Ambil token dari localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak tersedia. Silakan login terlebih dahulu.");
          setLoading(false);
          return;
        }

        // Ambil data dari API menggunakan ID dari URL
        const data = await fetchAPI<{ data: Campaign[] }>(`campaign/get?account_id=${id}&limit=10&page=1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token di header
          },
        });

        // Set data kampanye
        setCampaigns(data?.data || []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Gagal mengambil data kampanye. Periksa token atau server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [id]); // Mengambil data setiap kali id berubah

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto p-6">
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
                      href={`/users/campaignList/${id}/detail/${campaign.campaign_id}`}
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
    </div>
  );
};

export default CampaignList;
