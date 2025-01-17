"use client"

import Link from "next/link"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { APIENDPOINT } from "../api/APIENDPOINT";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import {useAuth} from '../utils/checkIsLoggedIn'
export default function LoginForm(){
    const { setIsLoggedIn } = useAuth()
    const [logInErr, setLogInErr] = useState(false)
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const formSchema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required('Please Enter your Email'),
      password: Yup.string()
        .required("Password is required")
    });
    const {
      register,
      handleSubmit,
      formState:{errors, isSubmitting}
    } = useForm({
      resolver: yupResolver(formSchema)
    })
  
    const handleLogin = async (data) => {
      setLogInErr(false)
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
          setIsLoggedIn({'logInStatus':true, 'username':''})
          
          Cookies.set('accessToken', data.access, { expires: 1});
          Cookies.set('userId', userId,{ expires: 1}); 
          Cookies.set('isSeeker', isSeeker,{ expires: 1})
          Cookies.set("isLoggedIn", true,{ expires: 1})
          Cookies.set("hasUserBeenActivated", isVerified)
          // if(!isVerified){
          //   router.push('/account-activation')
          // }

          if(isRecruiter){
            router.push('/recruiter');
          }
          if(isSeeker){
            router.push('/');
            router.refresh();
          }
          if(isSuperAdmin){
            router.push('/view-all-pending-jobs')
          }
         
        } else {
          // Handle error response
          const data = await response.json()
          setLogInErr(true)
          
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };

    const handleShowPassword = () =>{
      setShowPassword(!showPassword)
    }
  
    return(
        <form className="px-6 sm:px-14 mt-6" onSubmit={handleSubmit(handleLogin)}>
          {logInErr ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">Could not Log In. Check your Email and Password</p> :""}
            <div className="flex flex-col gap-2 items-start">
                <label>Email</label>
                <input 
                    type="email" 
                    required
                    {...register("email")} 
                    className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full"/>
            </div>

            <div className="flex flex-col gap-2 items-start mt-4">
                <label>Password</label>
                <input 
                  type={showPassword ? "text" : 'password'}
                  required
                  autoComplete="off" 
                  {...register("password")} 
                  className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full"/>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button type="button" className="text-human-green" onClick={handleShowPassword}> 
                {
                  showPassword ? <i className="bi bi-eye-slash-fill"></i> : 
                  <i className="bi bi-eye-fill" ></i>
                }
              </button>
               
                <Link href="/forget-password">Forgot Password?</Link>
            </div>

            <button className={`flex gap-4 items-center justify-center uppercase rounded-xl py-3 px-6 w-full mt-6 ${isSubmitting ?'bg-[#FCE4B0] text-[#475569] font-semibold' :'bg-gurkha-yellow text-white font-bold'}`} disabled={isSubmitting}>
            {isSubmitting && 
                         <ClipLoader
                         color={"#FFFFFF"}
                         loading={true}
                         size={20}
                         aria-label="Loading Spinner"
                         data-testid="loader"
                       />}
                       Sign In 
              </button>
        </form>
    )
}