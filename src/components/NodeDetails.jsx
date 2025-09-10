import React from "react";

export default function NodeDetails({ node, onClose }) {
  if (!node) return null;

  return (
    <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-lg border-l p-4 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-sm text-gray-600 hover:text-black float-right"
      >
        ✖
      </button>
      <h2 className="text-lg font-bold mb-2">{node.label}</h2>
      <p className="text-sm text-gray-500 mb-4">Type: {node.type}</p>

      {/* Show more metadata */}
      <div className="space-y-2">
        {Object.entries(node).map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold">{key}: </span>
            <span className="text-gray-700">
              {typeof value === "string" && value.startsWith("{")
                ? value // don’t parse arrays for now
                : value?.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
