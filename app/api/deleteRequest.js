import { APIENDPOINT } from "./APIENDPOINT";
import Cookies from 'js-cookie';
export default async function DeleteRequest(endpoint){
    const accessToken = Cookies.get('accessToken');

    const requestOptions = {
        method: 'DELETE',
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
       throw new Error(error)
      }
}
