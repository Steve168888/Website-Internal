"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useParams } from "next/navigation";
import { fetchCampaigns } from "@/services/api";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Define the type for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    pointBackgroundColor: string;
    pointBorderColor: string;
  }[];
}

const LineChart = () => {
  const { id: rawAccountId } = useParams(); // Dynamically fetch accountId
  const accountId = Array.isArray(rawAccountId) ? rawAccountId[0] : rawAccountId; // Ensure it's a string

  const [chartData, setChartData] = useState<ChartData | null>(null);
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
        const { data } = await fetchCampaigns(accountId, 1, 10);
        const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`); // Labels for 24 hours
        const deliveredCounts = Array(24).fill(0);
        const readCounts = Array(24).fill(0);

        data.forEach((campaign) => {
          const createdDate = new Date(campaign.created_at);
          const hour = createdDate.getHours();

          deliveredCounts[hour] += campaign.detailStatuses?.Delivered || 0;
          readCounts[hour] += campaign.detailStatuses?.Read || 0;
        });

        setChartData({
          labels: hourLabels,
          datasets: [
            {
              label: "Delivered",
              data: deliveredCounts,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
              pointBackgroundColor: "rgba(255, 99, 132, 1)",
              pointBorderColor: "rgba(255, 99, 132, 1)",
            },
            {
              label: "Read",
              data: readCounts,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointBorderColor: "rgba(75, 192, 192, 1)",
            },
          ],
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching line chart data:", err);
        setError("Failed to load line chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)", // X-axis label color
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Gridline color
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)", // Y-axis label color
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "100%",
        margin: "0 auto", // Center chart
      }}
      className="bg-gray-800 rounded-lg shadow-md p-6"
    >
      {loading ? (
        <p className="text-gray-400 text-center">Loading chart...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <Line data={chartData!} options={options} />
      )}
    </div>
  );
};

export default LineChart;
