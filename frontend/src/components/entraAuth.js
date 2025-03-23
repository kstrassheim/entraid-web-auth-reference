import { LogLevel } from '@azure/msal-browser';
import { frontendUrl } from "../config";
import tfconfig from '../../terraform.config.json' assert { type: 'json' };
import appInsights from './appInsights';

export const msalConfig = () =>{
  console.log("redirect uri:" + frontendUrl);
  return {
    auth: {
      clientId: tfconfig.client_id.value,
      authority: `https://login.microsoftonline.com/${tfconfig.tenant_id.value}/v2.0`,
      // redirectUri: frontendUrl,
      // postLogoutRedirectUri: frontendUrl+'/post-logout',
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
const permission = tfconfig.requested_graph_api_delegated_permissions.value
export const loginRequest = {
  scopes: tfconfig.requested_graph_api_delegated_permissions.value,
};

export const retreiveToken = async (instance, extraScopes = []) => {
  appInsights.trackEvent({ name: 'MSAL Retrieving Token' });
  const account = instance.getActiveAccount();
  const tokenResponse = await instance.acquireTokenSilent({
    scopes: [tfconfig.oauth2_permission_scope_uri.value, ...extraScopes],
    account: account,
  });
  return tokenResponse.accessToken;
}


