'use server'
// import Cookies from 'js-cookie';
const { APIENDPOINT } = require("../api/APIENDPOINT");
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

const Login = async (data) => {
    const Cookies = await cookies()
    
      try {
        const response = await fetch(`${APIENDPOINT}/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });    
  
        if (response.ok) {
          const data = await response.json();
          const decodedToken = jwt.decode(data.access); // Decode the access token
          const userId = decodedToken.userId; 
          const isRecruiter = decodedToken.isRecruiter; 
          const isSeeker = decodedToken.isSeeker; 
          const isSuperAdmin = decodedToken.isSuperAdmin
          const isVerified = decodedToken.hasUserBeenActivated
          Cookies.set('accessToken', data.access, );
          Cookies.set('userId', userId,); 
          Cookies.set('isSeeker', isSeeker,)
          Cookies.set("isLoggedIn", true,)
          Cookies.set("hasUserBeenActivated", isVerified)
          // if(!isVerified){
          //   router.push('/account-activation')
          // }

          if(isRecruiter){
            return {'status':200,'userType':'recruiter'};
          }
          if(isSeeker){
             return {'status':200,'userType':'seeker'};;
          }
          if(isSuperAdmin){
            return {'status':200,'userType':'superAdmin'};
          }
         
        } else {
          // Handle wrong pass or email response
          return {'status':400,'error':'Could not login. Check your email and password'}
          
        }
      } catch (error) {
        return {'status':500,'error':'Sever error'}
      }
    };

export default Login;