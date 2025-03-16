import React from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest } from './azureAuth';

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
  };

  return (
    <div>
      <AuthenticatedTemplate>
        <a href="#" onClick={logoutFunc} className="nav-link">Sign Out</a>
        <a href="#" onClick={() => logonFunc(true)} className="nav-link">Change Account</a>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <a href="#" onClick={() => logonFunc()} className="nav-link">Sign In</a>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default EntraLogon;