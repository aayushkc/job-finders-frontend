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
import PhoneInput from 'react-phone-number-input'
import 'react-quill/dist/quill.snow.css';


const ReactQuillEditable = dynamic(
    () => import('react-quill'),
    { ssr: false }
);

export default function CreateProfileDetails() {
    const router = useRouter()
    const [industries, setIndustries] = useState([]);
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()


    const comapnySizeChoices = [
        {
            "id": 0,
            "type": "1-10 employees"
        },
        {
            "id": 1,
            "type": "11-50 employees"
        },
        {
            "id": 2,
            "type": "51-200 employees"
        },
        {
            "id": 3,
            "type": "201-500 employees"
        },
        {
            "id": 4,
            "type": "501-1000 employees"
        },
        {
            "id": 5,
            "type": "1001-5000 employees"
        },
        {
            "id": 6,
            "type": "5001-10,000 employees"
        },
        {
            "id": 7,
            "type": "10,001+ employees"
        }
    ]

    const {
        handleSubmit,
        register,
        control,
        setValue,
        setError,
        formState: { errors, isSubmitting },
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

        formData.append("name", data.name)
        formData.append("company_url", data.company_url)
        formData.append("company_size", data.company_size)
        formData.append("location", data.location)
        formData.append("phone_number", data.phone_number)
        formData.append("company_email", data.company_email)
        formData.append("industry", data.industry)
        formData.append("description", data.description)
        formData.append("logo", selectedFile)

        try {
            const res = await PostFormWithToken(`/recruiter/recruiter-details/`, formData)

            if (res.status === 400) {
                const data = await res.json()
                for (const error in data){  
                    setError(error, {type:'custom', message:data[error]}, {shouldFocus:true})
                }
                return;
            }

            router.push("/recruiter")

        }
        catch (errors) {

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
        setValue("logo", selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    async function chekcProfile() {
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
                <form onSubmit={handleSubmit(onSubmit)} className="mt-10">

                    {/* Comapany Logo Fields */}
                    {errors.logo ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.logo.message}</p> : ""}

                    <div className="w-[155px] h-[155px] mb-12">

                        <div className="flex flex-col gap-2">
                            <div className={`w-[140px] h-[140px] relative border-2 ${errors.logo ? 'border-red-600' : 'border-[#514646]'}`}>
                                {
                                    //Previews the image
                                    selectedFile ? <img src={preview} className='w-full h-full object-contain' /> : <p className="absolute top-[30%] text-center font-bold text-sm">Upload Company Logo</p>
                                }
                            </div>

                            <div>

                                {/* Handle the upload changes done in the image field */}
                                <Controller
                                    control={control}
                                    name="logo"
                                    rules={{ required: "Company logo is required" }}
                                    render={({ field: { onChange } }) =>
                                        <Button component="label" variant="contained" sx={{ backgroundColor: '#49C199', color: 'white', textTransform: "capitalize", border: "1px solid #475569", width: "max-content" }}>
                                            Choose Company Logo
                                            <VisuallyHiddenInput type="file" onChange={handleChange} accept=".jpeg,.jpg, .png" />
                                        </Button>}
                                ></Controller>


                            </div>

                        </div>
                    </div>


                    {/* Comapny Name Fields */}
                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="name" className="text-sm">Company Name</label>
                        <input type="text" {...register("name", { required: "Name is Required" })} id="name" className={`w-full rounded-xl bg-white py-4 px-3 text-black`} placeholder="Enter Company Name" />
                    </div>



                    {/* Company Email Fields  */}
                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="email" className="text-sm">Company Email</label>
                        <input type="email" {...register("company_email", { required: "Email is required" })} id="email" className="w-full rounded-xl bg-white py-4 px-3 text-black" placeholder="Enter Company Email" />


                    </div>



                    {/* Phone Fields */}

                    <div className="my-4">
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
                                    className={`w-full rounded-xl bg-white py-4 px-3 text-black`}
                                />
                            )}
                        />
                        {errors.phone_number ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.phone_number.message}</p> : ""}

                    </div>
                    {/* COmpany sizze Fields */}

                    <div className="my-4">

                        <Controller
                            control={control}
                            name="company_size"
                            rules={{ required: "This field is Required" }}
                            render={({ field: { onChange } }) => (
                                <Autocomplete
                                    defaultValue={null}
                                    options={comapnySizeChoices}
                                    getOptionLabel={(option) => option.type}
                                    onChange={(event, values) => {
                                        onChange(values?.id)
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose One Company Size Option"
                                            placeholder="Choose One Company Size Option"
                                            helperText={errors.company_size?.message}
                                            error={!!errors.company_size}
                                        />
                                    )}
                                />)}
                        />
                    </div>

                    {/* Company Location Fields */}
                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="location" className="text-sm">Location</label>
                        <input type="text" {...register("location", { required: "Location is required" })} id="location" className="w-full rounded-xl bg-white py-4 px-3 text-black" placeholder="Location" />

                    </div>


                    {/* Comapny Url Fields */}
                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="company_url" className={`text-sm  ${errors.company_url && 'text-red-600'}`}>Company Website URL</label>
                        <input
                            type="text"
                            {...register("company_url",
                                {
                                    pattern: {
                                        value: /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
                                        message: "Url must start with https:// or http://"
                                    }

                                })
                            }
                            id="company_url"
                            className={`w-full rounded-xl bg-white py-4 px-3 text-black ${errors.company_url && 'border-2 border-red-600'}`}
                            placeholder="https://example.com"
                        />
                    </div>
                    {errors.company_url ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.company_url.message}</p> : ""}




                    {/* Comany Industry Fields */}
                    <div className="my-4">
                        <Controller
                            control={control}
                            name="industry"
                            rules={{ required: "Industry is required" }}
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





                    {/* Description Fields */}


                    
                    <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="description" className="text-sm">Description</label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{
                                required: "Description is Required"
                            }}
                            defaultValue={""}
                            render={({ field: { onChange, value } }) => (

                                <ReactQuillEditable theme="snow" value={value} onChange={onChange} className="w-full bg-white read-quill write-quill" />
                            )}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-8 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
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