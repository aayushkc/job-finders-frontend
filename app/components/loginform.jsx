"use client"

import Link from "next/link"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export default function LoginForm(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
  
    const handleLogin = async (e) => {
        e.preventDefault();
      try {
        const response = await fetch('http://127.0.0.1:8000/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const decodedToken = jwt.decode(data.access); // Decode the access token
          console.log(decodedToken);
          const userId = decodedToken.userId; 
          const isRecruiter = decodedToken.isRecruiter; 
          const isSeeker = decodedToken.isSeeker; 
          Cookies.set('accessToken', data.access, { expires: 1 });
          Cookies.set('userId', userId); // Store user ID in cookie (optional)
          if(isRecruiter){
            router.push('/recruiter');
          }
          if(isSeeker){
            router.push('/');
          }
         
        } else {
          // Handle error response
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };
  
    return(
        <form className="px-6 sm:px-14 mt-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2 items-start">
                <label>Username</label>
                <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full"/>
            </div>

            <div className="flex flex-col gap-2 items-start mt-4">
                <label>Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full"/>
            </div>

            <div className="flex justify-between items-center mt-4">
                <i className="bi bi-eye-fill text-human-green"></i>
                <Link href="#">Forget Password?</Link>
            </div>

            <button className="uppercase bg-gurkha-yellow font-bold text-white rounded-xl py-3 px-6 w-full mt-6">Sign IN</button>
        </form>
    )
}