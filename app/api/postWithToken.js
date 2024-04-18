import { APIENDPOINT } from "./APIENDPOINT";
import Cookies from 'js-cookie';
export default async function PostWithTokien(endpoint, data){
    const accessToken = Cookies.get('accessToken');
    
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the bearer token in the Authorization header
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      };
      try {
        const response = await fetch(`${APIENDPOINT}${endpoint}`, requestOptions);
        if (!response.ok) {
          // Handle non-successful responses
          
          const data = await response.json()
          
          throw new Error("Cannot Fetch")
        //   throw new Error('Network response was not ok.');
        }
        return await response.json();
      } catch (error) {
        console.error('There was a problem with the fetch request:', error);
        // Handle error
       throw new Error(error)
      }
}
