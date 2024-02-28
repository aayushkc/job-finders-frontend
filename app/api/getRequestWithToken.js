import { APIENDPOINT } from "./APIENDPOINT";


export default async function getRequestWithToken(endpoint, accessToken) {
  
    // Default options for the fetch request
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include the bearer token in the Authorization header
        Authorization: `Bearer ${accessToken}`,
      },
    };
  
    try {
      const response = await fetch(`${APIENDPOINT}${endpoint}`, requestOptions);
      if (!response.ok) {
        // Handle non-successful responses
        throw new Error('Network response was not ok.');
      }
      
      return await response.json();
     
    } catch (error) {
      console.error('There was a problem with the fetch request:', error);
      // Handle error
      return { error: error.message };
    }
  }
