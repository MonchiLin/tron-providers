import type * as Stream from "stream";

export type InitializeProviderParams = {
  connectStream: Stream;
}

export function initializeProvider(params: InitializeProviderParams) {
  params.connectStream
}
