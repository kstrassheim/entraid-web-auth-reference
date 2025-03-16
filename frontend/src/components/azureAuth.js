// authConfig.js
import { LogLevel } from '@azure/msal-browser';

const prodUri = 'http://localhost:8000';
const tenantId = '1e1e851f-618f-40d4-9c2d-45355ad039a9';
const clientId = '6a8e74ac-e0e1-429b-9ac1-8135042f973d';

export const redirectHost = import.meta.env.MODE === 'production' ? prodUri: 'http://localhost:5173';

export const msalConfig = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri:  `${redirectHost}/redirect`,
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console[level === LogLevel.Error ? 'error' : 'info'](message);
      },
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};



