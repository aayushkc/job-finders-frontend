"use client"
import GetRequestNoToken from "@/app/api/getRequestNoToken";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import ReactHookFormSelect from "@/app/components/industrychoices";
import SelectComponent from "@/app/components/selectbox";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from 'next/dynamic';
import PostWithTokien from "@/app/api/postWithToken";

import DialogBox from "@/app/components/sucessbox";
const FroalaEditor = dynamic(
    () => import('react-froala-wysiwyg'),
    { ssr: false }
);
export default function Page() {

    const {
        handleSubmit,
        register,
        control,
        formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm()


    const [industries, setIndustries] = useState([]);
    const [skills, setSkills] = useState([]);
    const [jobcategory, setJobCategory] = useState([]);
    const [educationIfon, setEducationInfo] = useState([]);
    const [jobSuccess,setJobSuccess] = useState(false)
    const [jobError, setJobError] = useState(false)
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

    const getSkills = async () => {
        try {
            const data = await GetRequestNoToken('/skills/')
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            setSkills(data)
        }
        catch (errors) {
            setSkills([{ "id": "", "title": "" }])
        }
    }

    const getJobCategory = async () => {
        try {
            const data = await GetRequestNoToken('/job-preference/')
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            setJobCategory(data)
        }
        catch (errors) {
            setJobCategory([{ "id": "", "title": "" }])
        }
    }

    const getEducationInfo = async () => {
        try {
            const data = await GetRequestNoToken('/education-level/')
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            setEducationInfo(data)
            console.log(educationIfon);
        }
        catch (errors) {
            setEducationInfo([{
                "education_level": "",
                "education_level_name": "",
                "degree_name": ""
            }])
        }
    }

    const worklocationType = [
        {
            "id": 0,
            "type": "Remote"
        },
        {
            "id": 1,
            "type": "On Site"
        },
        {
            "id": 2,
            "type": "Hybrid"
        }
    ]

    const workExpereinceChoices = [
        {
            "id": 0,
            "type": "Not Important"
        },
        {
            "id": 1,
            "type": "less than three"
        },
        {
            "id": 2,
            "type": "between three and six"
        },
        {
            "id": 3,
            "type": "more than six"
        }
    ]

    const jobLevelChoices = [
        {
            "id": 0,
            "type": "Intern"
        },
        {
            "id": 1,
            "type": "Freshers"
        },
        {
            "id": 2,
            "type": "Experienced"
        },
    ]
    const onSubmit = async (data) => {
        console.log(data);
        
        try {
            const res = await PostWithTokien('/recruiter/add-job/', data)
            console.log(res);
            if (res.detail) {
                throw new Error("Cannot Fetch")
            }
           setJobSuccess(true)
        }
        catch (errors) {
            console.log("ENteerereddddddd");
            console.log(errors);
            setJobError(true)
        }
    }

    useEffect(() => {
        getIndustries()
        getSkills()
        getJobCategory()
        getEducationInfo()
    }, [])
    return (
        <AdminDashBoardLayout>
            {
                jobSuccess &&<DialogBox 
                                dialogHeading={"Job Added Sucessfully"} 
                                dialogText={"Job has been Added SuccessFully"}
                                goToPageName={"To View All Pending Jobs"}
                                url={"/recruiter/view-all-pending-jobs"}
                                success={true}
                        />
            }

            {
                jobError &&<DialogBox 
                                dialogHeading={"An Error occured during Submission"} 
                                dialogText={"Please try again"}
                                error={true}
                        />
            }
            <h1 className="text-3xl font-semibold">Add Job Vacancy</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">

                {/* Job Title */}
                <div className="my-4">
                    <label htmlFor="tile" className="text-sm">Job Title*</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("title", { required: "This field is required" })}
                            type="text"
                            name='title'
                            id="title"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"
                            placeholder="Enter Job Title" />
                
                       
                    </div>
                    {errors.title && 
                          <p>{console.log(errors.title.message)}</p>
                        }
                </div>

                {/* Number of Vacancy */}
                <div className="my-4">
                    <label htmlFor="vacancy-number" className="text-sm">Number of Vacancy*</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("number_of_vacancy", { required: true, min:1 })}
                            type="number"
                            name='number_of_vacancy'
                            id="number_of_vacancy"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"
                            placeholder="Enter Number of Vacancy" />
                    </div>
                </div>

                {/* Salary Amount */}
                <div className="my-4">
                    <label htmlFor="salary" className="text-sm">Salary</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("salary", { required: true })}
                            type="number"
                            name='salary'
                            id="salary"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"
                            placeholder="Enter Salary" />
                    </div>
                </div>


                {/* Site Location */}
                <div className="my-4">
                    <label htmlFor="site-location" className="text-sm">Site Location*</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("job_location", { required: true })}
                            type="text"
                            name='job_location'
                            id="job_location"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"
                            placeholder="Enter Job Site Location" />
                    </div>
                </div>


                {/* work Location Type */}

                <SelectComponent
                    name={"work_location_type"}
                    label={"Job Type"}
                    control={control}
                    defaultValue={''}
                >
                    {
                        worklocationType.map(data => {
                            return <MenuItem key={data.id} value={data.id}>
                                {data.type}
                            </MenuItem>
                        })
                    }

                </SelectComponent>

                {/*Job Experence Required */}

                <SelectComponent
                    name={"required_years_of_experience"}
                    label={"Required Years of Experience"}
                    control={control}
                    defaultValue={''}
                >
                    {
                        workExpereinceChoices.map(data => {
                            return <MenuItem key={data.id} value={data.id}>
                                {data.type}
                            </MenuItem>
                        })
                    }

                </SelectComponent>



                {/* Job Level required  */}

                <SelectComponent
                    name={"level"}
                    label={"Required Job Level"}
                    control={control}
                    defaultValue={''}
                >
                    {
                        jobLevelChoices.map(data => {
                            return <MenuItem key={data.id} value={data.id}>
                                {data.type}
                            </MenuItem>
                        })
                    }

                </SelectComponent>

                {/* Choose Industry */}
                <ReactHookFormSelect
                    id="idustry-select"
                    name="industry"
                    label="Choose one Industry"
                    control={control}
                    defaultValue={""}
                >
                    {
                        industries?.map(industry => {
                            return <MenuItem key={industry.title} value={industry.id}>
                                {industry.title_name}
                            </MenuItem>
                        })
                    }
                </ReactHookFormSelect>



                {/* Choose Skills */}
                <Controller

                    name="required_skills"
                    control={control}
                    defaultValue={[]}
                    rules={{required:true}}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel id="skills">Skills</InputLabel>
                            <Select
                                {...field}
                                labelId="skills"
                                label="skills"
                                multiple
                                defaultValue={[]}
                                className="my-4"
                            >
                                {skills?.map((data) => (
                                    <MenuItem value={data.id} key={data.id}>
                                        {data.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                />


                {/* Choose Job Category */}
                <Controller

                    name="job_category"
                    control={control}
                    defaultValue={[]}
                    rules={{required:true}}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel id="job_category">Job Category</InputLabel>
                            <Select
                                {...field}
                                labelId="job_category"
                                label="job_category"
                                multiple
                                defaultValue={[]}
                                className="my-4"
                            >
                                {jobcategory?.map((data) => (
                                    <MenuItem value={data.id} key={data.id}>
                                        {data.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                />

                {/* Select Degree */}

                <Controller

                    name="education_info"
                    control={control}
                    defaultValue={[]}
                    rules={{required:true}}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel id="education_info">Select Required Degree</InputLabel>
                            <Select
                                {...field}
                                labelId="education_info"
                                label="education_info"
                                multiple
                                defaultValue={[]}
                                className="my-4"
                            >
                                {educationIfon?.map((data) => (
                                    <MenuItem value={data.id} key={data.education_level}>
                                        {data.degree_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                />

                {/* Apply before Before */}
                <Controller
                    control={control}
                    defaultValue={dayjs().startOf("D")}
                    name="apply_before"
                    rules={{
                        required: {
                            value: true,
                            message: "Apply Before is required",
                        },
                    }}
                    render={({ field: { onChange, value, ref } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker
                                label="Apply Before"
                                disablePast
                                onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
                                value={value}
                                inputRef={ref}
                                format={"YYYY/MM/DD"}
                                className="mt-4"
                            />
                        </LocalizationProvider>
                    )}
                />

                {/* Job Description */}

                <div className="mt-6">
                    <label htmlFor="description" className="text-sm">Job Description</label>
                    <div className="flex gap-4 items-center mt-1">
                        <Controller
                            control={control}
                            name="description"
                            defaultValue={""}
                            rules={{required:true}}
                            render={({ field: { onChange, value } }) => (
                                <FroalaEditor
                                    model={value}
                                    onModelChange={onChange}
                                    tag="textarea"

                                />

                            )}
                        />



                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!isDirty || !isValid || isSubmitting}
                    className="mt-20 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                >
                    {isSubmitting ? (
                        <div role="status">
                            <svg
                                aria-hidden="true"
                                className="inline w-6 h-6 mr-2 text-white animate-spin fill-rose-600 opacity-100"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* SVG for Spinner Animation */}
                            </svg>
                        </div>
                    ) : (
                        "Add Job"
                    )}
                </button>
            </form>
        </AdminDashBoardLayout>
    )
}