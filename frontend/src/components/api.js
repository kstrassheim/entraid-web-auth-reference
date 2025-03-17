import { backendUrl } from '../config';
import { retreiveToken } from './entraAuth';

export const getUserData = async (instance) => {
  try {
    const accessToken = await retreiveToken(instance);
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
export const getAdminData = async (instance) => {
  try {
    const accessToken = await retreiveToken(instance, ['Group.Read.All']);
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