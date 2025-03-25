"use client"

import Link from "next/link"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import Login from "../utils/logIn";

export default function LoginForm(){
    
    const [logInErr, setLogInErr] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
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
      setLogInErr('')
      const loginRes = await Login(data)

      //For successfull login
      if(loginRes.status === 200){
        if(loginRes.userType === 'recruiter'){
          router.push('/recruiter')
          return;
        } 

        router.push("/")
        return;
      }

      //Handle login error and display message
      if(loginRes.status === 400 || loginRes.status === 500){
        setLogInErr(loginRes.error)
        return;
      }

    };

    const handleShowPassword = () =>{
      setShowPassword(!showPassword)
    }
  
    return(
        <form className="px-6 sm:px-14 mt-6" onSubmit={handleSubmit(handleLogin)}>
          {logInErr.length > 1 &&  <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{logInErr}</p>}
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