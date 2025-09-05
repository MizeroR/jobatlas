import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

// Hook for CSV loading
function useCsv(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    
    console.log('Loading CSV from:', path);
    
    Papa.parse(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        console.log('CSV loaded successfully:', path, 'rows:', res.data?.length);
        setData(res.data || []);
        setLoading(false);
        setError(null);
      },
      error: (err) => {
        console.error('CSV loading error:', path, err);
        setData([]);
        setLoading(false);
        setError(err);
      },
    });
  }, [path]);
  
  return { data, loading, error };
}

// Search Component
function SearchEntry({ onSearch, onSelect }) {
  const [query, setQuery] = useState('');
  const { data: occupations, loading: occLoading, error: occError } = useCsv('/data/occupations.csv');
  const { data: skills, loading: skillsLoading, error: skillsError } = useCsv('/data/skills.csv');
  
  // Debug info
  console.log('Occupations loaded:', occupations.length, 'Skills loaded:', skills.length);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items = [];

    occupations.slice(0, 50).forEach(occ => {
      if (occ.PREFERREDLABEL?.toLowerCase().includes(q)) {
        items.push({
          id: occ.ID,
          label: occ.PREFERREDLABEL,
          type: 'occupation',
          description: occ.DESCRIPTION
        });
      }
    });

    skills.slice(0, 50).forEach(skill => {
      if (skill.PREFERREDLABEL?.toLowerCase().includes(q)) {
        items.push({
          id: skill.ID,
          label: skill.PREFERREDLABEL,
          type: 'skill',
          description: skill.DESCRIPTION
        });
      }
    });

    return items.slice(0, 8);
  }, [query, occupations, skills]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Career Explorer</h1>
        <p className="text-gray-600">Search occupations or skills to explore connections</p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search an occupation or skill..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
        />
        
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-10">
            {results.map(item => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => onSelect(item)}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.type === 'occupation' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {['Air force officer', 'Military Engineer', 'Accounting Manager'].map(term => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-12 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              {term}
            </button>
          ))}
        </div>
        
        {/* Debug info */}
        {(occLoading || skillsLoading) && (
          <p className="text-sm text-orange-600 mt-4">Loading data...</p>
        )}
        {(occError || skillsError) && (
          <p className="text-sm text-red-600 mt-4">Error loading data. Check console for details.</p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          Data status: {occupations.length} occupations, {skills.length} skills loaded
        </p>
      </div>
    </div>
  );
}

// Structured View Component
function StructuredView({ item, onViewGraph, onSelectItem }) {
  const { data: occupations } = useCsv('/data/occupations.csv');
  const { data: skills } = useCsv('/data/skills.csv');
  const { data: relations } = useCsv('/data/occupation_to_skill_relations.csv');

  const connections = useMemo(() => {
    if (!relations.length) return { skills: [], occupations: [] };

    if (item.type === 'occupation') {
      const skillIds = relations
        .filter(rel => rel.OCCUPATIONID === item.id)
        .map(rel => rel.SKILLID)
        .slice(0, 12);
      
      const relatedSkills = skills
        .filter(skill => skillIds.includes(skill.ID))
        .map(skill => ({
          id: skill.ID,
          label: skill.PREFERREDLABEL,
          type: 'skill',
          description: skill.DESCRIPTION
        }));

      const relatedOccIds = relations
        .filter(rel => skillIds.includes(rel.SKILLID) && rel.OCCUPATIONID !== item.id)
        .map(rel => rel.OCCUPATIONID)
        .slice(0, 8);
      
      const relatedOccs = occupations
        .filter(occ => relatedOccIds.includes(occ.ID))
        .map(occ => ({
          id: occ.ID,
          label: occ.PREFERREDLABEL,
          type: 'occupation',
          description: occ.DESCRIPTION
        }));

      return { skills: relatedSkills, occupations: relatedOccs };
    } else {
      const occIds = relations
        .filter(rel => rel.SKILLID === item.id)
        .map(rel => rel.OCCUPATIONID)
        .slice(0, 12);
      
      const relatedOccs = occupations
        .filter(occ => occIds.includes(occ.ID))
        .map(occ => ({
          id: occ.ID,
          label: occ.PREFERREDLABEL,
          type: 'occupation',
          description: occ.DESCRIPTION
        }));

      return { skills: [], occupations: relatedOccs };
    }
  }, [item, occupations, skills, relations]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                item.type === 'occupation' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {item.type}
              </span>
              <h1 className="text-3xl font-bold">{item.label}</h1>
            </div>
            
            {item.description && (
              <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
                {item.description}
              </p>
            )}
          </div>
          
          <button
            onClick={() => onViewGraph(item, connections)}
            className="ml-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
          >
            🔗 View Graph
          </button>
        </div>
      </div>

      {/* Connections Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills */}
        {connections.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 text-green-800">Required Skills</h2>
            <div className="grid gap-3">
              {connections.skills.map(skill => (
                <div
                  key={skill.id}
                  onClick={() => onSelectItem(skill)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <h3 className="font-semibold text-gray-900">{skill.label}</h3>
                  {skill.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {skill.description.slice(0, 120)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Occupations */}
        {connections.occupations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-800">
              {item.type === 'occupation' ? 'Related Occupations' : 'Uses This Skill'}
            </h2>
            <div className="grid gap-3">
              {connections.occupations.map(occ => (
                <div
                  key={occ.id}
                  onClick={() => onSelectItem(occ)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <h3 className="font-semibold text-gray-900">{occ.label}</h3>
                  {occ.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {occ.description.slice(0, 120)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Graph View Component
function GraphView({ centerItem, connections, onSelectNode, onBackToStructured }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToStructured}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to List
        </button>
        <h1 className="text-2xl font-bold">Graph View: {centerItem.label}</h1>
        <div></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8 min-h-96">
        <div className="text-center">
          {/* Center Node */}
          <div className={`inline-block px-6 py-4 rounded-xl text-white font-bold text-lg mb-8 ${
            centerItem.type === 'occupation' ? 'bg-blue-600' : 'bg-green-600'
          }`}>
            {centerItem.label}
          </div>

          {/* Connected Nodes */}
          <div className="grid md:grid-cols-2 gap-8">
            {connections.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-800">Skills</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {connections.skills.slice(0, 10).map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => onSelectNode(skill)}
                      className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {connections.occupations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Occupations</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {connections.occupations.slice(0, 10).map(occ => (
                    <button
                      key={occ.id}
                      onClick={() => onSelectNode(occ)}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm"
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-500 mt-8">
            Click any node to explore its connections
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Workflow Component
export default function CareerWorkflow() {
  const [currentView, setCurrentView] = useState('search'); // 'search', 'structured', 'graph'
  const [selectedItem, setSelectedItem] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setCurrentView('structured');
  };

  const handleViewGraph = (item, connections) => {
    setGraphData({ centerItem: item, connections });
    setCurrentView('graph');
  };

  const handleGraphNodeSelect = (node) => {
    setSelectedItem(node);
    setCurrentView('structured');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedItem(null);
    setGraphData(null);
  };

  const handleBackToStructured = () => {
    setCurrentView('structured');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {currentView === 'search' && (
        <SearchEntry onSelect={handleSelectItem} />
      )}

      {currentView === 'structured' && selectedItem && (
        <div>
          <button
            onClick={handleBackToSearch}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Search
          </button>
          <StructuredView
            item={selectedItem}
            onViewGraph={handleViewGraph}
            onSelectItem={handleSelectItem}
          />
        </div>
      )}

      {currentView === 'graph' && graphData && (
        <GraphView
          centerItem={graphData.centerItem}
          connections={graphData.connections}
          onSelectNode={handleGraphNodeSelect}
          onBackToStructured={handleBackToStructured}
        />
      )}
    </div>
  );
}