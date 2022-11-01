declare global {
  interface Window {
    tronWeb?: any;
  }
}

declare module 'tronweb' {
  const o: any = {}

  export = o;
}
