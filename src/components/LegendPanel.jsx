import { useState } from 'react'

export default function LegendPanel({ selectedNode, onClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('legend')

  // Auto-open panel when node is selected
  if (selectedNode && !isOpen) {
    setIsOpen(true)
    setActiveTab('details')
  }

  return (
    <>
      {/* Toggle Button - Only show when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-16 right-4 z-50 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}

      {/* Side Panel */}
      <div className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-80 bg-white shadow-xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {activeTab === 'legend' ? 'Graph Legend' : 'Node Details'}
            </h2>
            <button
              onClick={() => {
                setIsOpen(false)
                if (onClose) onClose()
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-4 border-b">
            <button
              onClick={() => setActiveTab('legend')}
              className={`px-4 py-2 font-medium ${activeTab === 'legend' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              Legend
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              disabled={!selectedNode}
            >
              Details
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'legend' && (
            <>
              {/* Node Colors */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Node Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    <span>Occupations (Jobs/Careers)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-600"></div>
                    <span>Skills</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-600"></div>
                    <span>Occupation Groups</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                    <span>Skill Groups</span>
                  </div>
                </div>
              </div>

              {/* Node Sizes */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Node Sizes</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-400"></div>
                    <span>Larger = More connections</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span>Smaller = Fewer connections</span>
                  </div>
                </div>
              </div>

              {/* Interactions */}
              <div>
                <h3 className="font-semibold mb-3">Interactions</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Scroll to zoom in/out</p>
                  <p>• Drag to pan around</p>
                  <p>• Click nodes to see details</p>
                </div>
              </div>
            </>
          )}

          {/* Node Details Tab */}
          {activeTab === 'details' && selectedNode && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedNode.label}</h3>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedNode.nodeType === 'occupation' ? 'bg-blue-100 text-blue-800' :
                  selectedNode.nodeType === 'skill' ? 'bg-red-100 text-red-800' :
                  selectedNode.nodeType === 'occupation_group' ? 'bg-green-100 text-green-800' :
                  selectedNode.nodeType === 'skill_group' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedNode.nodeType.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              {selectedNode.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 pt-4 border-t">
                <p>Connections: {selectedNode.degree || 0}</p>
                <p>ID: {selectedNode.id}</p>
              </div>
            </div>
          )}

          {activeTab === 'details' && !selectedNode && (
            <div className="text-center text-gray-500 py-8">
              <p>Click on a node to see its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => {
            setIsOpen(false)
            if (onClose) onClose()
          }}
        />
      )}
    </>
  )
}