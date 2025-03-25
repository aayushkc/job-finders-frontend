"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';


export default function ProtectedAdminPage({children}) {
    const router = useRouter();
    useEffect(() => {
      const accessToken = Cookies.get('accessToken');
      const isSeeker = Cookies.get('isSeeker') === 'true'
      if (!accessToken) {
        // Redirect to login page if access token is not present
        router.push('/signin');
      }else{

      if(accessToken && isSeeker){
        router.push('/')
      }
    }
    }, []);
  return children
}