import { serverPorts } from './config.js';
import { freeUpPorts } from './utils.js';

// Make sure ports are free before starting the kit
await freeUpPorts(serverPorts);
