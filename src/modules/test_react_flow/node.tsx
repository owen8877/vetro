import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

import './text-updater-node.css';

const handleStyle = { left: 10 };

export function TextUpdaterNode({ data }) {
	const onChange = useCallback((evt) => {
		console.log(evt.target.value);
	}, []);

	const label = data.label;
	const p1 = data['0'];
	const p2 = data['1'];

	return (
		<div className="text-updater-node">
			<Handle type="target" position={Position.Top} style={{ left: 40 }} id="top-target" />
			<Handle type="source" position={Position.Top} style={{ left: 60 }} id="top-source" />
			<Handle type="target" position={Position.Left} style={{ top: 40 }} id="left-target" />
			<Handle type="source" position={Position.Left} style={{ top: 60 }} id="left-source" />
			<div>
				<label htmlFor="text">{label}</label>
				<label htmlFor="text">
					{p1?.ishere && `${p1.uuid?.slice(0, 4)} is here`}
				</label>
				<label htmlFor="text">
					{p2?.ishere && `${p2.uuid?.slice(0, 4)} is here`}
				</label>
			</div>
			<Handle type="target" position={Position.Bottom} style={{ left: 40 }} id="bottom-target" />
			<Handle type="source" position={Position.Bottom} style={{ left: 60 }} id="bottom-source" />
			<Handle type="target" position={Position.Right} style={{ top: 40 }} id="right-target" />
			<Handle type="source" position={Position.Right} style={{ top: 60 }} id="right-source" />
		</div>
	);
}