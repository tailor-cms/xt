import axios from 'axios';

// TODO: Make baseURL configurable (currently runtime port is hardcoded)
const config = {
  baseURL: 'http://localhost:8030',
  headers: { 'Content-Type': 'application/json' },
};

const client = axios.create(config);
export default client;
