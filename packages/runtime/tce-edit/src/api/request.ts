import axios from 'axios';
import urlJoin from 'url-join';

const apiPrefix = '/tce-server';

const config = {
  baseURL: urlJoin(window.location.href, apiPrefix),
  headers: { 'Content-Type': 'application/json' },
};
const client = axios.create(config);
export default client;
