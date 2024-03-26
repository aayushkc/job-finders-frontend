"use client"


import AdminDashBoardLayout from "../../components/DashBoardLayout/index";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from 'next/dynamic';
import { Autocomplete, Button, MenuItem, TextField, Vis, selectClasses, styled } from "@mui/material";
import GetRequestNoToken from "../../api/getRequestNoToken";
import PostFormWithToken from "@/app/api/postFormWithToken";
import { useRouter } from "next/navigation";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { ClipLoader } from "react-spinners";

import 'react-quill/dist/quill.snow.css';


const ReactQuillEditable = dynamic(
    () => import ('react-quill'),
    { ssr: false }
);

export default function CreateProfileDetails() {
    const router = useRouter()
    const [industries, setIndustries] = useState([]);
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    const {
        handleSubmit,
        register,
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


    //Set the image files that need to be uploaded
    const handleChange = (e) => {
        setSelectedFile(e.target.files[0]);
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

    const onSubmit = async (data) => {
        const formData = new FormData()
        console.log(data);
        formData.append("name", data.name)
        formData.append("company_url", data.company_url)
        formData.append("company_size", data.company_size)
        formData.append("location", data.location)
        formData.append("phone", data.phone)
        formData.append("company_email", data.company_email)
        formData.append("industry", data.industry)
        formData.append("description", data.description)
        formData.append("logo", selectedFile)
        console.log(formData);
        try {
            const res = await PostFormWithToken(`/recruiter/recruiter-details/`, formData)
            console.log("This is respooooooooooooooo");
            if (res.detail) {
                console.log(res);
                throw new Error("Cannot Fetch")
            }
            console.log("Helooooooooooooooo");
            router.push("/recruiter")

        }
        catch (errors) {
            console.log("ENteerereddddddd Tissssssss");
            console.log(errors);
        }
    }



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

    async function chekcProfile(){
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
          if (response.ok) {
            // Handle non-successful responses
            router.push("/recruiter")
            
          }
        return;
        } catch (error) {
          console.error('There was a problem with the fetch request:', error);
          // Handle error
          return { error: error.message };
        }
    }


    useEffect(() => {
        getIndustries()
        chekcProfile()
        
    }, [])

    return (

        <AdminDashBoardLayout>
            
            <div>
                <h1 className="text-3xl font-semibold">Add Profile Details</h1>
                <form onSubmit={handleSubmit(onSubmit)}>

               

                {/* Comapny Name Fields */}


                <label htmlFor="name" className="text-sm">Company Name</label>
                <div className="flex gap-4 items-center mt-1">
                    <input type="text" {...register("name", { required: "Name is Required" })} id="name" className={`w-full rounded-xl bg-white py-4 px-3 text-black`} placeholder="Enter Company Name" />
                </div>



                {/* Company Email Fields  */}

                <label htmlFor="email" className="text-sm">Company Email</label>
                <div className="flex gap-4 items-center mt-1">
                    <input type="email" {...register("company_email", { required: "Email is required" })} id="email" className="w-full rounded-xl bg-white py-4 px-3 text-black" placeholder="Enter Company Email" />


                </div>



                {/* Phone Fields */}

                <label htmlFor="phone" className="text-sm">Phone</label>
                <div className="flex gap-4 items-center mt-1">
                    <input min="1" type="number" {...register("phone", { required: "Phone is required" })} id="phone" className="w-full rounded-xl bg-white py-4 px-3 text-black" placeholder="Enter Company Phone number" />

                </div>


                 {/* COmpany sizze Fields */}

                 <label htmlFor="size" className="text-sm">Company Size</label>
                <div className="flex gap-4 items-center mt-1">
                    <input min="1" type="number" {...register("company_size", { required: "Size is required" })} id="size" className="w-full rounded-xl bg-white py-4 px-3 text-black" placeholder="Enter Number of Employee" />

                </div>






                {/* Comapany Logo Fields */}


                <div className="w-[155px] h-[155px] rounded-2xl bg-white/40 flex items-center p-2 justify-center">

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
                                        <VisuallyHiddenInput type="file" onChange={handleChange} accept=".jpeg,.jpg, .png"/>
                                    </Button>}
                            ></Controller>


                        </div>


                    </div>


                </div>





                {/* Company Location Fields */}

                <label htmlFor="location" className="text-sm">Location</label>
                <div className="flex gap-4 items-center mt-1">
                    <input type="text" {...register("location", { required: "Location is required" })} id="location" className="w-full rounded-xl bg-white py-4 px-3 text-black" placeholder="Location" />

                </div>


                {/* Comapny Url Fields */}

                <label htmlFor="company_url" className="text-sm">Company Website URL</label>
                <div className="flex gap-4 items-center mt-1">
                    <input type="text" {...register("company_url", { required: "Url is required" })} id="company_url" className="w-full rounded-xl bg-white py-4 px-3 text-black" placeholder="https://example.com" />

                </div>



                {/* Comany Industry Fields */}
                <div className="my-4">
                  <Controller
                    control={control}
                    name="industry"
                    rules={{required:"Industry is required"}}
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        defaultValue={null}
                        options={industries}
                        getOptionLabel={(option) => option.title_name}
                        onChange={(event, values) => {
                          onChange(values?.id)
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Choose One Domain"
                            placeholder="Choose One Domain"
                            helperText={errors.industry?.message}
                            error={!!errors.industry}
                          />
                        )}
                      />)}
                  />
  
                </div>
  

                {/* <label htmlFor="industry" className="text-sm">Industry</label>
                <div className="flex gap-4 items-center mt-1">

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



                </div> */}


                {/* Description Fields */}


                <label htmlFor="description" className="text-sm">Description</label>
                <div className="flex gap-4 items-center mt-1">

                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            required:"Description is Required"
                        }}
                        defaultValue={""}
                        render={({ field: { onChange, value } }) => (
            
                            <ReactQuillEditable theme="snow" value={value} onChange={onChange} className="w-full bg-white "/>
                        )}
                    />

                </div>


                <button
                    type="submit"
                    disabled={!isDirty || !isValid || isSubmitting}
                    className="mt-20 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <ClipLoader
                        color={"#FFFFFF"}
                        loading={true}
                        size={20}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : (
                        "Submit Details"
                    )}
                </button>

                </form>
            </div>
        </AdminDashBoardLayout>


    );
}