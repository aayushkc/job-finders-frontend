"use client"

import logo from "../../../public/images/footerLogo.png"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation'
export default function SignInUser() {
    // const [password1, setPassword1] = useState();
    // const [password2, setPassword2] = useState();
    // const [inCorrectPass, setInCorrectPass] = useState();
    
    // const handleFormSubmit = (e) =>{
    //     e.preventDefault();
    //     console.log(password1);
    //     if(password1 != password2){
    //         setInCorrectPass(true)
    //     }else{
    //         setInCorrectPass(false)
    //     }
    // }
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    });
    const [inCorrectPass, setInCorrectPass] = useState(false);
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.password !== formData.confirm_password) {
            setInCorrectPass(true);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/register/job-seeker', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const data = await response.json();
            console.log('User registered successfully:', data);
            router.push('/signin')
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle registration error (e.g., display error message)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
   
    return (
        <main className="signin sm:px-4 grid">
            <section className="sm:place-self-center grid bg-white sm:rounded-xl  text-center sm:w-[30%] py-8 sm:my-10">
            <Link href="/signin" className='place-self-start pl-6'><i className="bi bi-arrow-left text-2xl text-left"></i></Link>
                <div className="flex justify-center">
                    <Image src={logo} alt="logo" />
                </div>
                <h1 className="text-3xl font-bold my-3">Register as User</h1>

                <form className="px-14 mt-4" onSubmit={handleFormSubmit}>
                    <div className="flex flex-col gap-2 items-start">
                        <label>Email*</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full" />
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <label>Username*</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required className="rounded-xl border-2 border-[#E2E8F0] py-2 px-6 w-full" />
                    </div>

                    <div className="flex flex-col gap-2 items-start mt-4">
                        <label>Password*</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange}  required className={`rounded-xl border-2 ${inCorrectPass ? 'border-[#E33629]':'border-[#E2E8F0]' } py-2 px-6 w-full`}/>
                    </div>

                    <div className="flex flex-col gap-2 items-start mt-4">
                        <label>Confirm Password*</label>
                        <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required className={`rounded-xl border-2 ${inCorrectPass ? 'border-[#E33629]':'border-[#E2E8F0]' } py-2 px-6 w-full`}/>
                        {inCorrectPass ? <p className="text-sm text-[#E33629]">Passwords Does Not Match</p> :""}
                    </div>

               

                    <button className="uppercase bg-gurkha-yellow font-bold text-white rounded-xl py-3 px-6 w-full mt-6">Register</button>
                </form>

            </section>
        </main>
    )
}