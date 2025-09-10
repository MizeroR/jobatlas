import { useState, useEffect } from 'react'
import { buildGraph } from "../lib/graph/buildGraph.js"

export default function BrowseView() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState(new Set())
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const graphData = await buildGraph()
        setData(graphData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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

  const groupedNodes = data ? data.nodes.reduce((acc, node) => {
    if (!acc[node.type]) acc[node.type] = []
    acc[node.type].push(node)
    return acc
  }, {}) : {}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 ml-auto mr-16 overflow-y-auto max-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 pb-20">
          {Object.entries(groupedNodes).map(([groupType, groupNodes]) => (
            <div key={groupType} className="border rounded-lg shadow-sm">
              <button
                onClick={() => toggleGroup(groupType)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 ${getGroupColor(groupType)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getGroupIcon(groupType)}</span>
                  <div>
                    <h3 className="font-semibold capitalize">
                      {groupType.replace('_', ' ')}s
                    </h3>
                    <p className="text-sm text-gray-500">
                      {groupNodes.length} items
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">
                  {expandedGroups.has(groupType) ? '▼' : '▶'}
                </span>
              </button>
              
              {expandedGroups.has(groupType) && (
                <div className="border-t bg-gray-50">
                  <div className="max-h-96 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {groupNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className="text-left p-3 bg-white rounded border hover:shadow-sm transition-shadow"
                        >
                          <div className="font-medium text-sm text-gray-900">
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
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedNode && (
          <div className="lg:col-span-1">
            <div className="sticky top-6 border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">Details</h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${getGroupColor(selectedNode.type)} bg-opacity-10`}>
                {selectedNode.type.replace('_', ' ')}
              </div>
              <h4 className="font-medium mb-2">{selectedNode.label}</h4>
              {selectedNode.description && (
                <p className="text-sm text-gray-600">{selectedNode.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}