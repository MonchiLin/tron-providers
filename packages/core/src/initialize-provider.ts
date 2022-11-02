import type { Duplex } from "stream";

export type InitializeProviderParams = {
  connectStream: Duplex;
}

export function initializeProvider(params: InitializeProviderParams) {
  params.connectStream
}
