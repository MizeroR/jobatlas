import { useState } from 'react'

export default function FilterPanel({ onFilterChange }) {
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
    <div className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-4 min-w-64">
      {/* Filters */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Show/Hide</h3>
          <button
            onClick={toggleAll}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Toggle All
          </button>
        </div>
        
        <div className="space-y-2">
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
      </div>

      {/* Stats */}
      <div className="text-xs text-gray-500 border-t pt-2">
        <p>Active filters: {Object.values(filters).filter(v => v).length}/4</p>
      </div>
    </div>
  )
}