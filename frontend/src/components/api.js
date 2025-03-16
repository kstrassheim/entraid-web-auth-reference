export const backendUrl = import.meta.env.MODE === 'production' ? '': 'http://localhost:8000';

export const apiHello = async (accessToken) => {
    try {
        const response = await fetch(`${backendUrl}/api/data`, {
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