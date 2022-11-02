// @ts-ignore
import * as TronWeb from 'tronweb';
import { v4 as uuidv4 } from 'uuid';
import { getFavicon } from "./utils";
import { HostingMessageNS, PortMessageStream } from "./port-message-stream";

export type JSON_RPC_METHOD_PARAMS = {
  method: "tron_requestAccounts",
  params: any
}

export type DefaultAddress = {
  base58: string
  hex: string
  name: string
  type: number
}

export interface InPageProviderOptions {
  portMessageStream: PortMessageStream;
}

export interface Message {
  action: string,
  data: {
    uuid: string,
    action: string,
    data: any,
  }
}

export class InPageProvider {
  private tronWebStatic!: any;
  private connected = false;
  private portMessageStream: PortMessageStream;
  public defaultAddress!: DefaultAddress;
  private defaultAddressInner!: DefaultAddress;
  private pendingMessages: Message[] = [];

  constructor({ portMessageStream }: InPageProviderOptions) {
    this.portMessageStream = portMessageStream;
    this.tronWebStatic = TronWeb;
    this.defaultAddressInner = {
      type: 0,
      base58: "",
      name: "",
      hex: ""
    }

    this.bindHostingEvents();
    this.withConnect(
      'defaultAddress',
      () => {
        return this.defaultAddressInner;
      }
    );
    this.withConnect(
      'contract',
      () => this.tronWebStatic.contract
    );
  }

  public removeMessageByUUID(uuid: string) {
    this.pendingMessages = this.pendingMessages.filter((message) => message.data.uuid !== uuid);
  }

  public findMessageByUUID(uuid: string) {
    return this.pendingMessages.find((message) => message.data.uuid === uuid);
  }

  public request(params: JSON_RPC_METHOD_PARAMS) {
    const body = this.tunnel(params);
    this.pendingMessages.push(body);
    this.portMessageStream.write(this.tunnel(params));
  }

  private bindHostingEvents() {
    this.portMessageStream.on('data', (data: HostingMessageNS.Message) => {
      console.log("bindHostingEvents", data);
      if (data.action === "tunnel") {
        return;
      }

      if (data.action === "tabReply") {
        const message = this.findMessageByUUID(data.data.uuid);
        if (!message) {
          return;
        }
        const payload = message.data;
        this.removeMessageByUUID(data.data.uuid);
        if (payload.action === "tron_requestAccounts") {
          this.defaultAddress = payload.data;
          this.connected = true;
        }
      }
    });
  }

  private tunnel(params: JSON_RPC_METHOD_PARAMS): Message {
    return {
      action: "tunnel",
      data: {
        uuid: uuidv4(),
        action: "request",
        data: {
          method: params.method,
          params: params.params
        },
      }
    };
  }

  private _connect() {
    const body = this.tunnel({
      method: "tron_requestAccounts",
      params: {
        websiteName: document.title,
        websiteIcon: getFavicon()
      }
    });
    this.pendingMessages.push(body);
    this.portMessageStream.write(body);
  }

  private withConnect(property: string, getter: () => any) {
    Reflect.defineProperty(this, property, {
      get: () => {
        if (!this.connected) {
          this._connect();
          return false;
        }

        return getter();
      },
      enumerable: true,
    });
  }


}
