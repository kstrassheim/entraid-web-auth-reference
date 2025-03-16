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

// Custom function to receive the profile phote
export const getProfilePhoto = async (instance, activeAccount) => {
    try {
      if (!activeAccount && !instance) {
        console.warn('No active account or instance');
        return;
      }
      // Request token for Microsoft Graph with the User.Read scope
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      
      const accessToken = tokenResponse.accessToken;
      
      // Fetch the profile photo from Graph
      const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
        
      } else {
        console.error('Failed to fetch profile photo:', response.statusText);
      }
    } catch (error) {
      if (error.errorMessage !== "You must call and await the initialize function before attempting to call any other MSAL API.  For more visit: aka.ms/msaljs/browser-errors")
        console.error('Error fetching profile photo:', error);
    }
};

