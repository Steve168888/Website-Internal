"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCampaigns } from "@/services/api";
import { averageSuccessCalculate, bestDayAndTimeCalculate } from "@/services/utils";
import BarChart from "./barChart/barChart";
import LineChart from "./lineChart/lineChart";
import HeatMap from "./blastRecommendation/blastRecommendation";

const ChartAnalytics = () => {
  const { id: accountId } = useParams(); // Dynamically fetch accountId
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [avgSuccess, setAvgSuccess] = useState<number>(0);
  const [bestInfo, setBestInfo] = useState<string>(""); // Combine best day, time, and rate
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!accountId || typeof accountId !== "string") {
        setError("Invalid account ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all campaigns for the account
        const { data, total, error } = await fetchCampaigns(accountId, 1, 100);

        if (error) {
          setError(error);
        } else {
          setTotalCampaigns(total); // Use total from API response

          // Calculate average success
          const { averageSuccess } = averageSuccessCalculate(data);
          setAvgSuccess(averageSuccess);

          // Calculate best day and time
          const { bestDay, bestTime, successRate } = bestDayAndTimeCalculate(data);
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
          setError(null);
        }
      } catch (err) {
        setError("Failed to fetch campaign data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  return (
  <div className="p-6 min-h-screen bg-gray-900">
    <h1 className="text-2xl text-white font-bold mb-6">Campaign Analytics</h1>

    {/* Statistik Cards */}
    <div className="flex justify-center gap-4 mb-6">
      {/* Total Campaigns */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 w-1/2 text-center flex flex-col justify-center items-center">
        <h3 className="text-white text-lg font-semibold">Total Campaigns</h3>
        {loading ? (
          <p className="text-2xl text-gray-400 font-bold">Loading...</p>
        ) : error ? (
          <p className="text-2xl text-red-400 font-bold">{error}</p>
        ) : (
          <p className="text-2xl text-teal-400 font-bold">{totalCampaigns}</p>
        )}
      </div>

      {/* Avg Success */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6 w-1/2 text-center flex flex-col justify-center items-center">
        <h3 className="text-white text-lg font-semibold">Average Success</h3>
        <p className="text-2xl text-teal-400 font-bold">
          {loading ? "Loading..." : `${avgSuccess.toFixed(2)}%`}
        </p>
      </div>
    </div>

    {/* Descriptive Text */}
    {!loading && !error && (
      <div
        className="bg-gray-800 rounded-lg shadow-md p-6 text-white text-lg mb-6"
        dangerouslySetInnerHTML={{ __html: bestInfo }}
      ></div>
    )}

    {/* Grid for Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Top Performing Day</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <BarChart />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Top Performing Time</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <LineChart />
        </div>
      </div>
    </div>

    {/* Future Analytics */}
    <div className="grid grid-cols-1 gap-6 mt-6">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Blast Recommendation Table</h3>
        <div className="h-auto text-gray-400">
          <HeatMap />
        </div>
      </div>
    </div>
  </div>
);
};

export default ChartAnalytics;
