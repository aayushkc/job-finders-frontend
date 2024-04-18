"use client"

import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled, Autocomplete, TextField } from "@mui/material"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import defaultProfile from "../../../public/images/defaultProfile.png"
import Image from "next/image";
import GetRequestNoToken from "@/app/api/getRequestNoToken";
import PostFormWithToken from "@/app/api/postFormWithToken";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useAuth } from "@/app/utils/checkIsLoggedIn";
import { addYears } from "date-fns";

export default function CreateProfile() {
    const router = useRouter()
    const { isLoggedIn } = useAuth();
    const [industries, setIndustries] = useState([]);
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [selecteProfilePhoto, setSelectedProfilePhoto] = useState()
    const [previewProfilePic, setPreviewProfilePic] = useState()
    const [skills, setSkills] = useState([])
    const [prefferedJobField, setPrefferedJobField] = useState([])

    const {
        handleSubmit,
        register,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm()


    const formIndustryId = watch("industry")
    
    const disableFutureDates = (date) => {
        // Calculate the minimum birthdate allowed (14 years ago)
        const minBirthDate = addYears(new Date(), -14);
        // Disable future dates and dates where the user is less than 14 years old
        return date > new Date() || date > minBirthDate;
      };


    const getSkills = async () => {
        try {
            const data = await GetRequestNoToken(`/get-skills/?industry=${formIndustryId ? formIndustryId : null}`)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            setSkills(data)
        }
        catch (errors) {
            setSkills([{ "id": "", "title": "" }])
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


    const getJobCategory = async () => {
        try {
            const data = await GetRequestNoToken('/job-preference/')
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            setPrefferedJobField(data)
        }
        catch (errors) {
            setPrefferedJobField([{ "id": "", "title": "" }])
        }
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


    const handleChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setValue("resume",e.target.files[0])
    }

    const handleProfilePicChange = (e) => {
        setSelectedProfilePhoto(e.target.files[0]);
    }

    // useEffect(() => {
    //     if (!selectedFile) {
    //         setPreview(undefined)
    //         return
    //     }

    //     const objectUrl = URL.createObjectURL(selectedFile)
    //     setPreview(objectUrl)

    //     // free memory when ever this component is unmounted
    //     return () => URL.revokeObjectURL(objectUrl)
    // }, [selectedFile])

    useEffect(() => {
        if (!isLoggedIn) router.push("/signin")
    }, [isLoggedIn])

    useEffect(() => {
        if (!selecteProfilePhoto) {
            setPreviewProfilePic(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selecteProfilePhoto)
        setValue("profilePic",selecteProfilePhoto)
        setPreviewProfilePic(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selecteProfilePhoto])


    const onSubmit = async (data) => {
        const da = { ...data, "resume": selectedFile, "profilePic": selecteProfilePhoto }
        const formData = new FormData()
        Object.entries(da).forEach(([key, value]) => { formData.append(key, value); })
        formData.delete("skills")
        formData.delete("prefferd_job")
        data.skills.forEach(item => {
            formData.append('skills', item);
        });

        data.prefferd_job.forEach(item => {
            formData.append('prefferd_job', item);
        });
        try {
            const res = await PostFormWithToken(`/job-seeker/create-details/`, formData)
           
            if (res.detail) {
                
                throw new Error("Cannot Fetch")
            }
           
            router.push("/")

        }
        catch (errors) {
           
            console.log(errors);
        }
    }

    useEffect(() => {
        getIndustries()
        getJobCategory()
    }, [])

    useEffect(() => {
        getSkills()
    
      }, [formIndustryId])

    return (
        <>
            <section className="text-center bg-white py-8">
                <h1 className="text-[#193855] font-bold text-5xl leading-[78.4px]">Welcome to Hire Gurkha</h1>
                <p className="font-semibold text-3xl bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block text-transparent bg-clip-text mt-4"> Create Your Profile</p>
                <div className="flex justify-center">
                    <div className="bg-[#F3F4F8] mt-8 p-4 w-[80%]">
                        <div>
                            <h2 className="text-[#193855]  text-2xl">So that you can start Applying for Jobs</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className=" my-10 flex justify-center">
                <div className="bg-white p-10 w-[80%] mb-10">
                    <h2 className="font-bold text-3xl text-[#414C61] bg-[#FFF7E2] px-4 py-2 rounded-2xl max-w-max">Create Profile</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-8">

                                    {/* Handle the upload changes done in the image field */}
                                    <Controller
                                        control={control}
                                        name="resume"
                                        rules={{ required: "A CV in either .pdf or .docx format must be uploaded" }}
                                        render={({ field: { onChange } }) =>
                                            <Button
                                                component="label"
                                                variant="contained"
                                                sx={
                                                    {
                                                        backgroundColor: '#FAFAFA',
                                                        color: 'black',
                                                        textTransform: "capitalize",
                                                        border:errors.resume ? "1.5px solid red" : "1px solid #CFD1D4",
                                                        width: "max-content",
                                                        padding: "0.8rem 2.4rem",
                                                        fontSize: "18px",
                                                        fontWeight: "700"
                                                    }
                                                }
                                            >
                                                {
                                                    //Previews the file name
                                                    selectedFile ? selectedFile.name : "Upload CV"
                                                }
                                                <VisuallyHiddenInput type="file" accept=".pdf,.docx" onChange={handleChange} />
                                            </Button>}
                                    />
                                 {errors.resume ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.resume.message}</p> : ""}
                          
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Personal Information</h2>
                            <div className="flex gap-10 items-start mt-6">
                                <div className="w-[155px] h-[155px]  bg-white/40 flex items-center p-2 basis-[20%]">

                                    <div className="flex flex-col gap-2 items-center">

                                        <div className={`w-[155px] h-[155px] text-center rounded-2xl border-[0.5px] mt-10 pt-2 px-2 ${errors.profilePic ? 'border-red-600' : 'border-[#514646]'}`}>
                                            {
                                                //Previews the image
                                                selecteProfilePhoto ? <Image src={previewProfilePic} alt="profile" width="155" height="155" className='w-full h-full object-contain' /> : <p className="font-bold mt-6 text-sm">Upload Profile Picture</p>
                                            }
                                        </div>
                                        {errors.profilePic ? <p className="text-sm text-left font-bold text-[#E33629]">{errors.profilePic.message}</p> : ""}

                                        <div>

                                            {/* Handle the upload changes done in the image field */}
                                            <Controller
                                                control={control}
                                                name="profilePic"
                                                rules={{ required: "Profile Picture is required" }}
                                                render={({ field: { onChange } }) =>
                                                    <Button component="label" variant="contained" sx={{ backgroundColor: '#FFB000', color: 'white', textTransform: "capitalize", borderRadius: "17px", width: "max-content" }}>
                                                        Upload Profile Picture
                                                        <VisuallyHiddenInput type="file" accept=".jpg, .jpeg, .png" onChange={handleProfilePicChange} />
                                                    </Button>}
                                            ></Controller>


                                        </div>


                                    </div>


                                </div>

                                <div className="flex gap-10 basis-[80%]">
                                    <div className="w-[50%]">
                                        <div className="flex flex-col">
                                            <label htmlFor="first_name" className="text-sm">First Name*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="first_name" {...register("first_name", { required: "First Name is required" })} />
                                            {errors.first_name ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.first_name.message}</p> : ""}
                                        </div>
                                        
                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="last_name" className="text-sm">Last Name*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="last_name" {...register("last_name", { required: "Last Name is required" })} />
                                            {errors.last_name ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.last_name.message}</p> : ""}
                                        </div>
                                    

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="phone" className="text-sm">Phone Number*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" type="number" id="phone" min={1} {...register("phone", { required: "Phone is required" })} />
                                            {errors.phone ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.phone.message}</p> : ""}
                                        </div>
                                    </div>

                                    <div className="w-[50%]">
                                
                                        <div className="flex flex-col">
                                            <label htmlFor="middle_name" className="text-sm">Middle Name</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="middle_name" {...register("middle_name")} />
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="location" className="text-sm">Location*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="location" {...register("location", { required: "Location is required" })} />
                                            {errors.location ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.location.message}</p> : ""}
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="linkedin_url" className="text-sm">Linkedin URL</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="linkedin_url" {...register("linkedin_url")} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="mt-10">

                            <Controller
                                control={control}
                                defaultValue={''}
                                name="dob"
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Date of Birth is required",
                                    },
                                    
                                }}
                                render={({ field: { onChange, value, ref } }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DatePicker
                                            label="Date of Birth"
                                            disableFuture
                                            onChange={(value) => onChange(value.format("YYYY-MM-DD"))}
                                            value={value}
                                            inputRef={ref}
                                            format={"YYYY-MM-DD"}
                                            shouldDisableDate={disableFutureDates}
                                            className="mt-4"
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                            {errors.dob ? <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.dob.message}</p> : ""}
                        </div>


                        {/* <div className="mt-10">
                            <h2 className="text-xl font-semibold">Job Preference</h2>
                            <FormControl className="mt-4">
                                <FormLabel id="demo-row-radio-buttons-group-label" className="text-sm">Job Type</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    className="mt-3 ml-2 gap-3"

                                >
                                    <FormControlLabel value="remote" control={<Radio size="small" {...register('job_location_type', { required: "Requried" })} />} label="Remote" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                    <FormControlLabel value="onSite" control={<Radio size="small" {...register('job_location_type', { required: "Requried" })} />} label="On-Site" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                    <FormControlLabel value="Hybrid" control={<Radio size="small" {...register('job_location_type', { required: "Requried" })} />} label="Hybrid" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                </RadioGroup>
                            </FormControl>
                        </div> */}

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-4">Choose Your Domain</h2>

                            <Controller
                                control={control}
                                name="industry"
                                rules={{required:"You must choose one domain"}}
                                render={({ field: { onChange } }) => (
                                    <Autocomplete
                                        defaultValue={null}
                                        options={industries}
                                        getOptionLabel={(option) => option.title_name}
                                        onChange={(event, values) => {
                                            onChange(values?.id)
                                            setValue("skills",[])
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
                                    />
                                )}
                            />



                        </div>
                        {
                            formIndustryId && (
                                <div className="mt-10">
                                <h2 className="text-xl font-semibold">Choose Your Skills</h2>
                                <p className="text-xs text-[#4F5052] mb-4">(We will use this to recommend you jobs)</p>
                                <div style={{ marginBottom: 16, marginTop: 6 }}>
                                    <Controller
                                        control={control}
                                        name="skills"
                                        rules={{required:"You must choose one or more Skills"}}
                                        render={({ field}) => (
                                            <Autocomplete
                                                {...field}
                                                defaultValue={[]}
                                                multiple
                                                disableCloseOnSelect
                                                options={skills}
                                                getOptionLabel={(option) =>
                                                    option ?
                                                      typeof option === "number" ?
                                                        (skills.find(skill => skill.id === option) || {}).title || '' :
                                                        option.title : ""
                                                  }
                                                  isOptionEqualToValue={(option, value) => {
                  
                                                    return option.id === value
                                                  }
                                                  }
                                                  onChange={(event, values) => {
                  
                                                    field.onChange(values.map(val => { return typeof (val) === "number" ? val : val.id }))
                                                  }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Required Skills"
                                                        placeholder="Required Skills"
                                                        helperText={errors.skills?.message}
                                                        error={!!errors.skills}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
    
                                </div>
                            </div>
                                
                            )
                        }

                       

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">Choose Your Preffered Job Fields</h2>
                            <p className="text-xs text-[#4F5052] mb-4">(We will use this to recommend you jobs)</p>
                            <div style={{ marginBottom: 16, marginTop: 6 }}>
                                <Controller
                                    control={control}
                                    name="prefferd_job"
                                    rules={{required:"You must choose one or more categories"}}
                                    render={({ field: { onChange } }) => (
                                        <Autocomplete
                                            defaultValue={[]}
                                            multiple
                                            disableCloseOnSelect
                                            options={prefferedJobField}
                                            getOptionLabel={(option) => option.title}
                                            onChange={(event, values) => {
                                                onChange(values.map(val => { return val.id }))
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Job Industries"
                                                    placeholder="Job Industries"
                                                    helperText={errors.prefferd_job?.message}
                                                    error={!!errors.prefferd_job}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <hr className="my-8"></hr>

                        <div className="flex w-full justify-end">
                            <button className="text-white bg-gurkha-yellow py-2 px-12 rounded-2xl" type="submit">Submit</button>

                        </div>
                    </form>

                </div>
            </section>
        </>


    )
}

