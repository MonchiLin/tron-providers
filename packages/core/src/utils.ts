export type ConsoleLike = Pick<
  Console,
  'log' | 'warn' | 'error' | 'debug' | 'info' | 'trace'
  >;

export function getFavicon() {
  let favicon = undefined;
  let nodeList = document.getElementsByTagName("link");
  for (let i = 0; i < nodeList.length; i++) {
    if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
      favicon = nodeList[i].getAttribute("href");
    }
  }
  if (favicon) {
    return window.location.protocol + "://" + window.location.host + favicon;
  }
  return undefined;
}

export class Connect {
  // 账户地址
  address?: string;
  // 链接状态
  connected: boolean = false;

  connect(address: string) {
    this.address = address;
    this.connected = true;
  }
}
