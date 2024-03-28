import { TPacket } from "./machine";

export type LocalSend = TPacket;
export type RemoteSend = TPacket;
export type GameSummary = {
  context: {
    counter: number;
    players: { winning: undefined | boolean; uuid: string | undefined }[];
    exogenous: TPacket[];
  };
  state: string;
};
export type UpdatePacket =
  | { data: GameSummary; error: undefined }
  | { data: undefined; error: Error };

export type SessionSummary = {
  uuid: string;
  started: string;
};
export type UpdateSummaryPacket =
  | { data: SessionSummary; error: undefined }
  | { data: undefined; error: Error };
export type CreateSummaryPacket =
  | { data: { newId: string; existing: SessionSummary }; error: undefined }
  | { data: undefined; error: Error };
