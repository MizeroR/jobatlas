import { useState } from 'react'

export default function TreeView({ data, onNodeSelect }) {
  const [expandedGroups, setExpandedGroups] = useState(new Set())

  if (!data) return <div className="p-4">Loading...</div>

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
    <div className="h-full overflow-auto bg-white">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Job Atlas Tree View</h2>
        
        <div className="space-y-2">
          {Object.entries(groupedNodes).map(([groupType, groupNodes]) => (
            <div key={groupType} className="border rounded-lg">
              <button
                onClick={() => toggleGroup(groupType)}
                className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 ${getGroupColor(groupType)}`}
              >
                <div className="flex items-center gap-2">
                  <span>{getGroupIcon(groupType)}</span>
                  <span className="font-medium capitalize">
                    {groupType.replace('_', ' ')}s
                  </span>
                  <span className="text-sm text-gray-500">
                    ({groupNodes.length})
                  </span>
                </div>
                <span className="text-gray-400">
                  {expandedGroups.has(groupType) ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedGroups.has(groupType) && (
                <div className="border-t bg-gray-50">
                  <div className="max-h-64 overflow-auto">
                    {groupNodes.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => onNodeSelect(node)}
                        className="w-full text-left p-2 hover:bg-white border-b border-gray-200 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {node.label}
                        </div>
                        {node.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {node.description.substring(0, 100)}...
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}