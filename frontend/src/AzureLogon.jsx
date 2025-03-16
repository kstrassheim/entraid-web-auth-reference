
import React from 'react';
import { useMsal , AuthenticatedTemplate, UnauthenticatedTemplate} from '@azure/msal-react';
import { loginRequest } from './components/azureAuth';

const AzureLogon = () => {
  const { instance } = useMsal();

  const logonFunc = async (forcePopup = false) => {
    try {
      let loginRequestParam = forcePopup ? { ...loginRequest, prompt: "select_account" } : loginRequest;
      const response = await instance.loginPopup(loginRequestParam);
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
        <button onClick={()=>logonFunc(true)}>Sign In with Different Account</button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={logoutFunc}>Sign In with Azure</button>
      </UnauthenticatedTemplate>
    </>
};

export default AzureLogon;