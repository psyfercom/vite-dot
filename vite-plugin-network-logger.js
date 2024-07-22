// vite-plugin-vite-plugin-network-logger.js
import { createServer } from 'http';

export default function networkLoggerPlugin() {
    return {
        name: 'vite-plugin-network-logger',
        configureServer(server) {
            const proxyServer = createServer((req, res) => {
                console.log(`[Network Request] ${req.method} ${req.url}`);
                server.middlewares(req, res);
            });

            proxyServer.listen(3001, () => {
                console.log('Network logger proxy server running at http://localhost:3001');
            });
        }
    };
}
