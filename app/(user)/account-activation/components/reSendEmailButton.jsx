"use client"

import { APIENDPOINT } from "@/app/api/APIENDPOINT"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ClipLoader } from "react-spinners"

export default function ReSendEmail({id}){

    const router = useRouter()

    const [pending, setPending] = useState(false)

    const sendEmail = async (e) =>{
        e.preventDefault();
        setPending(true)
        try{
            const res = await fetch(`${APIENDPOINT}/resend-activate-link-using-user/${id}/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            })
        
            if(res.status === 200){
               router.push("/account-activation/sucess")
            }else{
               router.push("/account-activation/error")
            }
        }catch(err){
            router.push("/account-activation/error")
        }finally{
            setPending(false)
        }
       
        
    }
    
    return (
        <form onSubmit={sendEmail} className="flex justify-center">
        <button
            className="bg-gurkha-yellow text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            type="submit"
            disabled={pending}
        >
            {
                pending  ? (
                    <>
                    <ClipLoader
                         color={"#FFFFFF"}
                         loading={true}
                         size={20}
                         aria-label="Loading Spinner"
                         data-testid="loader"
                       />
                    Sending Email
                    </>
                    
                ): "Resend email"
            }
            
        </button>
    </form>
    )
}