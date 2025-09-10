import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ data, onNodeSelect, onLayoutAction }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLayoutOpen, setIsLayoutOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (searchTerm.length > 1 && data) {
      const filtered = data.nodes
        .filter(node => 
          node.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10)
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [searchTerm, data])

  const handleSelect = (node) => {
    console.log('Search: Selected node:', node)
    setSearchTerm('')
    setSuggestions([])
    setIsOpen(false)
    onNodeSelect(node)
  }

  const getNodeColor = (type) => {
    const colors = {
      occupation: 'bg-blue-100 text-blue-800',
      skill: 'bg-red-100 text-red-800',
      occupation_group: 'bg-green-100 text-green-800',
      skill_group: 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {suggestions.map((node) => (
              <button
                key={node.id}
                onClick={() => handleSelect(node)}
                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{node.label}</div>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getNodeColor(node.type)}`}>
                    {node.type.replace('_', ' ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Layout Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsLayoutOpen(!isLayoutOpen)}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-50 flex items-center gap-2"
        >
          <span className="text-sm font-medium">Layout</span>
          <svg className={`w-4 h-4 transition-transform ${isLayoutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isLayoutOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
            <button
              onClick={() => { onLayoutAction('toggleFA2'); setIsLayoutOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 text-sm"
            >
              FA2 Layout
            </button>
            <button
              onClick={() => { onLayoutAction('random'); setIsLayoutOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 text-sm"
            >
              Random
            </button>
            <button
              onClick={() => { onLayoutAction('circular'); setIsLayoutOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
            >
              Circular
            </button>
          </div>
        )}
      </div>

    </div>
  )
}