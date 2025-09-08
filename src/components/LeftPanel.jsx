import { useState } from 'react'

export default function LeftPanel({ data, onFilterChange, onNodeSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('filters')
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  
  const [filters, setFilters] = useState({
    occupation: true,
    skill: true,
    occupation_group: true,
    skill_group: true
  })

  const handleFilterChange = (type) => {
    const newFilters = { ...filters, [type]: !filters[type] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleAll = () => {
    const allEnabled = Object.values(filters).every(v => v)
    const newFilters = {
      occupation: !allEnabled,
      skill: !allEnabled,
      occupation_group: !allEnabled,
      skill_group: !allEnabled
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleGroup = (groupType) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupType)) {
      newExpanded.delete(groupType)
    } else {
      newExpanded.add(groupType)
    }
    setExpandedGroups(newExpanded)
  }

  const getGroupColor = (type) => {
    const colors = {
      occupation: 'text-blue-600',
      skill: 'text-red-600',
      occupation_group: 'text-green-600',
      skill_group: 'text-purple-600'
    }
    return colors[type] || 'text-gray-600'
  }

  const getGroupIcon = (type) => {
    const icons = {
      occupation: '👔',
      skill: '🛠️',
      occupation_group: '📁',
      skill_group: '📂'
    }
    return icons[type] || '📄'
  }

  // Group nodes by type for tree view
  const groupedNodes = data ? data.nodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = []
    acc[node.type].push(node)
    return acc
  }, {}) : {}

  return (
    <>
      {/* Toggle Button - Only show when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Left Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Controls</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-4 border-b">
            <button
              onClick={() => setActiveTab('filters')}
              className={`px-4 py-2 font-medium ${activeTab === 'filters' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              Filters
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 font-medium ${activeTab === 'browse' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              Browse
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Show/Hide</h3>
                  <button
                    onClick={toggleAll}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Toggle All
                  </button>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.occupation}
                      onChange={() => handleFilterChange('occupation')}
                      className="rounded"
                    />
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-sm">Occupations</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.skill}
                      onChange={() => handleFilterChange('skill')}
                      className="rounded"
                    />
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span className="text-sm">Skills</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.occupation_group}
                      onChange={() => handleFilterChange('occupation_group')}
                      className="rounded"
                    />
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span className="text-sm">Occupation Groups</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.skill_group}
                      onChange={() => handleFilterChange('skill_group')}
                      className="rounded"
                    />
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-sm">Skill Groups</span>
                  </label>
                </div>

                <div className="text-xs text-gray-500 border-t pt-3 mt-4">
                  <p>Active filters: {Object.values(filters).filter(v => v).length}/4</p>
                </div>
              </div>
            )}

            {/* Browse Tab */}
            {activeTab === 'browse' && (
              <div className="space-y-2">
                {Object.entries(groupedNodes).map(([groupType, groupNodes]) => (
                  <div key={groupType} className="border rounded-lg">
                    <button
                      onClick={() => toggleGroup(groupType)}
                      className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 ${getGroupColor(groupType)}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{getGroupIcon(groupType)}</span>
                        <span className="font-medium capitalize text-sm">
                          {groupType.replace('_', ' ')}s
                        </span>
                        <span className="text-xs text-gray-500">
                          ({groupNodes.length})
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {expandedGroups.has(groupType) ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedGroups.has(groupType) && (
                      <div className="border-t bg-gray-50">
                        <div className="max-h-48 overflow-auto">
                          {groupNodes.slice(0, 50).map((node) => (
                            <button
                              key={node.id}
                              onClick={() => {
                                onNodeSelect(node)
                                setIsOpen(false)
                              }}
                              className="w-full text-left p-2 hover:bg-white border-b border-gray-200 last:border-b-0"
                            >
                              <div className="text-xs font-medium text-gray-900">
                                {node.label}
                              </div>
                              {node.description && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {node.description.substring(0, 80)}...
                                </div>
                              )}
                            </button>
                          ))}
                          {groupNodes.length > 50 && (
                            <div className="p-2 text-xs text-gray-500 text-center">
                              ... and {groupNodes.length - 50} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}