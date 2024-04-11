"use client"

import Link from "next/link";
import { useAuth } from "@/app/utils/checkIsLoggedIn";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { ClipLoader } from "react-spinners";
import DialogBox from "@/app/components/sucessbox";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup"

export default function SignIn() {
    const { isLoggedIn } = useAuth();
    const searchParam = useSearchParams()
    const [token, setToken] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [confirmShowPassword, setConfrimShowPassword] = useState(false)

    const formSchema = Yup.object().shape({
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
        handleSubmit,
        register,
        setValue,
        formState: { isSubmitting, errors }
    } = useForm({
        resolver: yupResolver(formSchema)
    })
    const router = useRouter()
    console.log(isLoggedIn);
    const [resetPasswordConfirm, setResetPasswordConfirm] = useState(false)
    const [resetPasswordError, setResetPasswordError] = useState(false)
    const handlePassReset = async (data) => {
        console.log(data);
        setResetPasswordConfirm(false)
        setResetPasswordError(false)
        try {
            const response = await fetch(`${APIENDPOINT}/api/password_reset/confirm/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)

            })

            if (!response.ok) {
                // Handle non-successful responses
                console.log("Entereedddddddddddddd");
                const data = await response.json()
                console.log(data);
                setResetPasswordConfirm(false)
                setResetPasswordError(true)
                throw new Error("Cannot Fetch")
                //   throw new Error('Network response was not ok.');
            }
            const res = await response.json();
            // setResetPasswordConfirm(true)
            setResetPasswordError(false)
            toast.success('Password reset email sent!');
            router.push('/signin');
            console.log(res);

        } catch (err) {
            setResetPasswordError(true)
            setResetPasswordConfirm(false)
            console.log(err);
        }
    }

    useEffect(() => {
        if (isLoggedIn) router.back()
    }, [isLoggedIn])

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowConfirmPassword = () => {
        setConfrimShowPassword(!confirmShowPassword)
    }
    useEffect(() => {
        const t = searchParam.get("token")
        setToken(t)
        setValue("token", t || "")
        setResetPasswordConfirm(false)
        setResetPasswordError(false)
    }, [])

    return (
        <main className="signin grid h-[90vh]">
            {
                resetPasswordConfirm && <DialogBox
                    dialogHeading={"Password Reset SuccessFully"}
                    dialogText={"Your password has been reset SuccessFully"}
                    goToPageName={"Back"}
                    url={"/signin"}
                    success={true}
                />
            }

            {
                resetPasswordError && <DialogBox
                    dialogHeading={"Could not reset password"}
                    dialogText={"Unable to reset password. Try Again Later."}
                    error={true}
                />
            }

            {
                token ?
                    <section className="sm:place-self-center grid bg-white sm:rounded-xl  text-center sm:w-[35%] px-8 sm:px-2 sm:py-8 py-12 sm:my-10">
                        <h1 className="text-4xl font-bold">Reset Password</h1>
                        <form className="px-6 sm:px-14 mt-6" onSubmit={handleSubmit(handlePassReset)}>
                            <div className="flex flex-col gap-2 items-start">
                                <label>Enter your New Password</label>
                                <input
                                    type={showPassword ? "text" : 'password'}
                                    required
                                    {...register("password")}
                                    className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full"
                                />

                                {errors.password ? <p className="text-sm text-[#E33629]">{errors.password.message}</p> : ""}

                                <button type="button" className="ml-2" onClick={handleShowPassword}>
                                    {
                                        showPassword ? <i className="bi bi-eye-slash-fill"></i> :
                                            <i className="bi bi-eye-fill" ></i>
                                    }
                                </button>
                                <input
                                    type="text"
                                    hidden
                                    {...register("token")}
                                />
                            </div>

                            <div className="flex flex-col gap-2 items-start mt-4">
                                <label>Confirm Password*</label>
                                <input
                                    type={confirmShowPassword ? "text" : 'password'}
                                    name="confirm_password"
                                    {...register("confirm_password")}
                                    required
                                    className={`rounded-xl border-2 ${errors.confirm_password ? 'border-[#E33629]' : 'border-[#E2E8F0]'} py-2 px-6 w-full`}
                                />

                                {errors.confirm_password ? <p className="text-sm text-[#E33629]">{errors.confirm_password.message}</p> : ""}
                                <button type="button" className="ml-2" onClick={handleShowConfirmPassword}>
                                    {
                                        confirmShowPassword ? <i className="bi bi-eye-slash-fill"></i> :
                                            <i className="bi bi-eye-fill" ></i>
                                    }
                                </button>
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
                                Set New Password
                            </button>

                        </form>




                    </section>
                    :
                    <section className="sm:place-self-center grid bg-white sm:rounded-xl  text-center sm:w-[35%] px-8 sm:px-2 sm:py-8 py-12 sm:my-10">
                        <i className="bi bi-x-circle text-5xl text-red-600"></i>
                        <h2 className="text-2xl mt-4 font-bold">Not ALLowed to View this Page</h2>
                    </section>

            }

        </main>
    );
}
