"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import DialogBox from "@/app/components/sucessbox";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
    const {
        handleSubmit,
        register,
        formState: { isSubmitting }
    } = useForm()
    const router = useRouter()
    
    const [isMailSent, setIsMailSent] = useState(false)
    const [mailError, setMailError] = useState(false)
    const handlePassReset = async (data) => {
        setIsMailSent(false)
        setMailError(false)
     
        try {
            const response = await fetch(`${APIENDPOINT}/api/password_reset/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)

            })

            if (!response.ok) {
                // Handle non-successful responses
          
                const data = await response.json()
                
                setIsMailSent(false);
                setMailError(true)
                throw new Error("Cannot Fetch")
                //   throw new Error('Network response was not ok.');
            }
            const res = await response.json();
            // setIsMailSent(true)
            toast.success( 'Password Reset Sent Successfully', {
                position: "bottom-right",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                });
            setTimeout(() =>{
                router.push('/signin');
            },1200)
          

        } catch (err) {
            setMailError(true)
           
        }
    }

  
    useEffect(() => {
        setIsMailSent(false)
        setMailError(false)
    }, [])

    return (
        <section className="signin grid h-[90vh]">
            {
                isMailSent && <DialogBox
                    dialogHeading={"Email Sent SuccessFully"}
                    dialogText={"Email has been sent SuccessFully"}
                    goToPageName={"Back"}
                    url={"/signin"}
                    success={true}
                />
            }

            {
                mailError && <DialogBox
                    dialogHeading={"Could not Send SuccessFully"}
                    dialogText={"We are unable to send password reset email right now."}
                    error={true}
                />
            }
            <section className="sm:place-self-center grid bg-white sm:rounded-xl  text-center sm:w-[35%] px-8 sm:px-2 sm:py-8 py-12 sm:my-10">
                <h1 className="text-4xl font-bold">Forgot Password</h1>
                <form className="px-6 sm:px-14 mt-6" onSubmit={handleSubmit(handlePassReset)}>
                    <div className="flex flex-col gap-2 items-start">
                        <label>Enter your Email</label>
                        <input
                            type="email"
                            required
                            {...register("email")}
                            className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full" />
                    </div>

                    <button className={`flex gap-4 items-center justify-center uppercase rounded-xl py-3 px-6 w-full mt-6 ${isSubmitting ? 'bg-[#FCE4B0] text-[#475569] font-semibold' : 'bg-gurkha-yellow text-white font-bold'}`} disabled={isSubmitting}>
                        {isSubmitting &&
                            <ClipLoader
                                color={"#FFFFFF"}
                                loading={true}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />}
                        Send Email
                    </button>

                </form>




            </section>
            <ToastContainer />
        </section>
    );
}
