"use client"

import logo from "../../../public/images/footerLogo.png"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { useAuth } from "@/app/utils/checkIsLoggedIn";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
export default function SignInUser() {
    const router = useRouter()
    const { isLoggedIn } = useAuth();
    const [emailExists, setEmailExists] = useState(false)
    
    const handleFormSubmit = async (data) => {
        setEmailExists(false)

        try {
            const response = await fetch(`${APIENDPOINT}/auth/register/job-seeker`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const er = await response.json();
                
                if(er.email){
                    if(er.email[0].startsWith("cus")){
                        setEmailExists({email:["Email aready Exists"]})
                        return
                    }
                    setEmailExists(er)
                }else{
                    setEmailExists(false)
                }
               
                throw new Error('Failed to register');
            }

            const res = await response.json();
            
            router.push('/signin')
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    

    const formSchema = Yup.object().shape({
        username: Yup.string().required('Please Enter a username'),
        email: Yup.string()
          .required('Please Enter your Email')
          .email('Invalid Email Address'),
        password: Yup.string()
          .required("Password is required")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
          ),
          confirm_password: Yup.string()
          .required("Confirm Password is required")
          .oneOf([Yup.ref("password")], "Passwords do not match")
      });
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
      } = useForm({
        
        resolver: yupResolver(formSchema)
      });

    useEffect(() =>{
        if(isLoggedIn) router.back()
      },[isLoggedIn])
   
    return (
        <main className="signin sm:px-4 grid">
            <section className="sm:place-self-center grid bg-[#F3F4F8] sm:bg-white sm:rounded-xl  text-center sm:w-[30%] py-8 sm:my-10">
            <Link href="/signin" className='place-self-start pl-6'><i className="bi bi-arrow-left text-2xl text-left"></i></Link>
                <div className="flex justify-center">
                    <Image src="/images/Footerlogo.png" alt="logo" width={100} height={40}/>
                </div>
                <h1 className="text-3xl font-bold my-3">Register as User</h1>

                <form className="px-14 mt-4" onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex flex-col gap-2 items-start">
                        {emailExists ? <p className="text-sm text-[#E33629]">{emailExists.email}</p> :""}
                        <label>Email*</label>
                        <input 
                                type="email" 
                                name="email" 
                                {...register("email")}  
                                required 
                                className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full" 
                        />
                    
                        {errors.email ? <p className="text-sm text-[#E33629]">{errors.email.message}</p> :""}
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <label>Username*</label>
                        <input 
                            type="text" 
                            name="username" 
                            {...register("username")}  
                            required 
                            className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full" 
                        />
                        {errors.username ?<p className="text-sm text-[#E33629]">{errors.username.message}</p> :""}
                    </div>

                    <div className="flex flex-col gap-2 items-start mt-4">
                        <label>Password*</label>
                        <input 
                            type="password" 
                            name="password" 
                            {...register("password")}   
                            required 
                            className={`rounded-xl border-2 ${errors.confirm_password ? 'border-[#E33629]':'border-[#E2E8F0]' } py-2 px-6 w-full`}
                        />
                        {errors.password ?<p className="text-sm text-[#E33629]">{errors.password.message}</p> :""}
                    </div>

                    <div className="flex flex-col gap-2 items-start mt-4">
                        <label>Confirm Password*</label>
                        <input
                             type="password" 
                             name="confirm_password" 
                             {...register("confirm_password")}  
                             required 
                             className={`rounded-xl border-2 ${errors.confirm_password ? 'border-[#E33629]':'border-[#E2E8F0]' } py-2 px-6 w-full`}
                        />
                       
                        {errors.confirm_password ? <p className="text-sm text-[#E33629]">{errors.confirm_password.message}</p> :""}
                    </div>

               
                    <button className="uppercase bg-gurkha-yellow font-bold text-white rounded-xl py-3 px-6 w-full mt-6">
                        {isSubmitting ? 
                         <ClipLoader
                         color={"#FFFFFF"}
                         loading={true}
                         size={20}
                         aria-label="Loading Spinner"
                         data-testid="loader"
                       />: "Register" }
                        
                        
                    </button>
                </form>

            </section>
        </main>
    )
}