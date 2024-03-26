
import { APIENDPOINT } from "./APIENDPOINT";
import Cookies from 'js-cookie';
export default async function PatchRequest(endpoint, data, isFile){
    const accessToken = Cookies.get('accessToken');
    console.log(isFile);
    console.log(data);
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
          console.log("Entereedddddddddddddd");
          const err = await response.json()
          console.log("Errrrrrrrrrr:", err);
          throw new Error('Network response was not ok.');
        }
        return await response.json();
      } catch (error) {
        console.error('There was a problem with the fetch request:', error);
        // Handle error
       throw new Error(error)
      }
}
