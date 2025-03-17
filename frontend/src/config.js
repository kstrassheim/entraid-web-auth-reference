export const env = import.meta.env.MODE;
export const isDev = env === 'development';
export const isProd = env === 'production';
export const productionUrl = 'http://localhost:8000'
export const developmentUrl = 'http://localhost:5173';
export const backendUrl = isProd  ? '': productionUrl;
export const frontendUrl = isProd ? productionUrl : developmentUrl;
export const entra = {loaded : false, clientId: undefined, tenantId: undefined};