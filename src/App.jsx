import { useState } from 'react'
import GraphViewer from "./components/GraphViewer"
import BrowseView from "./components/BrowseView"
import SearchBar from "./components/SearchBar"

function App() {
  const [activeView, setActiveView] = useState('graph')
  const [focusNode, setFocusNode] = useState(null)
  const [graphData, setGraphData] = useState(null)

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-white border-b shadow-sm z-50">
        <div className="flex justify-center">
          <button
            onClick={() => setActiveView('graph')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeView === 'graph' 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Graph
          </button>
          <button
            onClick={() => setActiveView('browse')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeView === 'browse' 
                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                : 'border-transparent text-gray-600 hover:text-gray-900'
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
  );
}

export default App;
