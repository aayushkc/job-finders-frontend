"use client"

import LogOutButton from "@/app/components/logOutButton"
import ReSendEmail from "./reSendEmailButton"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useEffect } from "react"

export default function CheckEmailPage({ userDetails, accessToken, userId }) {

    const router = useRouter()
    
    useEffect(() =>{
        if(userDetails?.is_verified){
            Cookies.set("hasUserBeenActivated", true)
            const isSeeker = Cookies.get('isSeeker')
           
            if(isSeeker === 'false'){
               window.location.replace("https://localhost:3000/recruiter")
            }else{
                router.push("/")
            }
           
        }
    },[])

    return (
        <>
            <div className="absoulute h-[90vh]  top-[30%]  left-[40%] flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 px-4 sm:px-0">
                <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                           
                            <Image src={"/images/mailSent.png"} alt="mail sent infographic" width={320} height={350} />
                        </div>
                        <h2 className="text-lg font-semibold mb-2">Check your inbox to confirm your email address</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            We sent a link to {userDetails?.email}. If you don’t see it, check your spam folder. After confirming
                            your email, you can explore the platform.
                        </p>

                        {
                            accessToken && (
                                <ReSendEmail id={userId} />
                            )
                        }

                        <LogOutButton />

                    </div>
                </div>

            </div>

        </>
    )
}