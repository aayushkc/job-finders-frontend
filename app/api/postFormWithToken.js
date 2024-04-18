import { APIENDPOINT } from "./APIENDPOINT";
import Cookies from 'js-cookie';
export default async function PostFormWithToken(endpoint, data){
    const accessToken = Cookies.get('accessToken');
    
    const requestOptions = {
        method: 'POST',
        headers: {
          
          // Include the bearer token in the Authorization header
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
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
