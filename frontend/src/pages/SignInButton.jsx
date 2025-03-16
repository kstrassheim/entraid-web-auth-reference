
import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../components/authConfig';

const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      // This will redirect the user to the Azure sign-in page
      await instance.loginRedirect(loginRequest);
      // Alternatively, you can use:
      // await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return <button onClick={handleLogin}>Sign In with Azure</button>;
};

export default SignInButton;