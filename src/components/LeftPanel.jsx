import { useState } from 'react'

export default function LeftPanel({ data, onFilterChange, onNodeSelect }) {
  const [isOpen, setIsOpen] = useState(false)
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



  return (
    <>
      {/* Toggle Button - Only show when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-16 left-4 z-50 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Left Panel */}
      <div className={`fixed top-20 left-0 h-[calc(100vh-5rem)] w-80 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto">
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