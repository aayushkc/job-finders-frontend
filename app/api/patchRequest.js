
import { APIENDPOINT } from "./APIENDPOINT";
import Cookies from 'js-cookie';
export default async function PatchRequest(endpoint, data, isFile){
    const accessToken = Cookies.get('accessToken');
    
    
    const requestOptions = {
        method: 'PATCH',
        headers: {
          
          // Include the bearer token in the Authorization header
          Authorization: `Bearer ${accessToken}`,
        },
        body: isFile ? data :JSON.stringify(data),
      };
      
      if (!isFile) {
        requestOptions.headers['Content-Type'] = 'application/json';
    }
   
      try {
        const response = await fetch(`${APIENDPOINT}${endpoint}`, requestOptions);
        if (!response.ok) {
          // Handle non-successful responses
          return response
        }
        return await response.json();
      } catch (error) {
        console.error('There was a problem with the fetch request:', error);
        // Handle error
       throw new Error(error)
      }
}
