import type { TPacket } from "./machine";

export type LocalSend = TPacket;
export type RemoteSend = TPacket;
export type GameSummary = {
  context: {
    counter: number;
    players: { winning?: boolean; uuid?: string; location?: string }[];
    exogenous: TPacket[];
  };
  state: string;
};
export type UpdatePacket =
  | { data: GameSummary; error: undefined }
  | { data: undefined; error: Error };
