import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CheckoutServer } from './server.js';

export function startCheckoutServer(port = null, options = {}) {
  // RENDER FIX: Use Render's dynamic PORT first, fallback to 7000
  const finalPort = port || Number(process.env.PORT || process.env.CHECKOUT_PORTAL_PORT || 7000);
  const checkoutServer = new CheckoutServer(options);
  const rawServer = checkoutServer.createServer();

  // RENDER FIX: Bind to 0.0.0.0 so external traffic can reach it
  const bindHost = process.env.YOUPI_BIND_HOST || '0.0.0.0';

  return new Promise(resolve => {
    const instance = rawServer.listen(finalPort, bindHost, () => {
      console.log(`[Checkout Portal] Server listening on ${bindHost}:${finalPort}`);
      resolve({
        port: finalPort,
        close: () => new Promise(cb => instance.close(cb))
      });
    });
  });
}

// Auto-run if executed directly as main script
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startCheckoutServer();
}
