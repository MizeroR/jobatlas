import { useState } from 'react'

export default function TreePanel({ data, onNodeSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState(new Set())

  if (!data) return null

  const { nodes } = data

  // Group nodes by type
  const groupedNodes = nodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = []
    acc[node.type].push(node)
    return acc
  }, {})

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

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-80 z-50 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Tree Panel */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 h-full overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Browse Categories</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
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