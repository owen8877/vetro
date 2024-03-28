import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

import { is_production } from "../../util";
import { useAppDispatch, useAppSelector } from '../../client/store';
import type { UpdatePacket, CreateSummaryPacket, SessionSummary } from './types';
import {
  remoteStoneSummaryActions as _A,
  remoteStoneSummarySelectors as _S,
} from './summary_state';

// Socket.io & Websocket related
// "undefined" means the URL will be computed from the `window.location` object
const URL = `${is_production ? "" : import.meta.env.VITE_WS_PATH}/test_remote_stone_summary`;
const socket = io(URL, { autoConnect: false });

const SessionPreviewer = ({ session, lastCreated }: { session: SessionSummary, lastCreated?: string }) => {
  const { uuid, started } = session;
  const isLastCreated = lastCreated === uuid;
  return (
    <>
      <p>Created: {started}</p>
      <a href={`/test_remote_stone_session/${uuid}`}>Goto game!</a>
      {isLastCreated && <span> (last created)</span>}
    </>
  );
}

export default function TestRemoteStoneSummary() {
  const dispatch = useAppDispatch();
  const [lastCreated, setLastCreated] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onConnect = () => dispatch(_A.updateServerConnected(true));
    const onDisconnect = () => dispatch(_A.updateServerConnected(false));
    const onSummaryUpdate = ({ data, error }: UpdatePacket) => {
      console.log('1', data, error);
      if (data === undefined) {
        console.error(error);
        return;
      }
      dispatch(_A.updateSessionSummaries({ sessionSummaries: data, lastUpdated: Date.now() }));
    };
    const onSummaryReturn = ({ data, error }: CreateSummaryPacket) => {
      console.log(data, error);

      if (data === undefined) {
        console.error(error);
        return;
      }
      const { newId, existing } = data;
      dispatch(_A.updateSessionSummaries({ sessionSummaries: existing, lastUpdated: Date.now() }));
      setLastCreated(newId);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('summary.update', onSummaryUpdate);
    socket.on('summary.return', onSummaryReturn);
    socket.connect();
    socket.emit('summary.list');

    // const interval = setInterval(() => {
    //   socket.emit('game.request');
    // }, 3000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game.sync', onSummaryUpdate);
      socket.off('game.update', onSummaryReturn);
      socket.disconnect();
      // clearInterval(interval);
    };
  }, [dispatch]);

  const connected = useAppSelector(_S.selectServerConnected);
  const summaries = useAppSelector(_S.selectSessionSummaries);

  return (
    <>
      <h1>Test Remote Stone Summary</h1>
      <p>Connected: {JSON.stringify(connected)}</p>
      <button type='button' onClick={() => socket.emit('summary.create')}>Create new session</button>
      <p>Summaries:{JSON.stringify(summaries)}, Lastcreated: {lastCreated}</p>
      <ul>
        {summaries?.map((s) => (
          <li key={s.uuid}>
            <SessionPreviewer session={s} lastCreated={lastCreated} />
          </li>
        ))}
      </ul>
    </>
  )
};