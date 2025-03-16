import React from 'react';
import { useMsal , AuthenticatedTemplate, UnauthenticatedTemplate} from '@azure/msal-react';
import { loginRequest } from './entraAuth';

const EntraLogon = () => {
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

  return <div className="logon-buttons">
      <AuthenticatedTemplate>
        <button onClick={logoutFunc}>Sign Out</button>
        <button onClick={()=>logonFunc(true)}>Change Account</button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={logonFunc}>Sign In</button>
      </UnauthenticatedTemplate>
    </div>
};

export default EntraLogon;