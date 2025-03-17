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
  entra.loaded = true;
  return;
}

export const msalConfig = async () =>{
  await initEntraConfig();
  return {
    auth: {
      clientId: entra.clientId,
      authority: `https://login.microsoftonline.com/${entra.tenantId}/v2.0`,
      redirectUri: frontendUrl,
      postLogoutRedirectUri: frontendUrl+'/post-logout',
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

export const retreiveToken = async (instance, extraScopes = []) => {
  const account = instance.getActiveAccount();
  const tokenResponse = await instance.acquireTokenSilent({
    scopes: [`api://${entra.clientId}/user_impersonation`, ...extraScopes],
    account: account,
  });
  return tokenResponse.accessToken;
}


