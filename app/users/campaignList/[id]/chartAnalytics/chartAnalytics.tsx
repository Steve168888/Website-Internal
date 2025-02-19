"use client";

import React, { useEffect, useState } from "react";
import { averageSuccessCalculate, bestDayAndTimeCalculate } from "@/services/utils";
import BarChart from "./barChart/barChart";
import LineChart from "./lineChart/lineChart";
import HeatMap from "./blastRecommendation/blastRecommendation";

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

interface ChartAnalyticsProps {
  campaigns: Campaign[];  // Data dari CampaignList.tsx
  totalCampaigns: number; // Total kampanye
}

const ChartAnalytics: React.FC<ChartAnalyticsProps> = ({ campaigns, totalCampaigns }) => {
  const [avgSuccess, setAvgSuccess] = useState<number>(0);
  const [bestInfo, setBestInfo] = useState<string>("");

  useEffect(() => {
    if (campaigns.length > 0) {
      // Hitung rata-rata sukses
      const { averageSuccess } = averageSuccessCalculate(campaigns);
      setAvgSuccess(averageSuccess);

      // Hitung hari & waktu terbaik
      const { bestDay, bestTime, successRate } = bestDayAndTimeCalculate(campaigns);
      const formattedTime = bestTime
        ? new Date(`1970-01-01T${bestTime}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          })
        : "N/A";

      setBestInfo(
        bestDay && bestTime
          ? `The campaign on <span style="color: #2dd4bf;">${bestDay}</span>&nbsp;at&nbsp;<span style="color: #2dd4bf;">${formattedTime}</span>&nbsp;has the highest read success rate of&nbsp;<span style="color: #2dd4bf;">${successRate}%</span>.`
          : "No sufficient data to determine the best campaign time."
      );
    } else {
      setAvgSuccess(0);
      setBestInfo("No campaign data available.");
    }
  }, [campaigns]);

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-2xl text-white font-bold mb-6">Campaign Analytics</h1>

      {/* Statistik Cards */}
      <div className="flex justify-center gap-4 mb-6">
        {/* Total Campaigns */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 w-1/2 text-center flex flex-col justify-center items-center">
          <h3 className="text-white text-lg font-semibold">Total Campaigns</h3>
          <p className="text-2xl text-teal-400 font-bold">{totalCampaigns}</p>
        </div>

        {/* Avg Success */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 w-1/2 text-center flex flex-col justify-center items-center">
          <h3 className="text-white text-lg font-semibold">Average Success</h3>
          <p className="text-2xl text-teal-400 font-bold">{avgSuccess.toFixed(2)}%</p>
        </div>
      </div>

      {/* Descriptive Text */}
      <div
        className="bg-gray-800 rounded-lg shadow-md p-6 text-white text-lg mb-6"
        dangerouslySetInnerHTML={{ __html: bestInfo }}
      ></div>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Top Performing Day</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <BarChart campaigns={campaigns} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Top Performing Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <LineChart campaigns={campaigns} />
          </div>
        </div>
      </div>

      {/* Future Analytics */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Blast Recommendation Table</h3>
          <div className="h-auto text-gray-400">
            <HeatMap campaigns={campaigns} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartAnalytics;
