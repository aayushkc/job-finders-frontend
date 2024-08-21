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
import { useAuth } from "@/app/utils/checkIsLoggedIn";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { ClipLoader } from "react-spinners";
import PhoneInput from 'react-phone-number-input'

export default function SignInUser() {

    const router = useRouter()
    const { isLoggedIn } = useAuth();
    const [isNextClicked, setIsNextClicked] = useState(false)
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
            "phone_number":"",
            "meeting_date": "",
            "meeting_time": ""
        }
    );
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleNextClick = (e) => {
        e.preventDefault();
        setFormData(prevData => ({...prevData, 'phone_number':phone}))
        setFormError(false)
        setEmailError(null)
        setNameError(null)
        setPhoneError(null)
        
        if(formData.email && formData.name && phone){
            setIsNextClicked(true)
        }else if(!formData.email){
            setEmailError("Invalid Email Address")
        }else if(!formData.name){
            setNameError("Invalid Name")
        }else if(!phone){
            setPhoneError("Invalid Phone Number")
        }else if(!formData.email && !formData.name && phone){
            setFormError(true)
        }else{
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

    useEffect(() =>{
        if(isLoggedIn) router.back()
      },[isLoggedIn])
    
    useEffect(()=>{
        setRegistrationSuccess(false)
        setErrorStatus(false)
    },[])

    const todayDate = (date) =>date.isSame(new Date(), 'day');
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
                {isNextClicked ? <i className="bi bi-arrow-left text-2xl text-left place-self-start pl-6 cursor-pointer" onClick={() => setIsNextClicked(false)}></i> : <Link href="/signin" className='place-self-start pl-6'><i className="bi bi-arrow-left text-2xl text-left"></i></Link>}
                <div className="flex justify-center">

                    <Image src="/images/Footerlogo.png" alt="logo" width="102" height="42" />
                </div>
                <h1 className="text-xl sm:text-3xl font-bold my-3">Register as Recruiter</h1>
                <div className="flex gap-2 justify-center items-center mt-4">
                    <div className={`rounded-2xl ${isNextClicked ? 'bg-[#D9D9D9]' : 'bg-gurkha-yellow'} w-[33px] h-[6px]`}></div>
                    <div className={`rounded-2xl ${isNextClicked ? 'bg-gurkha-yellow' : 'bg-[#D9D9D9]'}  w-[33px] h-[6px]`}></div>
                </div>
                <form className="px-4 sm:px-14 mt-4">
                    {errorStatus && Object.entries(registrationError).map(([key, value]) => <li key={key} className="text-red-900 capitalize font-bold">{value}</li>)}
                    {
                        isNextClicked ?
                            <>
                            <em className="text-lg font-bold">Choose Meeting date and Meeting Time to verify profile.</em>

                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    
                                    <DateCalendar 
                                            className="bg-white text-black m-0 rounded-xl border-2 border-black" 
                                            disablePast={true} 
                                            onChange={handleDate}
                                            defaultValue={dayjs().add(1,'day')} 
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
                                    <input type="email" name="email" defaultValue={formData.email} onChange={handleChange} required className={`rounded-xl py-2 px-6 w-full ${emailError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"} ${formError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"}`} />
                                    {emailError ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{emailError}</p> : ""}
                                </div>

                                <div className="flex flex-col gap-2 items-start">
                                    <label>Company Name*</label>
                                    <input type="text" name="name" defaultValue={formData.name} onChange={handleChange} required className={`rounded-xl py-2 px-6 w-full ${nameError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"} ${formError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"}`}/>
                                    {nameError ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{nameError}</p> : ""}
                                </div>
{/* 
                                <div className="flex flex-col gap-2 items-start">
                                    <label>Phone Number*</label>
                                    <input type="text" name="phone" defaultValue={formData.phone} onChange={handleChange} required className={`rounded-xl py-2 px-6 w-full ${phoneError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"} ${formError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"}`}/>
                                    {phoneError ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{phoneError}</p> : ""}
                                </div> */}
                                <div className="flex flex-col gap-2 items-start">
                                <label>Phone Number*</label>
                                 <PhoneInput
                                        placeholder="Enter phone number"
                                        international
                                        value={phone}
                                        onChange={setPhone}
                                        defaultCountry="NP"
                                        countryCallingCodeEditable={false}
                                        className={`rounded-xl p-2 bg-white w-full ${phoneError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"} ${formError ? "border-2 border-red-600" :"border-2 border-[#E2E8F0]"}`} />
                                        {phoneError ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{phoneError}</p> : ""}
                                 </div>
                            </>
                    }



                    {
                        isNextClicked ? 
                        <button 
                            className={`uppercase font-bold flex justify-center items-center gap-4  rounded-xl py-3 px-6 w-full mt-6 ${isButtonDisabled ? 'bg-[#F3F4F8] text-black cursor-not-allowed' : 'bg-gurkha-yellow text-white'}`} 
                            onClick={handleRegisterClick}
                            disabled={isButtonDisabled}
                            >
                               {isButtonDisabled && <ClipLoader
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