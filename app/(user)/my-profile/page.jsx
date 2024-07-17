"use client"

import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, styled, Autocomplete, TextField } from "@mui/material"
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import defaultProfile from "../../../public/images/defaultProfile.png"
import Image from "next/image";
import GetRequestNoToken from "@/app/api/getRequestNoToken";
import PostFormWithToken from "@/app/api/postFormWithToken";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import PatchRequest from "@/app/api/patchRequest";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { addYears } from 'date-fns';
import Link from "next/link";
import { ClipLoader } from "react-spinners";

export default function UpdateProfile() {
    const router = useRouter()
    const [profileDetail, setProfileDetails] = useState([])
    const [industries, setIndustries] = useState([]);
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const [selecteProfilePhoto, setSelectedProfilePhoto] = useState()
    const [previewProfilePic, setPreviewProfilePic] = useState()
    const [skills, setSkills] = useState([])
    const [prefferedJobField, setPrefferedJobField] = useState([])
    const [requiedSkills, setRequiredSkills] = useState([])
    const [selectedJobCategory, setSelectedJobCategory] = useState()
    const [selectedIndustry, setSelectedIndustry] = useState(null)

    const {
        handleSubmit,
        register,
        control,
        setValue,
        watch,
        setError,
        setFocus,
        formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm({

        shouldUnregister: false
    })


    const formIndustryId = watch()
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
            const response = await fetch(`${APIENDPOINT}/job-seeker/check-seeker-details/`, requestOptions);
            if (!response.ok) {
                const data = await response.json();
               
                // Handle non-successful responses
                setProfileDetails(
                    {
                        "id": '',
                        "dob": "",
                        "first_name": "",
                        "middle_name": "",
                        "last_name": "",
                        "resume": "",
                        "industry": '',
                        "skills": [],
                        "prefferd_job": []
                    }
                )
                router.push("/create-profile?create-profile=true")

            }
            const data = await response.json();
            setProfileDetails(data)
        } catch (error) {
            console.error('There was a problem with the fetch request:', error);
            // Handle error
            return { error: error.message };
        }
    }


    const getSkills = async () => {
        
        try {
            const data = await GetRequestNoToken(`/get-skills/?industry=${formIndustryId.industry ? formIndustryId.industry : null}`)
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
    }

    const handleProfilePicChange = (e) => {
        setSelectedProfilePhoto(e.target.files[0]);
    }


    useEffect(() => {
        if (!selecteProfilePhoto) {
            setPreviewProfilePic(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selecteProfilePhoto)
        setPreviewProfilePic(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selecteProfilePhoto])


    const onSubmit = async (data) => {

        let da = { ...data, "dob": data.dob.format("YYYY-MM-DD") }

        if (selectedFile) {
            if(selectedFile.size > 500000){
                setError("resume", {
                    type:"manual",
                    message:"Must be less than 500 KB"
                },{
                    shouldFocus:true
                })
                return;
            }
            da = { ...da, "resume": selectedFile }
        }

        if (selecteProfilePhoto) {
            if(selecteProfilePhoto.size > 500000){
                setError("profilePic", {
                    type:"manual",
                    message:"Must be less than 500 KB"
                },{
                    shouldFocus:true
                })
                return;
            }
            da = { ...da, "profilePic": selecteProfilePhoto }
        }

        if (!selectedFile) {
            delete da.resume
        }
       
        if (!selecteProfilePhoto) {
            delete da.profilePic
        }

       
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
            const res = await PatchRequest(`/job-seeker/get-update-details/${profileDetail[0].id}`, formData, true)
            
            if (res.detail) {
               
                throw new Error("Cannot Fetch")
            }
          
            router.push("/")

        }
        catch (errors) {
          
            console.log(errors);
        }
    }

    //Set the display values of all fields after fetching details from server
    useEffect(() => {
        setValue("first_name", profileDetail[0]?.first_name || "");
        setValue("middle_name", profileDetail[0]?.middle_name || "");
        setValue("location", profileDetail[0]?.location || "");
        setValue("last_name", profileDetail[0]?.last_name || "");
        setValue("phone", profileDetail[0]?.phone || "");
        setValue("linkedin_url", profileDetail[0]?.linkedin_url || "");
        setValue("dob", dayjs(profileDetail[0]?.dob) || dayjs().startOf("D"));
        setValue("industry", industries.filter(data => data.id === profileDetail[0]?.industry.id)[0]?.id || "")
        setValue("profilePic", profileDetail[0]?.profilePic || "")
        setValue("resume", profileDetail[0]?.resume || "")
    }, [profileDetail])

    const disableFutureDates = (date) => {
        // Calculate the minimum birthdate allowed (14 years ago)
        const minBirthDate = addYears(new Date(), -14);
        // Disable future dates and dates where the user is less than 14 years old
        return date > new Date() || date > minBirthDate;
      };

    useEffect(() => {
        if (profileDetail && profileDetail[0]?.skills) {
            const initialValues = profileDetail[0].skills.map(data => data.id);
            setValue('skills', initialValues);
        }

        if (profileDetail && profileDetail[0]?.prefferd_job) {
            const initialValues = profileDetail[0].prefferd_job.map(data => data.id);
            setValue('prefferd_job', initialValues);
        }
    }, [profileDetail, setValue]);

    useEffect(()=>{
        getSkills()
    },[formIndustryId.industry, profileDetail])

    useEffect(() => {
        getIndustries()
        getJobCategory()
        getProfile()
    }, [])
    return (
        <>
           


            <section className="sm:py-10 sm:flex sm:justify-center">
                <div className="bg-white px-6 py-10 sm:p-10 sm:w-[80%] mb-10">
                    <h2 className="font-bold text-3xl text-[#414C61] bg-[#FFF7E2] px-4 py-2 rounded-2xl max-w-max text-center sm:text-left">Edit Profile</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="rounded-2xl bg-white/40 flex items-center p-2 mt-6">

                            <div className="flex flex-col gap-4">
                                <div className='mb-2'>
                                    {
                                        //Previews the file name
                                        selectedFile ? selectedFile.name : profileDetail ? <button className="bg-gurkha-yellow py-2 px-4 rounded-xl text-white"><Link href={profileDetail[0]? profileDetail[0]?.resume:"#"}>Download Resume</Link></button>: ''
                                    }
                                </div>

                                <div>

                                    {/* Handle the upload changes done in the image field */}
                                    <Controller
                                        control={control}
                                        name="resume"
                                        rules={{required:"Resume is required"}}
                                        render={({ field: { onChange,ref } }) =>
                                            <Button component="label" variant="contained" sx={{ backgroundColor: '#FAFAFA', color: 'black', textTransform: "capitalize", border: "1px solid #CFD1D4", width: "max-content" }}>
                                                Upload CV
                                                <VisuallyHiddenInput type="file" accept=".pdf,.docx" onChange={handleChange} ref={ref}/>
                                            </Button>}
                                    ></Controller>
                                    {errors.resume && <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.resume.message}</p>}


                                </div>


                            </div>


                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Personal Information</h2>
                            <div className="flex flex-col sm:flex-row sm:gap-10 items-start mt-6">
                                <div className="w-[155px] h-[155px] rounded-2xl bg-white/40 flex items-center p-2 basis-[20%]">

                                    <div className="flex flex-col gap-4 items-center">
                                        <div className='w-[125px] h-[125px] mb-1 border-[0.5px] mt-10 pt-4 px-4 border-[#514646]'>
                                            {
                                                //Previews the image
                                                selecteProfilePhoto ? <img src={previewProfilePic} alt="profile" className='w-full h-full object-contain' /> : <img src={profileDetail ? profileDetail[0]?.profilePic : defaultProfile} alt="profile" className='w-full h-full object-contain' />
                                            }
                                        </div>

                                        <div>

                                            {/* Handle the upload changes done in the image field */}
                                            <Controller
                                                control={control}
                                                name="profilePic"
                                                rules={{required:"Profile Picture is Required", validate:(file) =>{
                                                    if(file?.size > 500000){
                                                        return "Max Size Allowed 500kb";
                                                    }
                                                    return true;
                                                }}}
                                                render={({ field: { onChange,ref } }) =>
                                                    <Button component="label" variant="contained" sx={{ backgroundColor: '#FFB000', color: 'white', textTransform: "capitalize", borderRadius: "17px", width: "max-content" }}>
                                                        Upload Profile Picture
                                                        <VisuallyHiddenInput type="file" accept=".jpg, .jpeg, .png" onChange={handleProfilePicChange} ref={ref}/>
                                                    </Button>}
                                            ></Controller>
                                        {errors.profilePic && <p className="text-sm text-left mt-2 font-bold text-[#E33629]">{errors.profilePic.message}</p>}

                                        </div>


                                    </div>


                                </div>

                                <div className="flex flex-col sm:flex-row sm:gap-10 sm:basis-[80%]">
                                    <div className="sm:w-[50%] mt-6 sm:mt-0">
                                        <div className="flex flex-col">
                                            <label htmlFor="first_name" className="text-sm">First Name*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="first_name" {...register("first_name", { required: "First Name is required" })} />
                                        </div>
                                        <div className="flex flex-col  mt-6">
                                            <label htmlFor="last_name" className="text-sm">Last Name*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="last_name" {...register("last_name", { required: "Last Name is required" })} />
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="phone" className="text-sm">Phone Number*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" type="number" id="phone" {...register("phone", { required: "First Name is required" })} />
                                        </div>
                                    </div>

                                    <div className="sm:w-[50%] mt-6 sm:mt-0">
                                        <div className="flex flex-col">
                                            <label htmlFor="middle_name" className="text-sm">Middle Name</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="middle_name" {...register("middle_name")} />
                                        </div>

                                        <div className="flex flex-col mt-6">
                                            <label htmlFor="location" className="text-sm">Location*</label>
                                            <input className="border-[1px] border-[#CFD1D4] rounded py-2 px-6 w-full" id="location" {...register("location", { required: "Location Name is required" })} />
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
                                            onChange={(value) => onChange(value)}
                                            value={value}
                                            inputRef={ref}
                                            format={"YYYY-MM-DD"}
                                            shouldDisableDate={disableFutureDates}
                                            className="mt-4"
                                        />
                                    </LocalizationProvider>
                                )}
                            />
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
                                    <FormControlLabel value="remote" control={<Radio size="small" {...register('job_location_type')} />} label="Remote" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                    <FormControlLabel value="onSite" control={<Radio size="small" {...register('job_location_type')} />} label="On-Site" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                    <FormControlLabel value="Hybrid" control={<Radio size="small" {...register('job_location_type')} />} label="Hybrid" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                </RadioGroup>
                            </FormControl>
                        </div> */}

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-4">Choose Your Domain</h2>
                            <Controller
                                control={control}
                                name="industry"
                                defaultValue={null}
                                rules={{required:"Indsutry is Required"}}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={industries}
                                        getOptionLabel={(option) => { return option.title_name ? option.title_name : industries.filter(data => data.id === option)[0]?.title_name }}
                                        isOptionEqualToValue={(option, value) => { return typeof (value) === "number" ? option.id === value : option.id === value.id }}
                                        onChange={(event, values) => {
                                            field.onChange(values?.id)
                                            setValue("skills", [])
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder={profileDetail[0]?.industry || ""}
                                                helperText={errors.industry?.message}
                                                error={!!errors.industry}
                                            />
                                        )}
                                    />
                                )}
                            />



                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">Choose Your Skills</h2>
                            <p className="text-xs text-[#4F5052] mb-4">(We will use this to recommend you jobs)</p>
                            <div style={{ marginBottom: 16, marginTop: 6 }}>
                                <Controller
                                    control={control}
                                    name="skills"
                                    defaultValue={profileDetail && profileDetail[0]?.skills ? profileDetail[0].skills.map(data => data.id) : []}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            {...field}
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
                                                    placeholder={'Choose multiple Skills'}

                                                    helperText={errors.skills?.message}
                                                    error={!!errors.skills}
                                                />
                                            )}
                                        />
                                    )}
                                />

                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold">Choose Your Preffered Job Fields</h2>
                            <p className="text-xs text-[#4F5052] mb-4">(We will use this to recommend you jobs)</p>
                            <div style={{ marginBottom: 16, marginTop: 6 }}>
                                <Controller
                                    control={control}
                                    name="prefferd_job"
                                    defaultValue={profileDetail && profileDetail[0]?.prefferd_job ? profileDetail[0].prefferd_job.map(data => data.id) : []}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            {...field}
                                            disableCloseOnSelect
                                            options={prefferedJobField}
                                            getOptionLabel={(option) =>
                                                option ?
                                                    typeof option === "number" ?
                                                        (prefferedJobField.find(preffJob => preffJob.id === option) || {}).title || '' :
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
                                                    placeholder={'Choose multiple Job Fields'}

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

                        <div className="flex w-full justify-center sm:justify-end">
                            
                            <button className={`text-white bg-gurkha-yellow py-2 px-12 rounded-2xl flex items-center gap-4 ${isSubmitting && 'opacity-75'}`} type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting &&   <ClipLoader
                                    color={"#FFFFFF"}
                                    loading={true}
                                    size={15}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                  />
                                }
                                Submit
                            </button>

                        </div>
                    </form>

                </div>
            </section>
        </>


    )
}

