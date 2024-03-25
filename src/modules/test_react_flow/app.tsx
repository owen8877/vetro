import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, { applyEdgeChanges, applyNodeChanges, Background, BackgroundVariant, Controls, MiniMap, addEdge, useEdgesState, useNodesState, type NodeChange, type EdgeChange, type Connection, type Edge, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

import { useAppSelector } from '../../client/store';
import { reactFlowSelectors as _S, reactFlowActions as _A } from './state';
import { Player } from './player';

import { TextUpdaterNode } from './node';
import { set } from 'lodash';

const initialNodes = [
	{
		id: '1',
		type: 'textUpdater',
		data: { label: '1' },
		position: { x: 71, y: 283 },
	},
	{
		id: '2',
		type: 'textUpdater',
		data: { label: '2' },
		position: { x: 126, y: 117 },
	},
	{
		id: '3',
		type: 'textUpdater',
		data: { label: '3' },
		position: { x: 311, y: 125 },
	},
	{
		id: '4',
		type: 'textUpdater',
		data: { label: '4' },
		position: { x: 362, y: 284 },
	},
	{
		id: '5',
		type: 'textUpdater',
		data: { label: '5' },
		position: { x: 212, y: 426 },
	},
];

const initialEdges = [
	{ source: "2", sourceHandle: "right-source", target: "3", targetHandle: "left-target", id: "reactflow__edge-2right-source-3left-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "5", sourceHandle: "left-source", target: "1", targetHandle: "bottom-target", id: "reactflow__edge-5left-source-1bottom-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "4", sourceHandle: "left-source", target: "2", targetHandle: "right-target", id: "reactflow__edge-4left-source-2right-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "1", sourceHandle: "right-source", target: "3", targetHandle: "bottom-target", id: "reactflow__edge-1right-source-3bottom-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "1", sourceHandle: "bottom-source", target: "5", targetHandle: "top-target", id: "reactflow__edge-1bottom-source-5top-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "2", sourceHandle: "bottom-source", target: "1", targetHandle: "left-target", id: "reactflow__edge-2bottom-source-1left-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "4", sourceHandle: "bottom-source", target: "1", targetHandle: "right-target", id: "reactflow__edge-4bottom-source-1right-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "3", sourceHandle: "bottom-source", target: "4", targetHandle: "top-target", id: "reactflow__edge-3bottom-source-4top-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "5", sourceHandle: "top-source", target: "4", targetHandle: "left-target", id: "reactflow__edge-5top-source-4left-target", markerEnd: { type: MarkerType.ArrowClosed } },
	{ source: "5", sourceHandle: "right-source", target: "3", targetHandle: "bottom-target", id: "reactflow__edge-5right-source-3bottom-target", markerEnd: { type: MarkerType.ArrowClosed } }
];

export default function App() {
	// Flow related
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[],
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[],
	);

	const onConnect = useCallback(
		(params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
		[],
	);

	// FSM related
	const serverInfo = useAppSelector(_S.selectServerInfo);
	const myUUID = useAppSelector(_S.selectMyUUID);
	const gameState = useAppSelector(_S.selectGameState);
	const gameContext = useAppSelector(_S.selectGameContext);
	const players = useAppSelector(_S.selectPlayers);
	const playerSlots = useAppSelector(_S.selectPlayerSlots);
	const exogenous = useAppSelector(_S.selectArxivExogenous);
	const isReplaying = useAppSelector(_S.selectArxivReplaying);

	useEffect(() => {
		for (const node of nodes) {
			for (const player of players) {
				const { uuid, slot, location } = player.context;
				const new_obj = {};
				new_obj[slot] = { uuid, ishere: location === node.id };
				node.data = { ...node.data, ...new_obj }
			}
		};
		setNodes([...nodes]);
	}, [nodes, players]);

	const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

	return (
		<>
			{isReplaying && <div>ちょっとまって</div>}
			{<ul>
				{playerSlots.map((slot) => (
					<li key={slot}>
						<Player slot={slot} nodes={nodes} edges={edges} />
					</li>
				))}
			</ul>}
			<div style={{ width: '60vw', height: '75vh' }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
				>
					<Controls />
					<MiniMap />
					<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
				</ReactFlow>
				<div>
					<h3>Node dump:</h3>
					<p>{JSON.stringify(nodes)}</p>
				</div>
				<div>
					<h3>Edge dump:</h3>
					<p>{JSON.stringify(edges)}</p>
				</div>
			</div>
		</>
	)
}
