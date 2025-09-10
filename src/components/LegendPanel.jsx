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
          className="fixed top-16 right-4 z-50 bg-[#2A2438] shadow-lg rounded-lg p-3 hover:bg-[#9D4EDD]/20 text-[#E9ECEF]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}

      {/* Side Panel */}
      <div className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-80 bg-[#2A2438] shadow-xl transform transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#E9ECEF]">
              {activeTab === 'legend' ? 'Graph Legend' : 'Node Details'}
            </h2>
            <button
              onClick={() => {
                setIsOpen(false)
                if (onClose) onClose()
              }}
              className="text-[#E9ECEF]/60 hover:text-[#FFB703]"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-4 border-b border-[#9D4EDD]/20">
            <button
              onClick={() => setActiveTab('legend')}
              className={`px-4 py-2 font-medium ${activeTab === 'legend' ? 'border-b-2 border-[#FFB703] text-[#FFB703]' : 'text-[#E9ECEF]/60'}`}
            >
              Legend
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'border-b-2 border-[#FFB703] text-[#FFB703]' : 'text-[#E9ECEF]/60'}`}
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
                <h3 className="font-semibold mb-3 text-[#E9ECEF]">Node Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#2563eb]"></div>
                    <span className="text-[#E9ECEF]/80">Occupations (Jobs/Careers)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#dc2626]"></div>
                    <span className="text-[#E9ECEF]/80">Skills</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#059669]"></div>
                    <span className="text-[#E9ECEF]/80">Occupation Groups</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#7c3aed]"></div>
                    <span className="text-[#E9ECEF]/80">Skill Groups</span>
                  </div>
                </div>
              </div>

              {/* Interactions */}
              <div>
                <h3 className="font-semibold mb-3 text-[#E9ECEF]">Interactions</h3>
                <div className="space-y-2 text-sm text-[#E9ECEF]/60">
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
                <h3 className="font-semibold text-lg mb-2 text-[#E9ECEF]">{selectedNode.label}</h3>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedNode.nodeType === 'occupation' ? 'bg-[#4CC9F0]/20 text-[#4CC9F0]' :
                  selectedNode.nodeType === 'skill' ? 'bg-[#FFB703]/20 text-[#FFB703]' :
                  selectedNode.nodeType === 'occupation_group' ? 'bg-[#9D4EDD]/20 text-[#9D4EDD]' :
                  selectedNode.nodeType === 'skill_group' ? 'bg-[#4CC9F0]/20 text-[#4CC9F0]' :
                  'bg-[#E9ECEF]/20 text-[#E9ECEF]'
                }`}>
                  {selectedNode.nodeType.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              {selectedNode.description && (
                <div>
                  <h4 className="font-medium mb-2 text-[#E9ECEF]">Description</h4>
                  <div className="max-h-64 overflow-y-auto">
                    <p className="text-sm text-[#E9ECEF]/80 leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && !selectedNode && (
            <div className="text-center text-[#E9ECEF]/60 py-8">
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