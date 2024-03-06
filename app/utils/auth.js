"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export default function ProtectedAdminPage({children}) {
    const router = useRouter();
    useEffect(() => {
      const accessToken = Cookies.get('accessToken');
      console.log("ACessssssssssssssssssssss", accessToken);
      if (!accessToken) {
        // Redirect to login page if access token is not present
        router.push('/signin');
      }else{
      const decodedToken = jwt.decode(accessToken); // Decode the access token
      console.log(decodedToken);
      const isRecruiter = decodedToken.isRecruiter; 
      const isSeeker = decodedToken.isSeeker; 

      if(accessToken && isSeeker){
        router.push('/')
      }
    }
    }, []);
  return children
}