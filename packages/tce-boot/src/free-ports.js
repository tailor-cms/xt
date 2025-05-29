import { freeUpPorts } from './utils.js';
import { serverPorts } from './config.js';

// Make sure ports are free before starting the kit
await freeUpPorts(serverPorts);
