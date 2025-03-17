import { LogLevel } from '@azure/msal-browser';
import { backendUrl, frontendUrl, entra } from "../config";

const initEntraConfig = async () => {
  const response = await fetch(`${backendUrl}/auth/entra-config`);
  if (!response.ok) {
    throw new Error("Failed to fetch Entra config");
  }
  const {tenant_id, client_id} = await response.json();
  entra.clientId = client_id;
  entra.tenantId = tenant_id;
  return;
}

export const msalConfig = async () =>{
  await initEntraConfig();
  
  return {
    auth: {
      clientId: entra.clientId,
      // required for native tenant users
      authority: `https://login.microsoftonline.com/${entra.tenantId}/v2.0`,
      redirectUri: `${frontendUrl}/redirect`,
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

export const retreiveToken = async (instance) => {
  const account = instance.getActiveAccount();
  const tokenResponse = await instance.acquireTokenSilent({
    scopes: [`api://${entra.clientId}/user_impersonation`],
    account: account,
  });
  return tokenResponse.accessToken;
}


