import { FC } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const CampaignDetail: FC = () => {
  return (
    <div className="container mx-auto p-6 bg-[#0D1B2A] text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Campaign Details - Test Bido Apri</h1>

      {/* Informasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Template */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">TEMPLATE</h2>
          <p className="mt-2 bg-yellow-500 text-black px-3 py-1 inline-block rounded">
            UTILITY
          </p>
          <p className="mt-2">
            template_document_header_quickreply_b...
          </p>
          <p className="mt-2">06-12-2024 18:55:33</p>
        </div>

        {/* Sender */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">SENDER</h2>
          <p className="mt-2">-</p>
        </div>

        {/* Contacts */}
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Contacts - Bido Alda</h2>
          <p className="mt-2">2</p>
          <p className="mt-2">0% Of your contacts</p>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Delivered */}
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <AiOutlineCheckCircle className="text-green-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">DELIVERED</h2>
          <p className="text-3xl font-bold mt-4 text-green-400">1</p>
          <p className="mt-2 text-green-400">50.00% Total</p>
        </div>

        {/* Read */}
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <MdOutlineMarkEmailRead className="text-blue-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">READ</h2>
          <p className="text-3xl font-bold mt-4 text-blue-400">1</p>
          <p className="mt-2 text-blue-400">50.00% Total</p>
        </div>

        {/* Sent */}
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <FiSend className="text-orange-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">SENT</h2>
          <p className="text-3xl font-bold mt-4 text-orange-400">0</p>
          <p className="mt-2 text-orange-400">0% Total</p>
        </div>

        {/* Failed */}
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <AiOutlineCloseCircle className="text-red-400 text-4xl mx-auto" />
          <h2 className="text-lg font-bold mt-4">FAILED</h2>
          <p className="text-3xl font-bold mt-4 text-red-400">0</p>
          <p className="mt-2 text-red-400">0% Total</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
