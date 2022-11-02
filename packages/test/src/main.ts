import { InPageProvider, Port, PortMessageStream } from "@monchilin/tron-providers-core";

class WindowPort implements Port {
  source: string;

  constructor({ source }: { source: string }) {
    this.source = source;
  }

  addListener(listener: (event: MessageEvent) => void): void {
    window.addEventListener("message", listener);
  }

  postMessage(message: any, targetOrigin: string): void {
    window.postMessage(message, targetOrigin);
  }

  removeListener(listener: (event: MessageEvent) => void): void {
    window.removeEventListener("message", listener);
  }

}

const provider = new InPageProvider({
  portMessageStream: new PortMessageStream(new WindowPort({ source: "pageHook" }))
});

setTimeout(() => {
  window.p = provider;
  provider.defaultAddress;
}, 1000);
