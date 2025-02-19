"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchCampaigns } from "@/services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Campaign {
  campaign_id: string;
  name: string;
  created_at: string;
}

interface Account {
  _id: string;
  name: string;
  email: string;
  balance: number;
  campaignCount: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// **Menerima props `accounts` dari User.tsx**
interface ChartProps {
  accounts: Account[];
}

const Chart: React.FC<ChartProps> = ({ accounts }) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "Total Campaigns",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Plugin untuk menampilkan teks "No data available"
  const noDataPlugin: Plugin = {
    id: "noDataPlugin",
    beforeDraw: (chart) => {
      const { datasets } = chart.data;
      const hasData = datasets.some((dataset) => dataset.data.length > 0);

      if (!hasData && !loading) {
        const ctx = chart.ctx;
        const { width, height } = chart;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "16px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText("No data available", width / 2, height / 2);
        ctx.restore();
      }
    },
  };

  ChartJS.register(noDataPlugin);

  const fetchCampaignData = useCallback(
    async (accountId: string) => {
      setLoading(true);
      try {
        const { data, error } = await fetchCampaigns(accountId, 1, 100);
        setLoading(false);
        if (error) throw new Error(error);
        setAllCampaigns(data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setAllCampaigns([]);
        setLoading(false);
      }
    },
    []
  );

  const filterCampaignsByDate = useCallback(() => {
    if (!startDate || !endDate) return;

    const groupedCampaigns: Record<string, number> = {};

    allCampaigns.forEach((campaign) => {
      const campaignDate = new Date(campaign.created_at).toISOString().split("T")[0];
      const campaignDateObject = new Date(campaign.created_at);

      const startDateObject = new Date(startDate);
      startDateObject.setHours(0, 0, 0, 0);

      const endDateObject = new Date(endDate);
      endDateObject.setHours(23, 59, 59, 999);

      if (campaignDateObject >= startDateObject && campaignDateObject <= endDateObject) {
        groupedCampaigns[campaignDate] = (groupedCampaigns[campaignDate] || 0) + 1;
      }
    });

    const labels = Object.keys(groupedCampaigns).sort();
    const data = labels.map((label) => groupedCampaigns[label]);

    const selectedAccountName =
      selectedAccount === "all"
        ? "All Accounts"
        : accounts.find((acc) => acc._id === selectedAccount)?.name || "Unknown Account";

    setChartData({
      labels,
      datasets: [
        {
          label: `Total Campaigns (${selectedAccountName})`,
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [allCampaigns, startDate, endDate, selectedAccount, accounts]);

  const handleAccountChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = e.target.value;
    setSelectedAccount(accountId);

    if (accountId === "all") {
      setLoading(true);
      try {
        const combinedCampaigns: Campaign[] = [];
        for (const account of accounts) {
          if (account._id !== "all") {
            const { data, error } = await fetchCampaigns(account._id, 1, 100);
            if (error) throw new Error(error);
            combinedCampaigns.push(...data);
          }
        }
        setAllCampaigns(combinedCampaigns);
      } catch (err) {
        console.error("Error fetching campaigns for all accounts:", err);
        setAllCampaigns([]);
      } finally {
        setLoading(false);
      }
    } else {
      await fetchCampaignData(accountId);
    }
  };

  useEffect(() => {
    filterCampaignsByDate();
  }, [startDate, endDate, allCampaigns, filterCampaignsByDate]);

  return (
    <div className="mt-6 bg-gray-800 text-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Campaign Distribution</h2>

      <div className="flex items-center mb-6" style={{ gap: "1rem" }}>
        <div>
          <label className="block text-sm mb-2">Start Date:</label>
          <DatePicker
            selected={startDate ?? undefined}
            onChange={(date) => setStartDate(date)}
            maxDate={endDate ?? new Date()}
            placeholderText="Select start date"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">End Date:</label>
          <DatePicker
            selected={endDate ?? undefined}
            onChange={(date) => setEndDate(date)}
            minDate={startDate ?? undefined}
            maxDate={new Date()}
            placeholderText="Select end date"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm mb-2">Select Account:</label>
        <select
          value={selectedAccount}
          onChange={handleAccountChange}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 w-full"
          style={{ maxHeight: "150px", overflowY: "auto" }}
        >
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 mt-4">Loading...</div>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default Chart;
