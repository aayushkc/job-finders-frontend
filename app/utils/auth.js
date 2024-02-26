"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function ProtectedPage({children}) {
    const router = useRouter();

    useEffect(() => {
      const accessToken = Cookies.get('accessToken');

      if (!accessToken) {
        // Redirect to login page if access token is not present
        router.push('/signin');
      }
    }, []);
  return children
}