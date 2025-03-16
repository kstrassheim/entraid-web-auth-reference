
import React from 'react';
import { useMsal , AuthenticatedTemplate, UnauthenticatedTemplate} from '@azure/msal-react';
import { loginRequest } from './components/azureAuth';

const AzureLogon = () => {
  const { instance } = useMsal();

  const logonFunc = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      instance.setActiveAccount(response.account);

    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logoutFunc = async () => {
    await instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin // or any URL you want users redirected to
    });
  }

  return <>
      <AuthenticatedTemplate>
        <button onClick={logoutFunc}>Sign Out from Azure</button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={logonFunc}>Sign In with Azure</button>
      </UnauthenticatedTemplate>
    </>
};

export default AzureLogon;