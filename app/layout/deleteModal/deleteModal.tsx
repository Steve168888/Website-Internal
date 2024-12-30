"use client";

import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityType?: string; // Dynamic entity type, e.g., "account" or "campaign"
  entityName?: string; // Name of the entity to display in the message
}

const DeleteModal = ({ isOpen, onClose, onConfirm, entityType, entityName }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-1/3">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete this{" "}
          <span className=" text-white">{entityType || "item"}</span> ?
          {entityName && (
            <>
              <br />
              <span className="text-gray-400">Name: {entityName}</span>
            </>
          )}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
