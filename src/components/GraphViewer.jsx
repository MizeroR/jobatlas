// src/components/GraphViewer.jsx
import { useEffect, useRef, useState } from "react"
import { Sigma } from "sigma"
import Graph from "graphology"
import forceAtlas2 from "graphology-layout-forceatlas2"

import { buildGraph } from "../lib/graph/buildGraph.js"
import LegendPanel from "./LegendPanel"
import LeftPanel from "./LeftPanel"

export default function GraphViewer() {
  const containerRef = useRef(null)
  const sigmaRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [graphData, setGraphData] = useState(null)
  const [activeFilters, setActiveFilters] = useState({
    occupation: true,
    skill: true,
    occupation_group: true,
    skill_group: true
  })

  useEffect(() => {
    let isMounted = true

    async function initGraph() {
      try {
        if (!containerRef.current || !isMounted) return

        // Kill existing renderer
        if (sigmaRef.current) {
          sigmaRef.current.kill()
          sigmaRef.current = null
        }

        const { nodes, edges } = await buildGraph()
        if (!isMounted) return
        
        // Store original data for node details
        setGraphData({ nodes, edges })
        
        const graph = new Graph()
        
        // Filter nodes based on active filters
        const filteredNodes = nodes.filter(node => activeFilters[node.type])
        const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
        const filteredEdges = edges.filter(edge => 
          filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
        )

        // Add filtered nodes with initial random positions
        filteredNodes.forEach((node) => {
          graph.addNode(node.id, {
            label: node.label,
            x: Math.random() * 100,
            y: Math.random() * 100,
            nodeType: node.type
          })
        })

        // Add filtered edges
        filteredEdges.forEach((edge) => {
          if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
            graph.addEdge(edge.source, edge.target, {
              color: "rgba(128, 128, 128, 0.3)",
              size: 0.5
            })
          }
        })
        // Apply ForceAtlas2 layout
        forceAtlas2.assign(graph, {
          iterations: 100,
          settings: {
            gravity: 1,
            scalingRatio: 10,
            strongGravityMode: false,
            slowDown: 1
          }
        })
        // Style nodes based on degree and type
        graph.forEachNode((node, attributes) => {
          const nodeDegree = graph.degree(node)
          const nodeType = attributes.nodeType
          
          graph.setNodeAttribute(node, "size", Math.max(3, Math.min(15, nodeDegree * 0.8)))
          
          // Improved color scheme
          const colors = {
            occupation: "#2563eb",      // Blue
            skill: "#dc2626",           // Red  
            occupation_group: "#059669", // Green
            skill_group: "#7c3aed"      // Purple
          }
          
          graph.setNodeAttribute(node, "color", 
            colors[nodeType] || "#6b7280"
          )
        })

        if (!isMounted) return

        sigmaRef.current = new Sigma(graph, containerRef.current, {
          allowInvalidContainer: true
        })
        
        // Add click event listener
        sigmaRef.current.on('clickNode', (event) => {
          const nodeId = event.node
          const nodeData = graph.getNodeAttributes(nodeId)
          const originalNode = filteredNodes.find(n => n.id === nodeId)
          
          setSelectedNode({
            id: nodeId,
            label: nodeData.label,
            nodeType: nodeData.nodeType,
            description: originalNode?.description,
            degree: graph.degree(nodeId)
          })
        })
      } catch (error) {
        console.error('Graph error:', error)
      }
    }

    initGraph()

    return () => {
      isMounted = false
      if (sigmaRef.current) {
        sigmaRef.current.kill()
        sigmaRef.current = null
      }
    }
  }, [activeFilters])

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

  return (
    <div className="relative">
      <LeftPanel 
        data={graphData}
        onFilterChange={handleFilterChange}
        onNodeSelect={handleNodeSelect}
      />
      <div 
        ref={containerRef} 
        className="absolute inset-0"
        style={{ height: "100vh", width: "100vw" }} 
      />
      <LegendPanel 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}
