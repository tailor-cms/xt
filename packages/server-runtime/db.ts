import { Sequelize } from "sequelize";

import ContentElement from "./content-element/model";
import initHooks from "./content-element/hooks";
import { getTceConfig } from "./common/config";

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
  console.log("All models were synchronized successfully.");
}

export async function initDb(hookMap) {
  try {
    await initConnection();
    await initializeModel(ContentElement, hookMap);
    await synchronize();
  } catch (error) {
    console.error('Error upon initializing the database:', error);
  }
}
