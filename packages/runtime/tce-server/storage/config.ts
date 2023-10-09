const config = {
  provider: process.env.STORAGE_PROVIDER || 'filesystem',
  path: process.env.STORAGE_PATH,
  protocol: 'storage://',
};

export default config;
