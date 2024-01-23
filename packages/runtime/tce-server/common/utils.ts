import { createHash } from 'node:crypto';

export const parseCookie = (str) => {
  if (!str) return {};
  return str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
};

export const hash = (content) => {
  return createHash('sha256').update(content).digest('hex');
};
