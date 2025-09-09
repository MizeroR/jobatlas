import React, { useState, useEffect } from "react";
// import { supabase } from "./lib/supabase";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const cleanLabel = (labelField) => {
    if (!labelField) return "";
    return labelField.replace(/[{}"]/g, "").trim();
  };

  const cleanAltLabels = (altLabelsField) => {
    if (!altLabelsField) return [];
    const cleaned = altLabelsField.replace(/[{}"]/g, "");
    return cleaned
      .split(",")
      .map((label) => label.trim())
      .filter((label) => label);
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchSkills = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("occupations")
          .select("ID, OCCUPATIONTYPE, PREFERREDLABEL, ALTLABELS, DESCRIPTION")
          .ilike("PREFERREDLABEL", `%${query}%`)
          .limit(8);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchSkills, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  if (selectedSkill) {
    const label = cleanLabel(selectedSkill.PREFERREDLABEL);
    const altLabels = cleanAltLabels(selectedSkill.ALTLABELS);

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedSkill(null)}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Search
          </button>

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="mb-6">
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full mb-4 inline-block">
                {selectedSkill.OCCUPATIONTYPE || "Occupation"}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{label}</h1>
            </div>

            {selectedSkill.DESCRIPTION && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {selectedSkill.DESCRIPTION}
                </p>
              </div>
            )}

            {altLabels.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">
                  Alternative Labels
                </h2>
                <div className="flex flex-wrap gap-2">
                  {altLabels.map((altLabel, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {altLabel}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Occupations Search</h1>
          <p className="text-gray-600">
            Search and explore professional occupations
          </p>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Type to search occupations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />

          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-10">
              {results.map((skill, i) => {
                const label = cleanLabel(skill.PREFERREDLABEL);

                return (
                  <div
                    key={skill.ID || i}
                    onClick={() => setSelectedSkill(skill)}
                    className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      {label}
                    </div>
                    <div className="text-sm text-blue-600">
                      {skill.OCCUPATIONTYPE || "Occupation"}
                    </div>
                    {skill.DESCRIPTION && (
                      <div className="text-sm text-gray-600 mt-1">
                        {skill.DESCRIPTION.slice(0, 80)}...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-sm text-gray-500 text-center">Searching...</div>
        )}
      </div>
    </div>
  );
}

export default App;
