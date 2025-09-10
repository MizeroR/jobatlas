import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ data, onNodeSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
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
      occupation: 'bg-[#4CC9F0]/20 text-[#4CC9F0]',
      skill: 'bg-[#FFB703]/20 text-[#FFB703]',
      occupation_group: 'bg-[#9D4EDD]/20 text-[#9D4EDD]',
      skill_group: 'bg-[#4CC9F0]/20 text-[#4CC9F0]'
    }
    return colors[type] || 'bg-[#E9ECEF]/20 text-[#E9ECEF]'
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 px-4 py-2 pl-10 bg-[#2A2438] border border-[#9D4EDD]/30 rounded-lg text-[#E9ECEF] placeholder-[#E9ECEF]/60 focus:outline-none focus:ring-2 focus:ring-[#FFB703] focus:border-transparent"
        />
        <svg className="absolute left-3 top-2.5 h-5 w-5 text-[#E9ECEF]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2A2438] border border-[#9D4EDD]/30 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.map((node) => (
            <button
              key={node.id}
              onClick={() => handleSelect(node)}
              className="w-full text-left p-3 hover:bg-[#9D4EDD]/20 border-b border-[#9D4EDD]/20 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-[#E9ECEF]">{node.label}</div>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getNodeColor(node.type)}`}>
                  {node.type.replace('_', ' ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}