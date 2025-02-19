"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Campaign {
  created_at: string;
  detailStatuses?: {
    Delivered?: number;
    Read?: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
}

interface BarChartProps {
  campaigns: Campaign[];
}

const BarChart: React.FC<BarChartProps> = ({ campaigns }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      setError("No campaign data available.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const deliveredCounts = Array(7).fill(0);
      const readCounts = Array(7).fill(0);

      campaigns.forEach((campaign) => {
        const createdDate = new Date(campaign.created_at);
        const dayIndex = createdDate.getDay();

        deliveredCounts[dayIndex] += campaign.detailStatuses?.Delivered || 0;
        readCounts[dayIndex] += campaign.detailStatuses?.Read || 0;
      });

      const maxDelivered = Math.max(...deliveredCounts);
      const maxRead = Math.max(...readCounts);

      const datasets = [
        {
          label: "Delivered",
          data: deliveredCounts,
          backgroundColor: deliveredCounts.map((value) =>
            value === maxDelivered ? "rgba(255, 99, 132, 0.8)" : "rgba(75, 192, 192, 0.6)"
          ),
        },
        {
          label: "Read",
          data: readCounts,
          backgroundColor: readCounts.map((value) =>
            value === maxRead ? "rgba(255, 206, 86, 0.8)" : "rgba(153, 102, 255, 0.6)"
          ),
        },
      ];

      setChartData({
        labels: dayLabels,
        datasets,
      });

      setError(null);
    } catch (err) {
      console.error("Error processing campaign data:", err);
      setError("Failed to process campaign data.");
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

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
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%", maxHeight: "500px" }}>
      {loading ? (
        <p className="text-gray-400 text-center">Loading chart...</p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <Bar data={chartData!} options={options} />
      )}
    </div>
  );
};

export default BarChart;
