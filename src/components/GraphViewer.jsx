// src/components/GraphViewer.jsx
import { useEffect, useRef, useState, useCallback } from "react"
import Sigma from "sigma"
import Graph from "graphology"
import { circular } from "graphology-layout"
import forceAtlas2 from "graphology-layout-forceatlas2"
import FA2Layout from "graphology-layout-forceatlas2/worker"
import { animateNodes } from "sigma/utils"

import { buildGraph } from "../lib/graph/buildGraph.js"
import LegendPanel from "./LegendPanel"
import LeftPanel from "./LeftPanel"

export default function GraphViewer({ focusNode, onDataLoad, onFocusComplete, onLayoutActionsReady }) {
  const containerRef = useRef(null)
  const sigmaRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [graphData, setGraphData] = useState(null)
  const [isGraphLoading, setIsGraphLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState({
    occupation: true,
    skill: true,
    occupation_group: true,
    skill_group: true
  })
  const [fa2Layout, setFa2Layout] = useState(null)
  const [isFA2Running, setIsFA2Running] = useState(false)
  const cancelCurrentAnimationRef = useRef(null)
  
  // State for interactions
  const [state, setState] = useState({
    hoveredNode: null,
    searchQuery: "",
    selectedNodeId: null,
    hoveredNeighbors: null
  })

  const stopFA2 = useCallback(() => {
    if (!fa2Layout) return
    fa2Layout.stop()
    setIsFA2Running(false)
  }, [fa2Layout])

  const startFA2 = useCallback(() => {
    if (!fa2Layout) return
    if (cancelCurrentAnimationRef.current) cancelCurrentAnimationRef.current()
    fa2Layout.start()
    setIsFA2Running(true)
  }, [fa2Layout])

  const toggleFA2Layout = useCallback(() => {
    if (!fa2Layout) return
    
    if (fa2Layout.isRunning()) {
      stopFA2()
    } else {
      startFA2()
    }
  }, [fa2Layout, stopFA2, startFA2])

  const randomLayout = useCallback(() => {
    if (!sigmaRef.current) return
    
    if (fa2Layout?.isRunning()) stopFA2()
    if (cancelCurrentAnimationRef.current) cancelCurrentAnimationRef.current()

    const graph = sigmaRef.current.getGraph()
    const randomPositions = {}
    
    graph.forEachNode((node) => {
      randomPositions[node] = {
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    })
    
    cancelCurrentAnimationRef.current = animateNodes(graph, randomPositions, { duration: 2000 })
  }, [fa2Layout, stopFA2])

  const circularLayout = useCallback(() => {
    if (!sigmaRef.current) return
    
    if (fa2Layout?.isRunning()) stopFA2()
    if (cancelCurrentAnimationRef.current) cancelCurrentAnimationRef.current()

    const graph = sigmaRef.current.getGraph()
    const circularPositions = circular(graph, { scale: 100 })
    
    cancelCurrentAnimationRef.current = animateNodes(graph, circularPositions, { 
      duration: 2000, 
      easing: "linear" 
    })
  }, [fa2Layout, stopFA2])

  // Set hovered node function
  const setHoveredNode = useCallback((node) => {
    if (node) {
      setState(prev => ({
        ...prev,
        hoveredNode: node,
        hoveredNeighbors: new Set(sigmaRef.current?.getGraph().neighbors(node) || [])
      }))
    } else {
      setState(prev => ({
        ...prev,
        hoveredNode: null,
        hoveredNeighbors: null
      }))
    }
    
    if (sigmaRef.current) {
      sigmaRef.current.refresh({ skipIndexation: true })
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function initGraph() {
      try {
        setIsGraphLoading(true)
        if (!containerRef.current || !isMounted) return

        // Kill existing renderer
        if (sigmaRef.current) {
          sigmaRef.current.kill()
          sigmaRef.current = null
        }

        const { nodes, edges } = await buildGraph()
        if (!isMounted) return
        
        // Store original data for node details
        const data = { nodes, edges }
        setGraphData(data)
        if (onDataLoad) onDataLoad(data)
        
        const graph = new Graph()
        
        // Filter nodes based on active filters
        const filteredNodes = nodes.filter(node => activeFilters[node.type])
        const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
        const filteredEdges = edges.filter(edge => 
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
        )

        // Add filtered nodes
        filteredNodes.forEach((node) => {
          const colors = {
            occupation: "#2563eb",
            skill: "#dc2626",
            occupation_group: "#059669",
            skill_group: "#7c3aed"
          }
          
          graph.addNode(node.id, {
            label: node.label,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 5,
            color: colors[node.type] || "#6b7280",
            nodeType: node.type
          })
        })
        
        // Add filtered edges
        filteredEdges.forEach((edge) => {
          if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
            graph.addEdge(edge.source, edge.target, {
              size: 1,
              color: "#999"
            })
          }
        })
        
        // Initialize FA2 layout
        const sensibleSettings = forceAtlas2.inferSettings(graph)
        const fa2 = new FA2Layout(graph, { settings: sensibleSettings })
        setFa2Layout(fa2)

        if (!isMounted) return

        // Create Sigma instance
        sigmaRef.current = new Sigma(graph, containerRef.current)
        
        // Set up node reducer for hover effects
        sigmaRef.current.setSetting("nodeReducer", (node, data) => {
          const res = { ...data }
          
          if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
            res.label = ""
            res.color = "#f6f6f6"
          }
          
          if (state.selectedNodeId === node) {
            res.highlighted = true
          }
          
          return res
        })
        
        // Set up edge reducer for hover effects
        sigmaRef.current.setSetting("edgeReducer", (edge, data) => {
          const res = { ...data }
          
          if (state.hoveredNode && 
              !graph.extremities(edge).every(n => 
                n === state.hoveredNode || graph.areNeighbors(n, state.hoveredNode)
              )) {
            res.hidden = true
          }
          
          return res
        })
        
        // Bind interactions
        sigmaRef.current.on("enterNode", ({ node }) => {
          setHoveredNode(node)
        })
        
        sigmaRef.current.on("leaveNode", () => {
          setHoveredNode(null)
        })
        
        sigmaRef.current.on('clickNode', (event) => {
          const nodeId = event.node
          const nodeData = graph.getNodeAttributes(nodeId)
          const originalNode = filteredNodes.find(n => n.id === nodeId)
          
          setState(prev => ({ ...prev, selectedNodeId: nodeId }))
          
          setSelectedNode({
            id: nodeId,
            label: nodeData.label,
            nodeType: nodeData.nodeType,
            description: originalNode?.description,
            degree: graph.degree(nodeId)
          })
        })
        
        setIsGraphLoading(false)
      } catch (error) {
        console.error('Graph error:', error)
        setIsGraphLoading(false)
      }
    }

    initGraph()

    return () => {
      isMounted = false
      if (fa2Layout) {
        fa2Layout.stop()
        setFa2Layout(null)
      }
      if (cancelCurrentAnimationRef.current) {
        cancelCurrentAnimationRef.current()
      }
      if (sigmaRef.current) {
        sigmaRef.current.kill()
        sigmaRef.current = null
      }
    }
  }, [activeFilters, setHoveredNode])

  // Expose layout actions when FA2 layout is ready
  useEffect(() => {
    if (fa2Layout && onLayoutActionsReady) {
      onLayoutActionsReady({
        toggleFA2: toggleFA2Layout,
        randomLayout,
        circularLayout,
        isFA2Running
      })
    }
  }, [fa2Layout, toggleFA2Layout, randomLayout, circularLayout, isFA2Running, onLayoutActionsReady])

  // Separate effect for focusing on nodes
  useEffect(() => {
    if (focusNode && !isGraphLoading) {
      // Small delay to ensure graph is fully rendered
      const timer = setTimeout(() => {
        const success = focusOnNode(focusNode.id)
        if (success) {
          console.log('Successfully focused on node:', focusNode.label)
        } else {
          console.log('Failed to focus on node:', focusNode.label, '- node may be filtered out')
        }
        if (onFocusComplete) onFocusComplete()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [focusNode, isGraphLoading, onFocusComplete])

  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
  }

  const handleNodeSelect = (node) => {
    setSelectedNode({
      id: node.id,
      label: node.label,
      nodeType: node.type,
      description: node.description,
      degree: 0
    })
  }

  const focusOnNode = (nodeId) => {
    if (sigmaRef.current && !isGraphLoading) {
      const graph = sigmaRef.current.getGraph()
      
      if (graph.hasNode(nodeId)) {
        const nodePosition = sigmaRef.current.getNodeDisplayData(nodeId)
        
        setState(prev => ({ ...prev, selectedNodeId: nodeId }))
        
        sigmaRef.current.getCamera().animate(nodePosition, {
          duration: 500
        })
        
        sigmaRef.current.refresh({ skipIndexation: true })
        return true
      }
    }
    return false
  }



  return (
    <div className="relative">
      <style>{`
        .sigma-labels text {
          fill: white !important;
          color: white !important;
          font-size: 12px !important;
        }
        .sigma-node-label {
          color: white !important;
        }
        .sigma-container text {
          fill: white !important;
          color: white !important;
        }
        svg text {
          fill: white !important;
        }
      `}</style>
      
      
      <LeftPanel 
        data={graphData}
        onFilterChange={handleFilterChange}
        onNodeSelect={handleNodeSelect}
      />
      <div 
        ref={containerRef} 
        className="absolute inset-0"
        style={{ height: "calc(100vh - 3rem)", width: "100vw", marginTop: "3rem" }} 
      >
        {isGraphLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E1B2E]">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-[#FFB703] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-r-[#9D4EDD] animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
            </div>
          </div>
        )}
      </div>
      <LegendPanel 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}
