"use client"


import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { useRouter } from 'next/navigation'
import dayjs from "dayjs";
import DialogBox from "@/app/components/sucessbox";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { ClipLoader } from "react-spinners";
import PhoneInput from 'react-phone-number-input'
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import jwt from 'jsonwebtoken';
import { useAuth } from "@/app/utils/checkIsLoggedIn";
export default function SignInUser() {

    const router = useRouter()
    const { setIsLoggedIn } = useAuth()

    const [isNextClicked, setIsNextClicked] = useState(true)
    const [meeting_date, setDate] = useState(new Date());
    const [meeting_time, setTime] = useState();
    const [registrationError, setRegistrationError] = useState([])
    const [errorStatus, setErrorStatus] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)
    const [phone, setPhone] = useState();
    const [emailError, setEmailError] = useState(null)
    const [nameError, setNameError] = useState(null)
    const [phoneError, setPhoneError] = useState(null)
    const [formError, setFormError] = useState(false)
    const [formData, setFormData] = useState(
        {
            "email": "",
            "name": "",
            "phone_number": "",
            "meeting_date": "",
            "meeting_time": ""
        }
    );
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

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
            .oneOf([Yup.ref("password")], "Passwords do not match"),
        phone_number: Yup.string().required("Phone number is required")
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid },
    } = useForm({

        resolver: yupResolver(formSchema)
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNextClick = (e) => {
        e.preventDefault();
        setFormData(prevData => ({ ...prevData, 'phone_number': phone }))
        setFormError(false)
        setEmailError(null)
        setNameError(null)
        setPhoneError(null)

        if (formData.email && formData.name && phone) {
            setIsNextClicked(true)
        } else if (!formData.email) {
            setEmailError("Invalid Email Address")
        } else if (!formData.name) {
            setNameError("Invalid Name")
        } else if (!phone) {
            setPhoneError("Invalid Phone Number")
        } else if (!formData.email && !formData.name && phone) {
            setFormError(true)
        } else {
            return;
        }
    }

    const handleRegisterClick = async (e) => {
        e.preventDefault();

        setIsButtonDisabled(true)
        setRegistrationSuccess(false)
        setErrorStatus(false)
        console.log(formData);

        try {
            const response = await fetch(`${APIENDPOINT}/generate-recruiter-lead`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const error = await response.json()
                console.log(error);

                setRegistrationError(error)

                setErrorStatus(true)
                setIsButtonDisabled(false)
                throw new Error('Failed to register');
            }

            const data = await response.json();

            setRegistrationSuccess(true)
        } catch (error) {
            console.error('Error registering user:', error);
            setIsButtonDisabled(false)
            setErrorStatus(true)
            // Handle registration error (e.g., display error message)
        }

    }

    const handleFormSubmit = async (data) => {
        console.log(data);

        try {
            const response = await fetch(`${APIENDPOINT}/auth/register/recruiter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();

                setRegistrationError(error)

                setErrorStatus(true)
                setIsButtonDisabled(false)
                throw new Error('Failed to register');
            }

            const res = await response.json();
            if (res.userToken) {
                const decodedToken = jwt.decode(res.userToken.access); // Decode the access token

                const userId = decodedToken.user_id;
                console.log(res);
                
                setIsLoggedIn({ 'logInStatus': true, 'username': '' })

                Cookies.set('accessToken', res.userToken.access, { expires: 1 });
                Cookies.set('userId', userId, { expires: 1 });
                Cookies.set('isSeeker', false, { expires: 1 })
                Cookies.set("isLoggedIn", true, { expires: 1 })
                Cookies.set("hasUserBeenActivated", false)
                router.push('/recruiter');
            }
        } catch (error) {
            console.error('Error registering recruiter:', error);
        }
    };

    const handleDate = (e) => {
        setFormData(prevState => ({
            ...prevState,
            meeting_date: e.format("YYYY-MM-DD")
        }));
        setDate(e);
    }

    const handleTime = (t) => {
        const timeFormat = `${t.$H}:${t.$m}`
        const ti = t.format("HH:MM:SS")

        setFormData(prevState => ({
            ...prevState,
            meeting_time: timeFormat
        }));
        setTime(timeFormat)
    }


    useEffect(() => {
        setRegistrationSuccess(false)
        setErrorStatus(false)
    }, [])

    const todayDate = (date) => date.isSame(new Date(), 'day');
    return (
        <main className="signin grid">
            {
                registrationSuccess && <DialogBox
                    url={"/signin"}
                    goToPageName={"Back"}
                    dialogHeading={"Successfully Sent Email"}
                    dialogText={"Our team will reach out to you through. Please Check your email"}
                    success={true}
                />
            }

            {
                errorStatus && <DialogBox
                    url={"/register-as-recruiter"}
                    dialogHeading={"Error Encountered"}
                    dialogText={errorStatus && Object.entries(registrationError).map(([key, value]) => <li key={key} className="text-red-900 capitalize font-bold">{value}</li>)}
                />
            }

            <section className="sm:place-self-center grid bg-[#F3F4F8] sm:bg-white sm:rounded-xl  text-center sm:w-[30%] py-8 sm:my-10">
                {!isNextClicked ? <i className="bi bi-arrow-left text-2xl text-left place-self-start pl-6 cursor-pointer" onClick={() => setIsNextClicked(false)}></i> : <Link href="/signin" className='place-self-start pl-6'><i className="bi bi-arrow-left text-2xl text-left"></i></Link>}
                <div className="flex justify-center">

                    <Image src="/images/Footerlogo.png" alt="logo" width="102" height="42" />
                </div>
                <h1 className="text-xl sm:text-3xl font-bold my-3">Register as Recruiter</h1>
                {/* <div className="flex gap-2 justify-center items-center mt-4">
                    <div className={`rounded-2xl ${isNextClicked ? 'bg-[#D9D9D9]' : 'bg-gurkha-yellow'} w-[33px] h-[6px]`}></div>
                    <div className={`rounded-2xl ${isNextClicked ? 'bg-gurkha-yellow' : 'bg-[#D9D9D9]'}  w-[33px] h-[6px]`}></div>
                </div> */}
                <form className="px-4 sm:px-14 mt-4" onSubmit={handleSubmit(handleFormSubmit)}>
                    {errorStatus && Object.entries(registrationError).map(([key, value]) => <li key={key} className="text-red-900 capitalize font-bold">{value}</li>)}
                    {
                        !isNextClicked ?
                            <>
                                <em className="text-lg font-bold">Choose Meeting date and Meeting Time to verify profile.</em>

                                <LocalizationProvider dateAdapter={AdapterDayjs} >

                                    <DateCalendar
                                        className="bg-white text-black m-0 rounded-xl border-2 border-black"
                                        disablePast={true}
                                        onChange={handleDate}
                                        defaultValue={dayjs().add(1, 'day')}
                                        shouldDisableDate={todayDate}
                                    />


                                    <div className="mt-8 mb-8 w-[90%]">
                                        <label >Select Time*</label>
                                        <DigitalClock
                                            className="bg-white text-black rounded xl mt-10"
                                            onChange={handleTime}
                                            skipDisabled
                                            minTime={dayjs('2022-04-17T09:00')}
                                            maxTime={dayjs('2022-04-17T19:00')} />
                                    </div>

                                </LocalizationProvider>

                            </>
                            :
                            <>

                                <div className="flex flex-col gap-2 items-start">
                                    <label>Company Email*</label>

                                    {/* Original code for registration
                                    Required later */}
                                    {/* <input type="email" name="email" defaultValue={formData.email} onChange={handleChange} required className={`rounded-xl py-2 px-6 w-full ${emailError ? "border-2 border-red-600" : "border-2 border-[#E2E8F0]"} ${formError ? "border-2 border-red-600" : "border-2 border-[#E2E8F0]"}`} />
                                    {emailError ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{emailError}</p> : ""} */}

                                    {/* Temp Code for validation using RHF & YUP */}
                                    {/* Needs to be removed later */}
                                    <input
                                        type="email"
                                        name="email"
                                        {...register("email")}
                                        required
                                        className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full"
                                    />

                                    {errors.email ? <p className="text-sm text-[#E33629]">{errors.email.message}</p> : ""}
                                </div>

                                <div className="flex flex-col gap-2 items-start">
                                    <label>Company Name*</label>
                                    {/* <input type="text" name="name" defaultValue={formData.name} onChange={handleChange} required className={`rounded-xl py-2 px-6 w-full ${nameError ? "border-2 border-red-600" : "border-2 border-[#E2E8F0]"} ${formError ? "border-2 border-red-600" : "border-2 border-[#E2E8F0]"}`} />
                                    {nameError ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{nameError}</p> : ""} */}

                                    <input
                                        type="text"
                                        name="username"
                                        {...register("username")}
                                        required
                                        className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full"
                                    />
                                    {errors.username ? <p className="text-sm text-[#E33629]">{errors.username.message}</p> : ""}
                                </div>

                                <div className="flex flex-col gap-2 items-start mt-4">
                                    <label>Password*</label>
                                    <input
                                        type="password"
                                        name="password"
                                        {...register("password")}
                                        required
                                        className={`rounded-xl border-2 ${errors.confirm_password ? 'border-[#E33629]' : 'border-[#E2E8F0]'} py-2 px-6 w-full`}
                                    />
                                    {errors.password ? <p className="text-sm text-[#E33629]">{errors.password.message}</p> : ""}
                                </div>

                                <div className="flex flex-col gap-2 items-start mt-4">
                                    <label>Confirm Password*</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        {...register("confirm_password")}
                                        required
                                        className={`rounded-xl border-2 ${errors.confirm_password ? 'border-[#E33629]' : 'border-[#E2E8F0]'} py-2 px-6 w-full`}
                                    />

                                    {errors.confirm_password ? <p className="text-sm text-[#E33629]">{errors.confirm_password.message}</p> : ""}
                                </div>

                                <div className="flex flex-col gap-2 items-start">
                                    <label>Phone Number*</label>
                                    <Controller
                                        control={control}
                                        name="phone_number"
                                        rules={{ required: "This field is Required" }}
                                        render={({ field }) => (
                                            <PhoneInput
                                                {...field}
                                                placeholder="Enter phone number"
                                                international
                                                defaultCountry="NP"
                                                countryCallingCodeEditable={false}
                                                className={`rounded-xl p-2 bg-white w-full ${errors.phone_number ? "border-2 border-red-600" : "border-2 border-[#E2E8F0]"} ${formError ? "border-2 border-red-600" : "border-2 border-[#E2E8F0]"}`}
                                            />
                                        )}
                                    />
                                    {errors.phone_number ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.phone_number.message}</p> : ""}
                                    {/* {phoneError ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{phoneError}</p> : ""} */}
                                </div>
                            </>
                    }



                    {
                        isNextClicked ?
                            <button
                                className={`uppercase font-bold flex justify-center items-center gap-4  rounded-xl py-3 px-6 w-full mt-6 ${isButtonDisabled ? 'bg-[#F3F4F8] text-black cursor-not-allowed' : 'bg-gurkha-yellow text-white'}`}
                                // onClick={handleRegisterClick}
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting && <ClipLoader
                                    color={"#FFFFFF"}
                                    loading={true}
                                    size={20}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                                }
                                Register

                            </button>
                            :
                            <button className="uppercase bg-gurkha-yellow font-bold text-white rounded-xl py-3 px-6 w-full mt-6" onClick={handleNextClick}>Next</button>
                    }

                </form>

            </section>
        </main>
    )
}