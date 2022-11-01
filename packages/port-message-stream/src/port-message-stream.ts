import EventEmitter from "eventemitter3";
import { Duplex } from "readable-stream";

export interface Port {
  postMessage: (message: any, targetOrigin: string) => void;
  addMessageListener: (listener: (event: MessageEvent) => void) => void;
  removeMessageListener: (listener: (event: MessageEvent) => void) => void;
  origin?: string;
  // inpage
  name: string;
  // contentscript
  target: string;
}

export class PostMessageStream extends Duplex {
  protected eventEmitter: EventEmitter;
  protected _port: Port;

  constructor(port: Port) {
    super({ objectMode: true });
    this.eventEmitter = new EventEmitter();
    this._port = port;
    this._port.addMessageListener(this._onMessage.bind(this));
  }

  get origin() {
    return this._port.origin ?? "*";
  }

  _onMessage(event: MessageEvent): void {
    const msg = event.data;

    if (this.origin !== '*' && event.origin !== this.origin) {
      return;
    }
    if (!msg || typeof msg !== 'object') {
      return;
    }
    if (msg.target !== this._port.name) {
      return;
    }
    if (!msg.data) {
      return;
    }
  }

  _read(): void {

  }

  _write(data: any, _encoding: any, cb: () => void): void {
    const message = {
      target: this._port.target,
      data,
    };
    this._port.postMessage(message, this.origin);
    cb();
  }

}
