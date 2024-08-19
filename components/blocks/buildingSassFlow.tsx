"use client";
import { useCallback, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
    Edge,
    EdgeChange,
    NodeChange,
    applyEdgeChanges,
    applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    data: { label: "Idea" },
    position: { x: 0, y: 0 },
    type: "input",
  },
  {
    id: "2",
    data: {
      label:
        "✨ Ask chatGPT to generate a typescript method that takes a JSON and convert it to a YUP schema",
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "Use this method to generate a YUP schema from a json" },
    position: { x: 100, y: 250 },
  },
  {
    id: "4",
    data: { label: "Integrate OpenAI SDK" },
    position: { x: 100, y: 350 },
  },
  {
    id: "5",
    data: {
      label:
        "✨ Make use of the AI to add validations to the schema based on the generated YUP schema and user input",
    },
    position: { x: 100, y: 400 },
  },
];

const initialEdges = [
  { id: "1-2", source: "1", target: "2", type: "smoothstep" },
  { id: "2-3", source: "2", target: "3", type: "smoothstep" },
  { id: "3-4", source: "3", target: "4", type: "smoothstep" },
  { id: "4-5", source: "4", target: "5", type: "smoothstep" },
];

export default function BuildingSaaSFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    []
  );
  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
