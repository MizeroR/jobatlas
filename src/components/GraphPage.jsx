// src/App.jsx
import { useState } from 'react'
import GraphViewer from "./GraphViewer"
import BrowseView from "./BrowseView"
import SearchBar from "./SearchBar"

function App() {
  const [activeView, setActiveView] = useState('graph')
  const [focusNode, setFocusNode] = useState(null)
  const [graphData, setGraphData] = useState(null)

  return (
    <div className="h-screen flex flex-col bg-[#1E1B2E]">
      <nav className="bg-[#2A2438] border-b border-[#9D4EDD]/20 shadow-sm z-50">
        <div className="flex justify-center">
          <button
            onClick={() => setActiveView('graph')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeView === 'graph' 
                ? 'border-[#FFB703] text-[#FFB703] bg-[#FFB703]/10' 
                : 'border-transparent text-[#E9ECEF] hover:text-[#FFB703]'
            }`}
          >
            Graph
          </button>
          <button
            onClick={() => setActiveView('browse')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeView === 'browse' 
                ? 'border-[#FFB703] text-[#FFB703] bg-[#FFB703]/10' 
                : 'border-transparent text-[#E9ECEF] hover:text-[#FFB703]'
            }`}
          >
            Browse
          </button>
        </div>
      </nav>
      
      {activeView === 'graph' && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40">
          <SearchBar 
            data={graphData} 
            onNodeSelect={(node) => {
              setFocusNode(node)
              setActiveView('graph')
            }} 
          />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        {activeView === 'graph' ? (
          <GraphViewer 
            focusNode={focusNode} 
            onDataLoad={setGraphData}
            onFocusComplete={() => setFocusNode(null)}
          />
        ) : (
          <BrowseView />
        )}
      </div>
    </div>
  )
}

export default App
