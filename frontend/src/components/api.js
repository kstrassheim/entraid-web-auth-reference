import { backendUrl } from '../config';
import { retreiveToken } from './entraAuth';

export const userData = async (accessToken) => {
  try {
    const response = await fetch(`${backendUrl}/api/user-data`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
export const adminData = async (accessToken) => {
  try {
    const response = await fetch(`${backendUrl}/api/admin-data`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// re-expose getToken to avoid always referencing entraAuth on every page
export const getToken = retreiveToken;