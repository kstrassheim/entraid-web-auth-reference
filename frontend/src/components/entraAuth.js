// authConfig.js
import { LogLevel } from '@azure/msal-browser';

const prodUri = 'http://localhost:8000';

const fetchEntraConfig = async () => {
  const host = import.meta.env.MODE === 'production' ? '' : 'http://localhost:8000';
  const response = await fetch(`${host}/auth/entra-config`);
  if (!response.ok) {
    throw new Error("Failed to fetch Entra config");
  }

  return  await response.json();
}

export const redirectHost = import.meta.env.MODE === 'production' ? prodUri: 'http://localhost:5173';

export const msalConfig = async () =>{
  const {tenant_id, client_id} = await fetchEntraConfig();

  return {
    auth: {
      clientId: client_id,
      // required for native tenant users
      authority: `https://login.microsoftonline.com/${tenant_id}/v2.0`,
      redirectUri: `${redirectHost}/redirect`,
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
};

export const loginRequest = {
  scopes: ['User.Read'],
};



