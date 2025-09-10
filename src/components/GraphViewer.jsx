// src/components/GraphViewer.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Sigma } from 'sigma';
import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import FA2Layout from 'graphology-layout-forceatlas2/worker';
import { animateNodes } from 'sigma/utils';

import { buildGraph } from '../lib/graph/buildGraph.js';
import LegendPanel from './LegendPanel';
import LeftPanel from './LeftPanel';

export default function GraphViewer({
  focusNode,
  onDataLoad,
  onFocusComplete,
  onLayoutAction,
}) {
  const containerRef = useRef(null);
  const sigmaRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [isGraphLoading, setIsGraphLoading] = useState(true);
  const [highlightedNode, setHighlightedNode] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    occupation: true,
    skill: true,
    occupation_group: true,
    skill_group: true,
  });
  const [fa2Layout, setFa2Layout] = useState(null);
  const [isFA2Running, setIsFA2Running] = useState(false);
  const cancelAnimationRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initGraph() {
      try {
        setIsGraphLoading(true);
        if (!containerRef.current || !isMounted) return;

        // Kill existing renderer
        if (sigmaRef.current) {
          sigmaRef.current.kill();
          sigmaRef.current = null;
        }

        const { nodes, edges } = await buildGraph();
        if (!isMounted) return;

        // Store original data for node details
        const data = { nodes, edges };
        setGraphData(data);
        if (onDataLoad) onDataLoad(data);

        const graph = new Graph();

        // Filter nodes based on active filters
        const filteredNodes = nodes.filter((node) => activeFilters[node.type]);
        const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
        const filteredEdges = edges.filter(
          (edge) =>
            filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
        );

        // Add filtered nodes with initial random positions
        filteredNodes.forEach((node) => {
          graph.addNode(node.id, {
            label: node.label,
            x: Math.random() * 100,
            y: Math.random() * 100,
            nodeType: node.type,
          });
        });

        // Add filtered edges
        filteredEdges.forEach((edge) => {
          graph.addEdge(edge.source, edge.target);
        });

        // Apply initial ForceAtlas2 layout
        forceAtlas2.assign(graph, {
          iterations: 100,
          settings: {
            gravity: 1,
            scalingRatio: 10,
            strongGravityMode: false,
            slowDown: 1,
          },
        });

        // Setup FA2 worker
        const sensibleSettings = forceAtlas2.inferSettings(graph);
        const fa2Worker = new FA2Layout(graph, { settings: sensibleSettings });
        setFa2Layout(fa2Worker);

        // Style nodes based on degree and type
        graph.forEachNode((node, attributes) => {
          const nodeDegree = graph.degree(node);
          const nodeType = attributes.nodeType;

          graph.setNodeAttribute(
            node,
            'size',
            Math.max(3, Math.min(15, nodeDegree * 0.8))
          );

          // Improved color scheme
          const colors = {
            occupation: '#2563eb', // Blue
            skill: '#dc2626', // Red
            occupation_group: '#059669', // Green
            skill_group: '#7c3aed', // Purple
          };

          graph.setNodeAttribute(node, 'color', colors[nodeType] || '#6b7280');

          // Store original color for highlighting
          graph.setNodeAttribute(
            node,
            'originalColor',
            colors[nodeType] || '#6b7280'
          );
        });

        if (!isMounted) return;

        sigmaRef.current = new Sigma(graph, containerRef.current, {
          allowInvalidContainer: true,
          renderEdges: true,
          defaultEdgeColor: '#000',
          edgeLabelSize: 'proportional',
          defaultEdgeType: 'line',
          minCameraRatio: 0.08,
          maxCameraRatio: 3,
          labelRenderedSizeThreshold: 15,
        });

        // Add click event listener
        sigmaRef.current.on('clickNode', (event) => {
          const nodeId = event.node;
          const nodeData = graph.getNodeAttributes(nodeId);
          const originalNode = filteredNodes.find((n) => n.id === nodeId);

          setSelectedNode({
            id: nodeId,
            label: nodeData.label,
            nodeType: nodeData.nodeType,
            description: originalNode?.description,
            degree: graph.degree(nodeId),
          });
        });

        setIsGraphLoading(false);
      } catch (error) {
        console.error('Graph error:', error);
        setIsGraphLoading(false);
      }
    }

    initGraph();

    return () => {
      isMounted = false;
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
    };
  }, [activeFilters, onDataLoad]);

  const focusOnNode = useCallback(
    (nodeId) => {
      if (sigmaRef.current && !isGraphLoading) {
        const graph = sigmaRef.current.getGraph();

        if (graph.hasNode(nodeId)) {
          const nodeAttributes = graph.getNodeAttributes(nodeId);

          // Clear previous highlight
          if (highlightedNode && graph.hasNode(highlightedNode)) {
            const prevOriginalColor = graph.getNodeAttribute(
              highlightedNode,
              'originalColor'
            );
            graph.setNodeAttribute(highlightedNode, 'color', prevOriginalColor);
            graph.setNodeAttribute(
              highlightedNode,
              'size',
              graph.getNodeAttribute(highlightedNode, 'size')
            );
          }

          // Highlight the focused node
          graph.setNodeAttribute(nodeId, 'color', '#ff6b35'); // Bright orange
          graph.setNodeAttribute(
            nodeId,
            'size',
            Math.max(20, nodeAttributes.size * 2)
          ); // Make it bigger
          setHighlightedNode(nodeId);

          // Move camera to node with big zoom
          sigmaRef.current.getCamera().goTo({
            x: nodeAttributes.x,
            y: nodeAttributes.y,
            ratio: 0.01,
          });

          console.log('Focused and highlighted node:', nodeAttributes.label);
          return true;
        } else {
          console.log('Node', nodeId, 'not found in current graph');
        }
      }
      return false;
    },
    [highlightedNode, isGraphLoading]
  );

  // Separate effect for focusing on nodes
  useEffect(() => {
    if (focusNode && !isGraphLoading) {
      const timer = setTimeout(() => {
        const didFocus = focusOnNode(focusNode.id);
        if (didFocus) {
          console.log('Successfully focused on node:', focusNode.label);
        } else {
          console.log(
            'Failed to focus on node:',
            focusNode.label,
            '- node may be filtered out'
          );
        }
        if (onFocusComplete) onFocusComplete();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [focusNode, isGraphLoading, onFocusComplete, focusOnNode]);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode({
      id: node.id,
      label: node.label,
      nodeType: node.type,
      description: node.description,
      degree: 0,
    });
  };

  const handleZoomIn = () => {
    if (sigmaRef.current) {
      sigmaRef.current.getCamera().animatedZoom({ duration: 600 });
    }
  };

  const handleZoomOut = () => {
    if (sigmaRef.current) {
      sigmaRef.current.getCamera().animatedUnzoom({ duration: 600 });
    }
  };

  const handleZoomReset = () => {
    if (sigmaRef.current) {
      sigmaRef.current.getCamera().animatedReset({ duration: 600 });
    }
  };

  // --- Layout functions wrapped in useCallback ---
  const toggleFA2 = useCallback(() => {
    if (!fa2Layout) return;
    if (cancelAnimationRef.current) cancelAnimationRef.current();

    if (fa2Layout.isRunning()) {
      fa2Layout.stop();
      setIsFA2Running(false);
    } else {
      fa2Layout.start();
      setIsFA2Running(true);
    }
  }, [fa2Layout]);

  const randomLayout = useCallback(() => {
    if (!sigmaRef.current) return;
    if (fa2Layout?.isRunning()) {
      fa2Layout.stop();
      setIsFA2Running(false);
    }
    if (cancelAnimationRef.current) cancelAnimationRef.current();

    const graph = sigmaRef.current.getGraph();
    const randomPositions = {};
    graph.forEachNode((node) => {
      randomPositions[node] = {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      };
    });
    cancelAnimationRef.current = animateNodes(graph, randomPositions, {
      duration: 2000,
    });
  }, [fa2Layout]);

  const circularLayout = useCallback(() => {
    if (!sigmaRef.current) return;
    if (fa2Layout?.isRunning()) {
      fa2Layout.stop();
      setIsFA2Running(false);
    }
    if (cancelAnimationRef.current) cancelAnimationRef.current();

    const graph = sigmaRef.current.getGraph();
    const nodes = graph.nodes();
    const circularPositions = {};
    const radius = 100;

    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      circularPositions[node] = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      };
    });

    cancelAnimationRef.current = animateNodes(graph, circularPositions, {
      duration: 2000,
      easing: 'linear',
    });
  }, [fa2Layout]);

  // Expose layout actions to parent
  useEffect(() => {
    if (onLayoutAction) {
      onLayoutAction({
        toggleFA2,
        randomLayout,
        circularLayout,
      });
    }
  }, [onLayoutAction, toggleFA2, randomLayout, circularLayout]);

  return (
    <div className="relative">
      <LeftPanel
        data={graphData}
        onFilterChange={handleFilterChange}
        onNodeSelect={handleNodeSelect}
      />

      {/* Zoom Controls */}
      <div className="absolute top-20 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-lg font-bold"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-lg font-bold"
        >
          −
        </button>
        <button
          onClick={handleZoomReset}
          className="w-10 h-10 bg-white border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center justify-center text-xs"
        >
          ⌂
        </button>

        {/* Start/Stop FA2 button */}
        <button
          onClick={toggleFA2}
          className="px-3 py-1 mt-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm"
        >
          {isFA2Running ? 'Stop FA2' : 'Start FA2'}
        </button>
      </div>

      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          height: 'calc(100vh - 3rem)',
          width: '100vw',
          marginTop: '3rem',
        }}
      >
        {isGraphLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent animate-spin"></div>
              <div
                className="absolute inset-0 w-12 h-12 border-2 border-transparent border-r-blue-300 animate-spin"
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1s',
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <LegendPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
