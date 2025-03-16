// authConfig.js
import { LogLevel } from '@azure/msal-browser';

const prodUri = 'http://localhost:8000';
// const tenantId = '1e1e851f-618f-40d4-9c2d-45355ad039a9';
// const clientId = '6a8e74ac-e0e1-429b-9ac1-8135042f973d';

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
      authority: `https://login.microsoftonline.com/${tenant_id}`,
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
  scopes: ['User.Read', "api://6a8e74ac-e0e1-429b-9ac1-8135042f973d/user_impersonation"],
};



