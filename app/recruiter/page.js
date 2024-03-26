"use client"

import Image from "next/image";
import AdminDashBoardLayout from "../components/DashBoardLayout";
import ImageSkleton from "../../public/profile.png";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from 'next/dynamic';
import PatchRequest from "../api/patchRequest";
import ReactHookFormSelect from "../components/industrychoices";
import { Button, MenuItem, Vis, styled } from "@mui/material";
import GetRequestNoToken from "../api/getRequestNoToken";
import { useRouter } from "next/navigation";
import { APIENDPOINT } from "../api/APIENDPOINT";
import 'react-quill/dist/quill.snow.css';


const ReactQuillEditable = dynamic(
    () => import ('react-quill'),
    { ssr: false }
);

export default function Home() {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm()

  //Imported from MUI fiel upload for the design of upload image field
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  const [profileDetail, setProfileDetails] = useState({})
  const [editName, setEditName] = useState(false)
  const [editEmail, setEditEmail] = useState(false)
  const [editPhone, setEditPhone] = useState(false)
  const [editLocation, setEditLocation] = useState(false)
  const [editUrl, setEditUrl] = useState(false)
  const [editDescription, setEditDescription] = useState(false)
  const [editIndustry, setEditIndustry] = useState(false)
  const [industries, setIndustries] = useState([]);
  const [profilePic, setProfilePic] = useState(false);
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()


  //Set the image files that need to be uploaded
  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

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
      const response = await fetch(`${APIENDPOINT}/recruiter/get-recruiter-profile/`, requestOptions);
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
        router.push("/recruiter/create-profile-details")

      }
      const data = await response.json();
      setProfileDetails(data)
    } catch (error) {
      console.error('There was a problem with the fetch request:', error);
      // Handle error
      return { error: error.message };
    }
  }

  //Get all the available industries required when editing
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

  // Handle Submission of All Fields Expcept for the logo(image) field
  const onSubmit = async (data) => {
    delete data.logo //Delete the logo from the object before submisssion
    console.log(data);
    try {
      const res = await PatchRequest(`/recruiter/view-recruiter-details/${profileDetail[0].id}`, data)
      console.log("This is respooooooooooooooo");
      if (res.detail) {
        console.log(res);
        throw new Error("Cannot Fetch")
      }
      console.log("Helooooooooooooooo");
      setEditName(false)
      setEditEmail(false)
      setEditPhone(false)
      setEditLocation(false)
      setEditDescription(false)
      setEditIndustry(false)
      setEditUrl(false)
      getProfile()
    }
    catch (errors) {
      console.log("ENteerereddddddd Tissssssss");
      console.log(errors);
    }
  }


  // Handles the submission of the logo only
  const onFileSubmit = async (data) => {
    const formData = new FormData()
    formData.append("logo", selectedFile)
    try {
      const res = await PatchRequest(`/recruiter/view-recruiter-details/${profileDetail[0].id}`, formData, true) //True need to be sent to indicate that the recieved data is a file
      console.log("This is respooooooooooooooo");
      if (res.detail) {
        console.log(res);
        throw new Error("Cannot Fetch")
      }
      console.log("Helooooooooooooooo");
      setProfilePic(false)
      getProfile()
    }
    catch (errors) {
      console.log("ENteerereddddddd Tissssssss");
      console.log(errors);
    }
  }


  useEffect(() => {
    getProfile()
    getIndustries()

  }, [])


  //Set the display values of all fields after fetching details from server
  useEffect(() => {
    setValue("name", profileDetail[0]?.name || "");
    setValue("company_email", profileDetail[0]?.company_email || "");
    setValue("location", profileDetail[0]?.location || "");
    setValue("phone", profileDetail[0]?.phone || "");
    setValue("company_url", profileDetail[0]?.company_url || "");
    setValue("industry", industries.filter(indus => indus.title_name === profileDetail[0]?.industry)[0]?.id || '');
    setValue("description", profileDetail[0]?.description || "");
    setValue("logo", profileDetail[0]?.logo || "");
  }, [profileDetail])


  //Code to preview the selected image file on browser
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])




  return (

    <AdminDashBoardLayout>
      {console.log(profileDetail)}
      <div>
        <h1 className="text-3xl font-semibold">Profile</h1>
        <div className="flex justify-between">

          {/* Comapny Name Fields */}
          <div className="w-[75%] mt-8">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="name" className="text-sm">Company Name</label>
              <div className="flex gap-4 items-center mt-1">
                <input type="text" {...register("name", { required: "Name is Required" })} id="name" className={`w-full rounded-xl bg-white py-4 px-3 text-black`} disabled={editName ? false : true} placeholder="Enter Company Name" />
                {
                  editName ?
                    <div className="flex gap-2 font-bold text-[#414C61]">
                      <button type="submit" disabled={!isDirty || !isValid || isSubmitting} className="bg-[#99E8A5] py-2 px-6 rounded-2xl">Edit</button>
                      <button onClick={() => setEditName(false)} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                    </div>
                    :
                    <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditName(true)}></i>
                }

              </div>
            </form>


            {/* Company Email Fields  */}
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="email" className="text-sm">Company Email</label>
              <div className="flex gap-4 items-center mt-1">
                <input type="email" {...register("company_email", { required: "Email is required" })} id="email" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled={editEmail ? false : true} placeholder="Enter Company Email" />
                {
                  editEmail ?
                    <div className="flex gap-2 font-bold text-[#414C61]">
                      <button type="submit" disabled={!isDirty || !isValid || isSubmitting} className="bg-[#99E8A5] py-2 px-6 rounded-2xl">Edit</button>
                      <button onClick={() => setEditEmail(false)} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                    </div>
                    :
                    <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditEmail(true)}></i>
                }

              </div>
            </form>


            {/* Phone Fields */}
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="phone" className="text-sm">Phone</label>
              <div className="flex gap-4 items-center mt-1">
                <input type="number" {...register("phone", { required: "Phone is required" })} id="phone" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled={editPhone ? false : true} placeholder="Enter Company Phone number" />
                {
                  editPhone ?
                    <div className="flex gap-2 font-bold text-[#414C61]">
                      <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={!isDirty || !isValid || isSubmitting}>Edit</button>
                      <button onClick={() => setEditPhone(false)} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                    </div>
                    :
                    <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditPhone(true)}></i>
                }
              </div>
            </form>


          </div>


          {/* Comapany Logo Fields */}
          <form onSubmit={handleSubmit(onFileSubmit)} encType="multipart/form-data" className="text-center">

            <div className="w-[155px] h-[155px] rounded-2xl bg-white/40 flex items-center p-2 justify-center">
              {
                profilePic ?
                  <div className="flex flex-col gap-4">
                    <div className='w-[101px] h-[71px] mb-3'>
                      {
                        //Previews the image
                        selectedFile ? <img src={preview} className='w-full h-full object-contain' /> : ""
                      }
                    </div>

                    <div>

                      {/* Handle the upload changes done in the image field */}
                      <Controller
                        control={control}
                        name="logo"
                        render={({ field: { onChange } }) =>
                          <Button component="label" variant="contained" sx={{ backgroundColor: '#49C199', color: 'white', textTransform: "capitalize", border: "1px solid #475569", width: "max-content" }}>
                            Choose Image
                            <VisuallyHiddenInput type="file" onChange={handleChange} />
                          </Button>}
                      ></Controller>


                    </div>


                  </div>



                  :

                  <img src={profileDetail[0] ? profileDetail[0].logo : ImageSkleton} alt="logo" className="object-contain" />

              }


            </div>
            {
              profilePic ?
                <div className="flex gap-2 flex-col items-center font-bold text-[#414C61] mt-3">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-3 text-sm rounded-2xl" disabled={!isDirty || !isValid || isSubmitting}>Upload Image</button>
                  <button onClick={() => setProfilePic(false)} className="bg-red-400 py-2 px-3 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer text-center" onClick={() => setProfilePic(true)}></i>
            }

          </form>
        </div>

        {/* Company Location Fields */}
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="location" className="text-sm">Location</label>
          <div className="flex gap-4 items-center mt-1">
            <input type="text" {...register("location", { required: "Location is required" })} id="location" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled={editLocation ? false : true} placeholder="Location" />
            {
              editLocation ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={!isDirty || !isValid || isSubmitting}>Edit</button>
                  <button onClick={() => setEditLocation(false)} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditLocation(true)}></i>
            }
          </div>
        </form>

        {/* Comapny Url Fields */}
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="company_url" className="text-sm">Company Website URL</label>
          <div className="flex gap-4 items-center mt-1">
            <input type="text" {...register("company_url", { required: "Url is required" })} id="company_url" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled={editUrl ? false : true} placeholder="URL" />
            {
              editUrl ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={!isDirty || !isValid || isSubmitting}>Edit</button>
                  <button onClick={() => setEditUrl(false)} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditUrl(true)}></i>
            }
          </div>
        </form>


        {/* Comany Industry Fields */}
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>

          <label htmlFor="industry" className="text-sm">Industry</label>
          <div className="flex gap-4 items-center mt-1">
            {
              editIndustry ?
                <ReactHookFormSelect
                  id="idustry-select"
                  name="industry"
                  label="Choose one Industry"
                  control={control}
                  defaultValue={''}
                >
                  {
                    industries?.map(industry => {
                      return <MenuItem key={industry.title} value={industry.id}>
                        {industry.title_name}
                      </MenuItem>
                    })
                  }
                </ReactHookFormSelect>

                :
                <input type="text" value={profileDetail[0]?.industry} id="industry" className="w-full rounded-xl bg-white py-4 px-3 text-black" disabled placeholder="Industry" />
            }

            {
              editIndustry ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={!isDirty || !isValid || isSubmitting}>Edit</button>
                  <button onClick={() => setEditIndustry(false)} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditIndustry(true)}></i>
            }
          </div>
        </form>

        {/* Description Fields */}
        {/* In import FroalaEditorEditable is the editable editor while
              FroalaEditor is a viewable editor */}
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="description" className="text-sm">Description</label>
          <div className="flex gap-4 items-center mt-1">

            {
              editDescription ?
                <Controller
                  name="description"
                  control={control}
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <ReactQuillEditable
                      theme="snow"
                      value={value}
                      onChange={onChange}
                      className="w-full bg-white "
                    />

                  )}
                />

                :
                <div className="w-full rounded-xl bg-white py-4 px-3 text-black min-h-[300px] ">
                   <ReactQuillEditable
                      theme="snow"
                      readOnly
                      className="w-full bg-white min-h-[300px]"
                    />
                </div>

            }

            {
              editDescription ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={!isDirty || !isValid || isSubmitting}>Edit</button>
                  <button onClick={() => setEditDescription(false)} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditDescription(true)}></i>
            }


          </div>
        </form>

      </div>
    </AdminDashBoardLayout>


  );
}

