// src/App.jsx
import { useState } from 'react'
import GraphViewer from "./GraphViewer"
import BrowseView from "./BrowseView"
import SearchBar from "./SearchBar"

function App() {
  const [activeView, setActiveView] = useState('graph')
  const [focusNode, setFocusNode] = useState(null)
  const [graphData, setGraphData] = useState(null)
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [layoutActions, setLayoutActions] = useState(null)
  const [isFA2Running, setIsFA2Running] = useState(false)

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
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 flex gap-2 items-center">
          <SearchBar 
            data={graphData} 
            onNodeSelect={(node) => {
              setFocusNode(node)
              setActiveView('graph')
            }} 
          />
          <div className="relative">
            <button
              onClick={() => setShowLayoutMenu(!showLayoutMenu)}
              className="px-4 py-2 bg-[#2A2438] text-[#E9ECEF] border border-[#9D4EDD]/20 rounded-lg hover:bg-[#9D4EDD]/10 transition flex items-center gap-2"
            >
              Layout
              <svg className={`w-4 h-4 transition-transform ${showLayoutMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLayoutMenu && (
              <div className="absolute top-full mt-1 right-0 bg-[#2A2438] border border-[#9D4EDD]/20 rounded-lg shadow-lg min-w-[120px] z-50">
                <button
                  onClick={() => {
                    if (layoutActions?.toggleFA2) {
                      layoutActions.toggleFA2()
                      setIsFA2Running(!isFA2Running)
                    }
                    setShowLayoutMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-[#E9ECEF] hover:bg-[#FFB703]/10 hover:text-[#FFB703] transition first:rounded-t-lg"
                >
                  {isFA2Running ? 'Stop FA2' : 'Start FA2'}
                </button>
                <button
                  onClick={() => {
                    layoutActions?.randomLayout()
                    setShowLayoutMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-[#E9ECEF] hover:bg-[#9D4EDD]/10 hover:text-[#9D4EDD] transition"
                >
                  Random
                </button>
                <button
                  onClick={() => {
                    layoutActions?.circularLayout()
                    setShowLayoutMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-[#E9ECEF] hover:bg-[#059669]/10 hover:text-[#059669] transition last:rounded-b-lg"
                >
                  Circular
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        {activeView === 'graph' ? (
          <GraphViewer 
            focusNode={focusNode} 
            onDataLoad={setGraphData}
            onFocusComplete={() => setFocusNode(null)}
            onLayoutActionsReady={(actions) => {
              setLayoutActions(actions)
              setIsFA2Running(actions.isFA2Running)
            }}
          />
        ) : (
          <BrowseView />
        )}
      </div>
    </div>
  )
}

export default App
