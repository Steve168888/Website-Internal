"use client";

import React, { useState } from "react";
import { createAccount } from "@/services/api"; // API function to create account

interface CreateAccountProps {
  onClose: () => void; // Prop for handling modal close
}

const CreateAccount = ({ onClose }: CreateAccountProps) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    balance: "",
  });
  const [message, setMessage] = useState<string | null>(null); // State for success/error messages
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Reset message before making request

    try {
      const result = await createAccount(formData);

      if (result.success) {
        setMessage("Account created successfully!"); // Success message
        setFormData({ name: "", username: "", email: "", balance: "" }); // Reset form
        setTimeout(() => {
          setMessage(null); // Clear message
          onClose(); // Close modal
        }, 1000); // Delay to show success message before closing
      } else {
        setMessage(result.error || "Failed to create account."); // Error message
      }
    } catch (error) {
      console.error(error);
      setMessage("An unexpected error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-1/3 relative">
      {/* Tombol silang untuk close */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-all duration-200"
        aria-label="Close"
      >
        ✕
      </button>
      
      <h2 className="text-lg font-bold mb-4">Add New Account</h2>
      
      {/* Display success/error message */}
      {message && (
        <div
          className={`mb-4 text-sm font-medium ${
            message.startsWith("Account created successfully")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
