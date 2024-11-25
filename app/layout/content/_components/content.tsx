"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Data untuk grafik
const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Sales",
      data: [120, 190, 300, 500, 200, 300],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
    {
      label: "Revenue",
      data: [150, 230, 250, 450, 350, 400],
      backgroundColor: "rgba(153, 102, 255, 0.5)",
    },
  ],
};

// Opsi konfigurasi grafik
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sales and Revenue Chart",
    },
  },
};

const Content = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Kotak untuk Tabel Transaksi */}
      <div className="bg-[#1E293B] rounded-lg p-4 shadow-md">
        <h2 className="text-gray-400 font-semibold mb-4">Latest Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">
                  Name
                </th>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">
                  Status
                </th>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">
                  Date
                </th>
                <th className="text-left text-gray-500 text-sm font-semibold py-2">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "John Doe", status: "pending", color: "yellow-500" },
                { name: "John Doe", status: "done", color: "blue-500" },
                { name: "John Doe", status: "cancelled", color: "red-500" },
                { name: "John Doe", status: "pending", color: "yellow-500" },
                { name: "John Doe", status: "done", color: "blue-500" },
              ].map((transaction, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 text-gray-200"
                >
                  <td className="py-2">{transaction.name}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-lg bg-${transaction.color} text-white text-xs font-semibold`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-2">14.02.2023</td>
                  <td className="py-2">$3,200</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kotak untuk Grafik */}
      <div className="bg-[#1E293B] rounded-lg p-4 shadow-md">
        <h2 className="text-gray-400 font-semibold mb-4">Graph Component</h2>
        <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Content;
