import { useRouter } from "next/router";

const CampaignList = () => {
  const router = useRouter();
  const { id } = router.query; // Mengambil parameter ID dari URL
  console.log("Dynamic Route ID:", id);

  // Validasi ID
  if (!id) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-white">Campaign Detail</h1>
      <p className="text-white">You are viewing details for campaign ID: {id}</p>
      {/* Tambahkan informasi detail lainnya di sini */}
    </div>
  );
};

export default CampaignList;
