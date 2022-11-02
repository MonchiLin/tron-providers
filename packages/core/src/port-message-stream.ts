import EventEmitter from "eventemitter3";
import { Duplex } from "readable-stream";

export interface Port {
  postMessage: (message: any, targetOrigin: string) => void;
  addListener: (listener: (event: MessageEvent) => void) => void;
  removeListener: (listener: (event: MessageEvent) => void) => void;
  origin?: string;
  // pageHook
  source: string;
}


export namespace HostingMessageNS {

  export interface Headers {
    "TRON-PRO-API-Key": string;
  }

  export interface ConnectChain {
    fullNode: string;
    solidityNode: string;
    eventServer: string;
    mainGateway: string;
    sideGateway: string;
    chainId: string;
  }

  export interface Node {
    name: string;
    formatName: string;
    fullNode: string;
    solidityNode: string;
    eventServer: string;
    default: boolean;
    chain: string;
    connect: string;
    chainType: number;
    netType: number;
    headers: Headers;
    connectChain: ConnectChain;
    hostname: string;
    freezeUrl: string;
    multiSignUrl: string;
    accountUrl: string;
    voteUrl: string;
  }

  export interface ConnectChain2 {
    fullNode: string;
    solidityNode: string;
    eventServer: string;
  }

  export interface ConnectNode {
    name: string;
    formatName: string;
    fullNode: string;
    solidityNode: string;
    eventServer: string;
    default: boolean;
    chain: string;
    connect: string;
    chainType: number;
    netType: number;
    mainGateway: string;
    sideGateway: string;
    sideChainId: string;
    connectChain: ConnectChain2;
    hostname: string;
    freezeUrl: string;
    multiSignUrl: string;
    accountUrl: string;
    voteUrl: string;
  }

  export interface PhishingList {
    url: string;
    isVisit: boolean;
  }

  export interface Data2 {
    address: string;
    node: Node;
    connectNode: ConnectNode;
    name: string;
    type: number;
    isAuth: boolean;
    phishingList: PhishingList[];
  }

  export interface Data {
    success: boolean;
    data: Data2;
    uuid: string;
    action: "request"
  }

  export type Message = {
    action: "tunnel" | "tabReply";
    data: Data;
  }

  export interface HostingMessage {
    message: Message;
    source: string;
    isTronLink: boolean;
  }
}


export class PortMessageStream extends Duplex {
  protected eventEmitter: EventEmitter;
  protected _port: Port;

  constructor(port: Port) {
    super({ objectMode: true });
    this.eventEmitter = new EventEmitter();
    this._port = port;
    this._port.addListener(this._onMessage.bind(this));
  }

  private get origin() {
    return this._port.origin ?? "*";
  }

  private _onMessage(event: MessageEvent<HostingMessageNS.HostingMessage>): void {
    const msg = event.data;
    if (this.origin !== '*' && event.origin !== this.origin) {
      return;
    }
    if (
      !msg
      || typeof msg !== 'object'
    ) {
      return;
    }

    this.push(msg.message);
  }

  _read(): void {

  }

  _write(data: any, _encoding: any, cb: () => void): void {
    const message = {
      isTronLink: true,
      source: this._port.source,
      message: data,
    };
    this._port.postMessage(message, this.origin);
    cb();
  }

}
