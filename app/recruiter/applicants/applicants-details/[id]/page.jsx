"use client"

import { Button } from "@mui/material"
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import GetRequestNoToken from "@/app/api/getRequestNoToken";
import Cookies from "js-cookie";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PatchRequest from "@/app/api/patchRequest";

export default function UpdateProfile() {
    const param = useParams()
    const router = useRouter()
    const searchParam = useSearchParams()
    const reqId = searchParam.get("job_req")
    const [profileDetail, setProfileDetails] = useState([])
    const [industries, setIndustries] = useState([]);
    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting}
    } = useForm()
    // Gets all the profileDetail of the request user
    const getProfile = async () => {
        const accessToken = Cookies.get('accessToken');


        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const response = await fetch(`${APIENDPOINT}/recruiter/job-seeker-deatails/${param.id}`, requestOptions);
            if (!response.ok) {
                const data = await response.json();
                
                // Handle non-successful responses
                setProfileDetails(
                    {
                        "id": '',
                    }
                )
            }
            const data = await response.json();
            setProfileDetails(data)
        } catch (error) {
            console.error('There was a problem with the fetch request:', error);
            // Handle error
            return { error: error.message };
        }
    }


    const getIndustries = async () => {

        try {
            const data = await GetRequestNoToken('/industry/')
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            setIndustries(data)
        }
        catch (errors) {
            setIndustries([{ "title": "", "title_name": "" }])
        }


    }

    const onShortListSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await PatchRequest(`/recruiter/edit-recruiter-job-requests/${reqId}`, {"status":"0"})
            
            if (res.detail) {
                
                throw new Error("Cannot Fetch")
            }
           

            router.back()
            
        }
        catch (errors) {
            toast.error( 'An error Occured. Try again Later.', {
                position: "bottom-right",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                });
            
        }
    }

    const onRejectSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await PatchRequest(`/recruiter/edit-recruiter-job-requests/${reqId}`, {"status":"1"})
            
            if (res.detail) {
               
                throw new Error("Cannot Fetch")
            }
            

            router.back()
            
        }
        catch (errors) {
            toast.error( 'An error Occured. Try again Later.', {
                position: "bottom-right",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                });
            
        }
    }

    //Set the display values of all fields after fetching details from server

    useEffect(() => {
        getIndustries()
        getProfile()
    }, [])


    return (
        <>
            
            <AdminDashBoardLayout>

                <section className="">
                    <div className="">
                        <h2 className="font-bold text-3xl text-[#414C61] bg-[#FFF7E2] px-4 py-2 rounded-2xl max-w-max">Applicant Details</h2>


                        <button className="bg-[#FAFAFA] py-5 px-3 font-bold text-lg flex gap-3 items-center rounded-xl my-6">
                            <i className="bi bi-download text-[#FFC033]"></i>
                            <a href={profileDetail.resume} className="text-[#4F5052]">Download Resume</a>
                        </button>

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Personal Information</h2>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 items-start mt-6">
                                <div className="w-24  sm:basis-[20%] grid">

                                    <div className='place-self-center'>
                                        <img src={profileDetail ? profileDetail?.profilePic : "/images/defaultProfile.png"} alt="profile" className='w-24 object-cover rounded-md shadow-md' />
                                    </div>
                                </div>

                                <div className="flex gap-10 flex-col sm:flex-row sm:basis-[80%]">
                                    <div className="mt-4 sm:mt-0 sm:w-[50%]">
                                        <div className="flex flex-col">
                                            <label htmlFor="first_name" className="text-sm">First Name</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="first_name" value={profileDetail.first_name} disabled />
                                        </div>
                                        <div className="flex flex-col  mt-6">
                                            <label htmlFor="last_name" className="text-sm">Last Name</label>
                                            <input disabled className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="last_name" value={profileDetail.last_name} />
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="phone" className="text-sm">Phone Number</label>
                                            <input disabled className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" type="number" id="phone" value={profileDetail.phone} />
                                        </div>
                                    </div>

                                    <div className="mt-4 sm:mt-0 sm:w-[50%]">
                                        <div className="flex flex-col">
                                            <label htmlFor="middle_name" className="text-sm">Middle Name</label>
                                            <input disabled className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="middle_name" value={profileDetail.middle_name} />
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="location" className="text-sm">Location</label>
                                            <input disabled className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="location" value={profileDetail.location} />
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="linkedin_url" className="text-sm">Linkedin URL</label>
                                            <input disabled className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="linkedin_url" value={profileDetail.linkedin_url} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">Date of Birth</h2>

                            <div style={{ marginBottom: 16, marginTop: 6 }} className="flex gap-4 flex-wrap">

                                <p className="bg-white text-black  p-4 font-lightbold rounded">{profileDetail.dob}</p>

                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">Skills</h2>

                            <div style={{ marginBottom: 16, marginTop: 6 }} className="flex gap-4 flex-wrap">
                                {profileDetail.skills?.map((data, index) => {
                                    
                                    return <p className="bg-white text-black font-light p-2 rounded-xl" key={index}>{data.title}</p>
                                })}

                            </div>
                        </div>


                        <hr className="my-8"></hr>
                        <div className="flex flex-col sm:flex-row w-full items-center gap-4 justify-end">
                        <form className="" onSubmit={onShortListSubmit}>
                            <button className="text-white font-bold bg-gurkha-yellow py-2 px-12 rounded-2xl" type="submit" disabled={isSubmitting}>Shortlist</button>

                        </form>

                        <form className="" onSubmit={onRejectSubmit}>
                            <button className="text-white font-bold bg-red-500 py-2 px-12 rounded-2xl" type="submit" disabled={isSubmitting}>Reject</button>

                        </form>

                        </div>
                       
                    </div>
                </section>
            </AdminDashBoardLayout>
            <ToastContainer />
        </>


    )
}

