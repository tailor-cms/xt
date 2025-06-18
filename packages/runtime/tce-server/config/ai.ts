export const uiEnabled = process.env.AI_UI_ENABLED;
export const secretKey = process.env.AI_SECRET_KEY;
export const modelId = process.env.AI_MODEL_ID;
export const isConfigured = uiEnabled && secretKey && modelId;
