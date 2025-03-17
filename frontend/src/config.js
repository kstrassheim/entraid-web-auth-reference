export const env = import.meta.env.MODE;
export const productionUrl = 'http://localhost:8000'
export const developmentUrl = 'http://localhost:5173';
export const backendUrl = env === 'production'  ? '': productionUrl;
export const frontendUrl = env === 'production' ? productionUrl : developmentUrl;
export const entra = {clientId: undefined, tenantId: undefined};