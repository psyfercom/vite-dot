import chainSpec from './argochain.json';
import * as smoldot from 'smoldot';

const logContainer = document.getElementById('log-container');

const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;
const originalInfo = console.info;

const logToPage = (type, ...args) => {
  const logItem = document.createElement('div');
  logItem.classList.add(type);
  logItem.textContent = `[${type.toUpperCase()}] ${args.join(' ')}`;
  logContainer.appendChild(logItem);
  logContainer.scrollTop = logContainer.scrollHeight; // Auto scroll to the bottom
};

console.log = (...args) => {
  originalLog(...args);
  logToPage('log', ...args);
};

console.warn = (...args) => {
  originalWarn(...args);
  logToPage('warn', ...args);
};

console.error = (...args) => {
  originalError(...args);
  logToPage('error', ...args);
};

console.info = (...args) => {
  originalInfo(...args);
  logToPage('info', ...args);
};

// Override WebSocket to log connections
window.WebSocket = class extends WebSocket {
  constructor(...args) {
    console.log('will connect', ...args);
    super(...args);
  }
};

const startClient = async () => {
  try {
    const client = smoldot.start({
      maxLogLevel: 9,
    });

    console.log('will add chain');
    const chain = await client.addChain({ chainSpec: JSON.stringify(chainSpec) });

    await new Promise((resolve) => setTimeout(resolve, 30_000)); // Increased timeout

    console.log('will remove chain');
    chain.remove();

    // Check WebSocket connections between these setTimeouts
    await new Promise((resolve) => setTimeout(resolve, 120_000)); // Increased timeout

    console.log('will terminate client');
    client.terminate();
  } catch (error) {
    console.error('Error in startClient:', error);
    // Retry logic
    setTimeout(() => {
      console.log('Retrying to start client...');
      startClient().catch(err => console.error('Retry failed:', err));
    }, 10_000); // Retry after 10 seconds
  }
};

// Start the client
startClient().catch(error => console.error('Error in initial startClient:', error));