"use client"

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
import PhoneInput from "react-phone-number-input"
import { useAuth } from "../utils/checkIsLoggedIn";

const ReactQuillEditable = dynamic(
    () => import ('react-quill'),
    { ssr: false }
);

 //React Quill Modules
 const modules = {
  toolbar: false

}
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


export default function Home() {
 
  const router = useRouter()
  const {
    handleSubmit,
    register,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm()

  const {setIsLoggedIn} = useAuth()

  const [profileDetail, setProfileDetails] = useState({
    "industry": "",
    "name": "",
    "logo": "",
    "location": "",
    "description": "",
    "phone": "",
    "company_size": "",
    "company_email": "",
    "company_url": "",
  })
  const [editButtonStatus, setEditButtonStatus] = useState(
                                                            {
                                                              'editName': false, 
                                                              'editEmail':false,
                                                              'editPhone':false, 
                                                              'editLocation':false, 
                                                              'editUrl':false,
                                                              'editDescription':false,
                                                              'editIndustry':false
                                                            })
  const [industries, setIndustries] = useState([]);
  const [profilePic, setProfilePic] = useState(false);
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const accessToken = Cookies.get('accessToken');

  //Set the image files that need to be uploaded
  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  // Gets all the profileDetail of the request user
  const getProfile = async () => {
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
        router.push("/recruiter/create-profile-details")
        return;

      }
      const data = await response.json();
      setIsLoggedIn((prevState) => {return {...prevState, 'username':`${data[0].name}`}})
      setProfileDetails(data)
    } catch (error) {
      console.error('There was a problem with the fetch request:', error);
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
    
    try {
      const res = await PatchRequest(`/recruiter/view-recruiter-details/${profileDetail[0].id}`, data)
    
      if (res.status === 400) {
        const data = await res.json()
        for (const error in data){  
            setError(error, {type:'custom', message:data[error]}, {shouldFocus:true})
        }
        return;
      }
  
      setEditButtonStatus(
        {
          editName:false,
          editEmail:false,
          editIndustry:false,
          editDescription:false,
          editLocation:false,
          editPhone:false,
          editUrl:false
        }
      )
      getProfile()
    }
    catch (errors) {
   
      console.log(errors);
    }
  }


  // Handles the submission of the logo only
  const onFileSubmit = async (data) => {
    const formData = new FormData()
    console.log(data);
    formData.append("logo", selectedFile)
    try {
      const res = await PatchRequest(`/recruiter/view-recruiter-details/${profileDetail[0].id}`, formData, true) //True need to be sent to indicate that the recieved data is a file
      
      if (res.detail) {
       
        throw new Error("Cannot Fetch")
      }
     
      setProfilePic(false)
      getProfile()
    }
    catch (errors) {
    
      console.log(errors);
    }
  }


  useEffect(() => {
    if(accessToken){
      getProfile()
      getIndustries()
  
    }else{
      return;
    }
    
  }, [])


  //Set the display values of all fields after fetching details from server
  useEffect(() => {
    setValue("name", profileDetail[0]?.name || "");
    setValue("company_email", profileDetail[0]?.company_email || "");
    setValue("location", profileDetail[0]?.location || "");
    setValue("phone_number", profileDetail[0]?.phone_number || "");
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
  
      <div>
        <h1 className="text-3xl font-semibold text-center sm:text-left">Profile</h1>
        <div className="flex flex-col sm:flex-row sm:justify-between">

          {/* Comapny Name Fields */}
          <div className="sm:w-[75%] mt-8 order-last sm:order-first">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="name" className="text-sm">Company Name</label>
              <div className="flex gap-4 items-start sm:items-center mt-1 flex-col sm:flex-row">
                <input type="text" {...register("name", { required: "Name is Required" })} id="name" className={`w-full rounded-xl bg-white py-4 px-3 text-black`} readOnly={!editButtonStatus.editName} placeholder="Enter Company Name" />
                {
                  editButtonStatus.editName ?
                    <div className="flex gap-2 font-bold text-[#414C61]">
                      <button type="submit" disabled={isSubmitting} className="bg-[#99E8A5] py-2 px-6 rounded-2xl">Edit</button>
                      <button onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editName:false}} )} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                    </div>
                    :
                    <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editName:true}} )}></i>
                }

              </div>
            </form>


            {/* Company Email Fields  */}
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="email" className="text-sm">Company Email</label>
              <div className="flex gap-4 items-start sm:items-center mt-1 flex-col sm:flex-row">
                <input type="email" {...register("company_email", { required: "Email is required" })} id="email" className="w-full rounded-xl bg-white py-4 px-3 text-black" readOnly={!editButtonStatus.editEmail} placeholder="Enter Company Email" />
                {
                  editButtonStatus.editEmail ?
                    <div className="flex gap-2 font-bold text-[#414C61]">
                      <button type="submit" disabled={isSubmitting} className="bg-[#99E8A5] py-2 px-6 rounded-2xl">Edit</button>
                      <button onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editEmail:false}} )} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                    </div>
                    :
                    <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editEmail:true}} )}></i>
                }

              </div>
            </form>


            {/* Phone Fields */}
            <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="phone" className="text-sm">Phone</label>
              <div className="flex gap-4 items-start sm:items-center mt-1 flex-col sm:flex-row">
                <Controller
                        control={control}
                        name="phone_number"
                        rules={{ required: "This field is Required" }}
                        render={({ field}) => (
                        <PhoneInput
                            {...field}
                            placeholder="Enter phone number"
                            international
                            defaultCountry="NP"
                            countryCallingCodeEditable={false}
                            readOnly={!editButtonStatus.editPhone}
                            className={`w-full rounded-xl bg-white py-4 px-3 text-black`} 
                            />
                        )}
                    />
                {
                  editButtonStatus.editPhone ?
                    <div className="flex gap-2 font-bold text-[#414C61]">
                      <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={isSubmitting}>Edit</button>
                      <button onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editPhone:false}} )} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                    </div>
                    :
                    <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editPhone:true}} )}></i>
                }
              </div>
              {errors.phone_number ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.phone_number.message}</p> : ""}
            </form>


          </div>


          {/* Comapany Logo Fields */}
          <form onSubmit={handleSubmit(onFileSubmit)} encType="multipart/form-data" className="mt-6 sm:mt-0 text-center flex flex-col items-center">

            <div className="w-[155px] h-[155px] rounded-2xl bg-white/40 flex items-center p-2 justify-center">
              {
                profilePic ?
                  <div className="flex flex-col gap-4">
                    <div className='w-[101px] h-[71px] mb-3 felx'>
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
                            Choose Compny logo
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
                  <button type="submit" className="bg-[#99E8A5] py-2 px-3 text-sm rounded-2xl" disabled={isSubmitting}>Upload Image</button>
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
          <div className="flex gap-4 items-start sm:items-center mt-1 flex-col sm:flex-row">
            <input type="text" {...register("location", { required: "Location is required" })} id="location" className="w-full rounded-xl bg-white py-4 px-3 text-black" readOnly={!editButtonStatus.editLocation} placeholder="Location" />
            {
              editButtonStatus.editLocation ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={isSubmitting}>Edit</button>
                  <button onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editLocation:false}} )} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editLocation:true}} )}></i>
            }
          </div>
        </form>

        {/* Comapny Url Fields */}
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="company_url" className="text-sm">Company Website URL</label>
          <div className="flex gap-4 items-start sm:items-center mt-1 flex-col sm:flex-row">
            <input 
                type="text" 
                {...register("company_url", { 
                            pattern:{
                                value:/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
                                message:"Url must be in the form http(s)://www.example.com"
                            }
                                
                            })}
                 id="company_url" 
                 className="w-full rounded-xl bg-white py-4 px-3 text-black" 
                 readOnly={!editButtonStatus.editUrl}
                 placeholder="URL" />
            {
              editButtonStatus.editUrl ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={isSubmitting}>Edit</button>
                  <button onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editUrl:false}} )} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editUrl:true}} )}></i>
            }
            
          </div>
          
          {errors.company_url ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.company_url.message}</p> : ""}
        </form>


        {/* Comany Industry Fields */}
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>

          <label htmlFor="industry" className="text-sm">Industry</label>
          <div className="flex gap-4 items-start sm:items-center mt-1 flex-col sm:flex-row">
            {
              editButtonStatus.editIndustry ?
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
              editButtonStatus.editIndustry ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={isSubmitting}>Edit</button>
                  <button onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editIndustry:false}} )} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editIndustry:true}} )}></i>
            }
          </div>
        </form>

        {/* Description Fields */}
    
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="description" className="text-sm">Description</label>
          <div className="flex gap-4 items-start sm:items-center mt-1 flex-col sm:flex-row">

            {
              editButtonStatus.editDescription ?
                <Controller
                  name="description"
                  control={control}
                  defaultValue={""}
                  render={({ field: { onChange, value } }) => (
                    <ReactQuillEditable
                      theme="snow"
                      value={value}
                      onChange={onChange}
                      className="w-full bg-white min-h-[300px] read-quill"
                    />

                  )}
                />

                :
                <div className="w-full rounded-xl bg-white py-4 px-3 text-black min-h-[300px] ">
                   <ReactQuillEditable
                      theme="snow"
                      readOnly
                      value={profileDetail[0]?.description}
                      modules={modules}
                      className="w-full bg-white min-h-[300px] read-quill"
                    />
                </div>

            }

            {
              editButtonStatus.editDescription ?
                <div className="flex gap-2 font-bold text-[#414C61]">
                  <button type="submit" className="bg-[#99E8A5] py-2 px-6 rounded-2xl" disabled={isSubmitting}>Edit</button>
                  <button onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editDescription:false}} )} className="bg-red-400 py-2 px-6 rounded-2xl">Cancel</button>
                </div>
                :
                <i className="bi bi-pen-fill text-lg text-[#A0A3BD] cursor-pointer" onClick={() => setEditButtonStatus((prevState) => {return {...prevState, editDescription:true}} )}></i>
            }


          </div>
        </form>

      </div>
    </AdminDashBoardLayout>


  );
}

