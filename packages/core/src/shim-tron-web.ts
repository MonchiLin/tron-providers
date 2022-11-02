import { InPageProvider } from "./in-page-provider";

export function shimTronWeb(provider: InPageProvider, log: Console = console, SHIM_IDENTIFIER = "__isMetaMaskShim__") {
  let loggedCurrentProvider = false;
  let loggedMissingProperty = false;

  // @ts-ignore
  if (!window.tronWeb) {
    let tronWebShim = { currentProvider: provider };
    Object.defineProperty(tronWebShim, SHIM_IDENTIFIER, {
      value: true,
      enumerable: true,
      configurable: false,
      writable: false,
    });

    tronWebShim = new Proxy(tronWebShim, {
      get: (target, property, ...args) => {
        if (property === 'currentProvider' && !loggedCurrentProvider) {
          loggedCurrentProvider = true;
          log.warn(
            'You are accessing the MetaMask window.web3.currentProvider shim. This property is deprecated; use window.ethereum instead. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3',
          );
        } else if (
          property !== 'currentProvider' &&
          property !== SHIM_IDENTIFIER &&
          !loggedMissingProperty
        ) {
          loggedMissingProperty = true;
          log.error(
            `MetaMask no longer injects web3. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3`,
          );
        }
        return Reflect.get(target, property, ...args);
      },
      set: (...args) => {
        log.warn(
          'You are accessing the MetaMask window.web3 shim. This object is deprecated; use window.ethereum instead. For details, see: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3',
        );
        return Reflect.set(...args);
      },
    });

    Object.defineProperty(window, 'tronWeb', {
      value: tronWebShim,
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
}
