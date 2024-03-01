"use client"

import Image from "next/image";
import AdminDashBoardLayout from "../components/DashBoardLayout";
import ImageSkleton from "../../public/profile.png";
import { HiOutlinePencil } from "react-icons/hi";
import ProtectedPage from "../utils/auth";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from 'next/dynamic';
import PatchRequest from "../api/patchRequest";
const FroalaEditor = dynamic(
  () => import('react-froala-wysiwyg'),
  { ssr: false }
);
export default function Home() {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm()

  const [profileDetail, setProfileDetails] = useState({})
  const [descriptionData, setDescriptionData] = useState()
  const [editName, setEditName] = useState(false)
  const getProfile = async () => {
    const accessToken = Cookies.get('accessToken');

    // Default options for the fetch request
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include the bearer token in the Authorization header
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/recruiter/get-recruiter-profile/', requestOptions);
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
        // Handle non-successful responses
        setProfileDetails(
          {
            "industry": "",
            "name": "",
            "logo": "",
            "location": "",
            "description": "",
            "phone": "",
            "company_size": "",
            "company_email": "",
            "company_url": "",
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

  const handleModelChange = (e) => {
    setDescriptionData(e.target)

  }
  const config = {
    events: {
      initialized() {

        // calls initialized before editor has finished initializing

        this.edit.off()

      },
    },
  };

  const onSubmit = async (data) =>{
    console.log(data);
    try {
      const res = await PatchRequest(`/recruiter/view-recruiter-details/${profileDetail[0].id}`, data)
      console.log("This is respooooooooooooooo");
      if (res.detail) {
          throw new Error("Cannot Fetch")
      }
      console.log("Helooooooooooooooo");
      setEditName(false)
     getProfile()
  }
  catch (errors) {
      console.log("ENteerereddddddd Tissssssss");
      console.log(errors);
  }
  }
  useEffect(() => {
    getProfile()

  }, [])

  useEffect(() =>{
    setValue("name", profileDetail[0]?.name || "")
  },[profileDetail])

  return (

    <AdminDashBoardLayout>
      {console.log(profileDetail)}

      <div>
        <h1 className="text-3xl font-semibold">Profile</h1>
        <div className="flex justify-between gap-8">


          <div className="w-[80%] mt-8">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="name" className="text-sm">Company Name</label>
              <div className="flex gap-4 items-center mt-1">
                <input  type="text" {...register("name", {required:"Name is Required"})} id="name" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled={editName ? false : true} placeholder="Enter Company Name" />
                {
                  editName ?
                    <div className="flex gap-2">
                      <button type="submit">Edit</button>
                      <button onClick={() => setEditName(false)}>Cancel</button>
                    </div>
                    :
                    <i className="bi bi-pen-fill text-lg text-[#A0A3BD]" onClick={() => setEditName(true)}></i>
                }

              </div>
            </form>

            <div className="mt-6">
              <label htmlFor="email" className="text-sm">Company Email</label>
              <div className="flex gap-4 items-center mt-1">
                <input type="email" value={profileDetail[0]?.company_email} id="email" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled placeholder="Enter Company Email" />
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD]"></i>
              </div>
            </div>


            <div className="mt-6">
              <label htmlFor="phone" className="text-sm">Phone</label>
              <div className="flex gap-4 items-center mt-1">
                <input type="number" value={profileDetail[0]?.phone} id="phone" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled placeholder="Enter Company Phone number" />
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD]"></i>
              </div>
            </div>


          </div>

          <div className="w-[3rem] h-[3rem] rounded-xl">
            <img src={profileDetail[0] ? profileDetail[0].logo : ImageSkleton} alt="logo" className="object-fit" />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="location" className="text-sm">Location</label>
          <div className="flex gap-4 items-center mt-1">
            <input type="text" value={profileDetail[0]?.location} id="location" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled placeholder="Location" />
            <i className="bi bi-pen-fill text-lg text-[#A0A3BD]"></i>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="company_url" className="text-sm">Company Website URL</label>
          <div className="flex gap-4 items-center mt-1">
            <input type="text" value={profileDetail[0]?.company_url} id="company_url" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled placeholder="URL" />
            <i className="bi bi-pen-fill text-lg text-[#A0A3BD]"></i>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="industry" className="text-sm">Industry</label>
          <div className="flex gap-4 items-center mt-1">
            <input type="text" value={profileDetail[0]?.industry} id="industry" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled placeholder="Industry" />
            <i className="bi bi-pen-fill text-lg text-[#A0A3BD]"></i>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="text-sm">Description</label>
          <div className="flex gap-4 items-center mt-1">
            {/* <textarea value={profileDetail[0]?.description} id="description"  className="rounded-xl bg-white py-4 px-3 text-black"> */}
            <FroalaEditor
              model={profileDetail[0]?.description}
              config={config}
              onModelChange={handleModelChange}
              tag="textarea"

            />

            {/* </textarea> */}
          </div>
        </div>

      </div>
    </AdminDashBoardLayout>


  );
}

