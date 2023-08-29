import { Sequelize } from 'sequelize';

import ContentElement from './content-element/model';
import { getTceConfig } from './common/config';
import initHooks from './content-element/hooks';

const sequelize = new Sequelize('sqlite::memory:');

async function initConnection() {
  await sequelize.authenticate();
  console.log('DB connection established!');
}

function initializeModel(model, hookMap) {
  const options = {
    ...model.initOptions(),
    sequelize,
  };
  model.init(model.fields(), options);
  const { registerSaveHooks } = initHooks(hookMap);
  registerSaveHooks(model, getTceConfig(process.env));
}

async function synchronize() {
  await sequelize.sync({ force: true });
  console.log('All models were synchronized successfully.');
}

export async function initDb(hookMap) {
  try {
    await initConnection();
    initializeModel(ContentElement, hookMap);
    await synchronize();
  } catch (error) {
    console.error('Error upon initializing the database:', error);
  }
}
