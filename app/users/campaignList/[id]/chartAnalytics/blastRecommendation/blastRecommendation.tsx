"use client";

import React, { useEffect, useState } from "react";

// Define the type for campaign data
interface Campaign {
  created_at: string;
  detailStatuses?: {
    Delivered?: number;
    Read?: number;
    Failed?: number;
    Pending?: number;
    Sent?: number;
  };
}

// Define the type for recommendation row
interface RecommendationRow {
  day: string;
  hour: string;
  read: number;
  total: number;
  recommendation: string;
}

// Define the type for props
interface RecommendationTableProps {
  campaigns: Campaign[];
}

// Days and hours range
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hours: string[] = Array.from({ length: 12 }, (_, i) => `${i * 2}:00 - ${i * 2 + 2}:00`);

const RecommendationTable: React.FC<RecommendationTableProps> = ({ campaigns }) => {
  const [tableData, setTableData] = useState<RecommendationRow[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("All");

  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      setTableData([]);
      return;
    }

    const rows: RecommendationRow[] = [];

    days.forEach((day) => {
      hours.forEach((hour) => {
        const [startHour] = hour.split(":").map((h) => parseInt(h, 10));
        const endHour = startHour + 2;

        const campaignsInHour = campaigns.filter((campaign) => {
          const campaignDate = new Date(campaign.created_at);
          const campaignDay = days[campaignDate.getDay()];
          const campaignHour = campaignDate.getHours();

          return campaignDay === day && campaignHour >= startHour && campaignHour < endHour;
        });

        const totalMessages = campaignsInHour.reduce((sum, campaign) => {
          const { Delivered = 0, Failed = 0, Sent = 0, Pending = 0 } = campaign.detailStatuses || {};
          return sum + Delivered + Failed + Sent + Pending;
        }, 0);

        const readMessages = campaignsInHour.reduce(
          (sum, campaign) => sum + (campaign.detailStatuses?.Read || 0),
          0
        );

        const ratio = totalMessages > 0 ? readMessages / totalMessages : 0;
        let recommendation = "Not Recommended";
        if (ratio >= 0.8) recommendation = "Highly Recommended";
        else if (ratio >= 0.6) recommendation = "Recommended";
        else if (ratio >= 0.4) recommendation = "Neutral";

        rows.push({ day, hour, read: readMessages, total: totalMessages, recommendation });
      });
    });

    setTableData(rows);
  }, [campaigns]);

  const filteredData = selectedDay === "All" ? tableData : tableData.filter((row) => row.day === selectedDay);

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="dayFilter" className="text-white mr-2">Filter by Day:</label>
        <select
          id="dayFilter"
          className="bg-gray-700 text-white rounded px-3 py-2"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="All">All</option>
          {days.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {tableData.length === 0 ? (
        <p className="text-gray-400 text-center">No campaign data available.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-700 text-white">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-4 py-2">Day</th>
              <th className="border border-gray-600 px-4 py-2">Hour</th>
              <th className="border border-gray-600 px-4 py-2">Read</th>
              <th className="border border-gray-600 px-4 py-2">Total</th>
              <th className="border border-gray-600 px-4 py-2">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-600">
                <td className="border border-gray-600 px-4 py-2 text-center">{row.day}</td>
                <td className="border border-gray-600 px-4 py-2 text-center">{row.hour}</td>
                <td className="border border-gray-600 px-4 py-2 text-center">{row.read}</td>
                <td className="border border-gray-600 px-4 py-2 text-center">{row.total}</td>
                <td className="border border-gray-600 px-4 py-2 text-center">{row.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecommendationTable;
