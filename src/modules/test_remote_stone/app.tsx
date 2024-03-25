import { format } from 'date-fns';

import { useAppSelector } from '../../client/store';
import { remoteStoneSelectors as _S, remoteStoneActions as _A } from './state';
import { Player } from './player';

export default function App() {
	const serverInfo = useAppSelector(_S.selectServerInfo);
	const myUUID = useAppSelector(_S.selectMyUUID);
	const gameState = useAppSelector(_S.selectGameState);
	const gameContext = useAppSelector(_S.selectGameContext);
	const playerSlots = useAppSelector(_S.selectPlayerSlots);
	const exogenous = useAppSelector(_S.selectArxivExogenous);

	return (
		<>
			<p>debug: gameCounter={gameContext?.remaining}, gameState={JSON.stringify(gameState)}, myUUID={myUUID}</p>
			{<ul>
				{playerSlots.map((slot) => (
					<li key={slot}>
						<Player slot={slot} />
					</li>
				))}
			</ul>}
			<h3>Server side:</h3>
			<p>Last update: {serverInfo && format(new Date(serverInfo.lastUpdateTime), 'dd/MM/yyyy HH:mm:ss')}</p>
			<p>{serverInfo && JSON.stringify(serverInfo?.summary)}</p>
			<p>Local exogenous={JSON.stringify(exogenous)}, </p>
		</>
	)
}
