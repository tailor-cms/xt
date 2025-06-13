import axios from 'axios';

const config = {
  baseURL: import.meta.env.VITE_SERVER_RUNTIME_URL,
  headers: { 'Content-Type': 'application/json' },
};
const client = axios.create(config);
export default client;
