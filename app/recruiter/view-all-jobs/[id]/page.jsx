"use client"
import GetRequestNoToken from "@/app/api/getRequestNoToken";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import ReactHookFormSelect from "@/app/components/industrychoices";
import SelectComponent from "@/app/components/selectbox";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, useMediaQuery } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from 'next/dynamic';
import PostWithTokien from "@/app/api/postWithToken";

import DialogBox from "@/app/components/sucessbox";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import getRequestWithToken from "@/app/api/getRequestWithToken";
import Cookies from "js-cookie";
import PutWithTokien from "@/app/api/putRequest";
import DeleteRequest from "@/app/api/deleteRequest";
import { useTheme } from '@mui/material/styles';
import { ClipLoader } from "react-spinners";
import 'react-quill/dist/quill.snow.css';


const ReactQuillEditable = dynamic(
    () => import('react-quill'),
    { ssr: false }
);
export default function Page() {
    const accessToken = Cookies.get('accessToken')
    const router = useParams()
    console.log(router.id)
    const navigate = useRouter()
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm()


    const [industries, setIndustries] = useState([]);
    const [skills, setSkills] = useState([]);
    const [jobcategory, setJobCategory] = useState([]);
    const [educationIfon, setEducationInfo] = useState([]);
    const [jobSuccess, setJobSuccess] = useState(false)
    const [jobError, setJobError] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [deleteError, setDeleteError] = useState(false)
    const [jobDetails, setJobDetails] = useState([])
    const [requiedSkills, setRequiredSkills] = useState()
    const [selectedJobCategory, setSelectedJobCategory] = useState()
    const [selectedEducationInfo, setSelectedEducationInfo] = useState()
    const [selectedJobLevel, setSelectedJobLevel] = useState()
    const [selectedWorkLoc, setSelectedWorkLoc] = useState()
    const [selectedWorkExperience, setSelectedWorkExperience] = useState()
    const [areYouSure, setAreYouSure] = useState(false)
    const [open, setOpen] = useState(true);
    const [showSalaryRange, setShowSalaryRange] = useState(false)
    const [showFixedSalary, setShowFixedSalary] = useState(false)
    const [salaryRadio, setSalaryRadio] = useState()
    const handleModalClose = () => {
        setOpen(false);
    };

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
            "type": "Onsite"
        },
        {
            "id": 2,
            "type": "Hybrid"
        }
    ]

    const workExpereinceChoices = [
        {
            "id": 0,
            "type": "0-1"
        },
        {
            "id": 1,
            "type": "1-3"
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

    const getJob = async () => {
        try {
            const data = await getRequestWithToken(`/recruiter/get-job/${router.id}`, accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            // The total count of data needs to be dividd by the number of data sent per page by backend
            setJobDetails(data)
            setRequiredSkills(data.required_skills.map(data => data.id))
            setSelectedJobCategory(data.job_category.map(data => data.id))
            setSelectedEducationInfo(data.education_info.map(data => data.id))
            setSelectedWorkLoc(worklocationType.find(loc => loc.type === data.work_location_type))
            setSelectedJobLevel(jobLevelChoices.find(loc => loc.type === data.level))
            setSelectedWorkExperience(workExpereinceChoices.find(loc => loc.type === data.required_years_of_experience))
            if (data.salary) {
                setSalaryRadio("2")
                setShowFixedSalary(true)
            }else if(data.min_salary){
                
                setSalaryRadio("1")
                setShowSalaryRange(true)
    
            }else{
               
                setSalaryRadio("0")
            }

        }
        catch (errors) {
            setJobDetails([])
        }
    }

    const onSubmit = async (data) => {
        console.log(data.apply_before.format("YYYY-MM-DD"));
        const subData = { ...data, 'apply_before': data.apply_before.format("YYYY-MM-DD") }
        console.log(subData);
        setJobSuccess(false)
        setJobError(false)
        try {
            const res = await PutWithTokien(`/recruiter/get-job/${router.id}`, subData)
            console.log("This is respooooooooooooooo");
            if (res.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log("Helooooooooooooooo");
            setJobSuccess(true)
        }
        catch (errors) {
            console.log("ENteerereddddddd Tissssssss");
            console.log(errors);
            setJobError(true)
        }
    }

    const handleDelete = async () => {
        setDeleteError(false)
        setDeleteSuccess(false)
        setOpen(true)
        try {
            const res = await DeleteRequest(`/recruiter/delete-job/${router.id}`)
            console.log(res);
            if (res.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log("Helooooooooooooooo");
            setDeleteSuccess(true)


        }
        catch (errors) {
            console.log("ENteerereddddddd Tissssssss");
            console.log(errors);
            setDeleteError(true)
        }
    }

    const handleCloseDeleteComp = () => {
        setAreYouSure(false)
        setOpen(true)
    }

    const handleSalaryRadioChange = (e) => {
        const { name, value } = e.target
        if (value === "0") {
            setShowSalaryRange(false)
            setShowFixedSalary(false)
            setValue("min_salary", null)
            setValue("max_salary", null)
            setValue("salary", null)
        }
        if (value === "1") {
            setShowFixedSalary(false)
            setValue("salary", null)
            setShowSalaryRange(true)
        }
        if (value === "2") {
            setValue("min_salary", null)
            setValue("max_salary", null)
            setShowSalaryRange(false)
            setShowFixedSalary(true)
        }
    }


    useEffect(() => {
        setValue("title", jobDetails.title || "");
        setValue("number_of_vacancy", jobDetails.number_of_vacancy || "");
        setValue("job_location", jobDetails.job_location || "");
        setValue("required_skills", requiedSkills || []);
        setValue("job_category", selectedJobCategory || []);
        setValue("education_info", selectedEducationInfo || []);
        setValue("apply_before", dayjs(jobDetails.apply_before) || dayjs().startOf("D"));
        setValue("description", jobDetails.description || "");
        setValue("industry", industries.filter(indus => indus.title_name === jobDetails.industry)[0]?.id || '');

        if (selectedWorkLoc) {
            setValue("work_location_type", selectedWorkLoc.id || 0);
        }

        if (selectedJobLevel) {
            console.log(selectedJobLevel);
            setValue("level", selectedJobLevel.id || 0)
        }

        if (selectedWorkExperience) {
            setValue("required_years_of_experience", selectedWorkExperience.id || 0)
        }

        if (jobDetails.salary) {
            setSalaryRadio("2")
            setShowFixedSalary(true)
        }else if(jobDetails.min_salary){
            
            setSalaryRadio("1")
            setShowSalaryRange(true)

        }else{
           
            setSalaryRadio("0")
        }

    }, [jobDetails])

    useEffect(() => {
        getIndustries()
        getSkills()
        getJobCategory()
        getEducationInfo()
        getJob()
    }, [])



    return (
        <AdminDashBoardLayout>
            {console.log(jobDetails)}
            {
                jobSuccess && <DialogBox
                    dialogHeading={"Job Has Been Edited Sucessfully"}
                    dialogText={"Job has been edited SuccessFully"}
                    goToPageName={"View All Jobs"}
                    url={"/recruiter/view-all-jobs"}
                    success={true}
                />
            }

            {
                jobError && <DialogBox
                    dialogHeading={"An Error occured during Submission"}
                    dialogText={"Please try again"}
                    error={true}
                />
            }
            <h1 className="text-3xl font-semibold">Edit Your Job Vacancy</h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Job Title */}
                <div className="my-4">
                    <label htmlFor="title" className="text-sm">Job Title*</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("title", { required: true })}
                            type="text"
                            name='title'
                            id="title"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"


                        />

                    </div>
                </div>

                {/* Number of Vacancy */}
                <div className="my-4">
                    <label htmlFor="number_of_vacancy" className="text-sm">Number of Vacancy*</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("number_of_vacancy", { required: true })}
                            type="number"
                            name='number_of_vacancy'
                            id="number_of_vacancy"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"
                        />
                    </div>
                </div>

                {/* Salary Amount */}
                <div className="my-4">
                    <FormControl className="mt-4">
                        <FormLabel id="salary-radio-buttons-group-label" className="text-sm">Salary</FormLabel>
                                <RadioGroup
                                    row
                                    name="salary-radio-buttons-group-labe"
                                    className="mt-3 ml-2 gap-3"
                                    onChange= {handleSalaryRadioChange}
                                    defaultValue={salaryRadio}
                                >
                                    <FormControlLabel value="0" control={<Radio size="small" />} label="Undisclosed" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                    <FormControlLabel value="1" control={<Radio size="small" />} label="Choose a range" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                    <FormControlLabel value="2" control={<Radio size="small" />} label="Choose fixed Salary" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                                </RadioGroup>

                        {showSalaryRange &&
                            (
                                <div className="flex gap-8 items-center mt-2 w-full">
                                    <div className="flex gap-4 items-center mt-1 mb-4">
                                        <label htmlFor="min_salary" className="text-sm basis-[30%]">Min</label>
                                        <input defaultValue={jobDetails.min_salary ? jobDetails.min_salary : null} min="1" type="number" {...register("min_salary", { required: "Salary is required" })} id="min_salary" className="w-full rounded-xl bg-white py-4 px-3 text-black" />

                                    </div>

                                    <div className="flex gap-4 items-center mt-1 mb-4">
                                        <label htmlFor="max_salary" className="text-sm basis-[30%]">Max</label>
                                        <input min="1" defaultValue={jobDetails.max_salary ? jobDetails.max_salary : null} type="number" {...register("max_salary", { required: "Salary is required" })} id="max_salary" className="w-full rounded-xl bg-white py-4 px-3 text-black" />

                                    </div>

                                </div>
                            )
                        }

                        {showFixedSalary &&
                            (


                                <div className="flex gap-4 items-center mt-3 mb-4">
                                    <label htmlFor="salary" className="text-sm basis-[20%] font-bold">Enter Salary</label>
                                    <input min="1" defaultValue={jobDetails.salary ? jobDetails.salary : null} type="number" {...register("salary", { required: "Salary is required" })} id="salary" className="w-full rounded-xl bg-white py-4 px-3 text-black" />

                                </div>


                            )
                        }
                    </FormControl>
                </div>



                {/* Site Location */}
                <div className="my-4">
                    <label htmlFor="job_location" className="text-sm">Site Location*</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("job_location", { required: true })}
                            type="text"
                            name='job_location'
                            id="job_location"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"
                        />
                    </div>
                </div>


                {/* work Location Type */}


                <div className="my-4">
                    <Controller
                        control={control}
                        name="work_location_type"
                        defaultValue={null}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={worklocationType}
                                getOptionLabel={(option) => { return option.type ? option.type : worklocationType.filter(data => data.id === option)[0]?.type }}
                                isOptionEqualToValue={(option, value) => { return typeof (value) === "number" ? option.id === value : option.id === value.id }}
                                onChange={(event, values) => {
                                    field.onChange(values?.id)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Job Type"
                                        placeholder={jobDetails[0]?.work_location_type || ""}
                                        helperText={errors.work_location_type?.message}
                                        error={!!errors.work_location_type}
                                    />
                                )}
                            />
                        )}
                    />



                </div>

                {/*Job Experence Required */}


                <div className="my-4">
                    <Controller
                        control={control}
                        name="required_years_of_experience"
                        defaultValue={null}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={workExpereinceChoices}
                                getOptionLabel={(option) => { return option.type ? option.type : workExpereinceChoices.filter(data => data.id === option)[0]?.type }}
                                isOptionEqualToValue={(option, value) => { return typeof (value) === "number" ? option.id === value : option.id === value.id }}
                                onChange={(event, values) => {
                                    field.onChange(values?.id)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Required Years of Experience"
                                        placeholder={jobDetails[0]?.required_years_of_experience || ""}
                                        helperText={errors.required_years_of_experience?.message}
                                        error={!!errors.required_years_of_experience}
                                    />
                                )}
                            />
                        )}
                    />



                </div>





                {/* Job Level required  */}


                <div className="my-4">
                    <Controller
                        control={control}
                        name="level"
                        defaultValue={null}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={jobLevelChoices}
                                getOptionLabel={(option) => { return option.type ? option.type : jobLevelChoices.filter(data => data.id === option)[0]?.type }}
                                isOptionEqualToValue={(option, value) => { return typeof (value) === "number" ? option.id === value : option.id === value.id }}
                                onChange={(event, values) => {
                                    field.onChange(values?.id)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Required Job Level"
                                        placeholder={jobDetails[0]?.level || ""}
                                        helperText={errors.level?.message}
                                        error={!!errors.level}
                                    />
                                )}
                            />
                        )}
                    />



                </div>


                {/* Choose Industry */}
                <div className="my-4">
                    <Controller
                        control={control}
                        name="industry"
                        defaultValue={null}
                        render={({ field }) => (
                            <Autocomplete
                                {...field}
                                options={industries}
                                getOptionLabel={(option) => { return option.title_name ? option.title_name : industries.filter(data => data.id === option)[0]?.title_name }}
                                isOptionEqualToValue={(option, value) => { return typeof (value) === "number" ? option.id === value : option.id === value.id }}
                                onChange={(event, values) => {
                                    field.onChange(values?.id)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose One Industry"
                                        placeholder={jobDetails[0]?.industry || ""}
                                        helperText={errors.industry?.message}
                                        error={!!errors.industry}
                                    />
                                )}
                            />
                        )}
                    />



                </div>



                {/* Choose Skills */}
                {console.log(requiedSkills)}

                <div className="my-8">
                    <Controller
                        control={control}
                        name="required_skills"
                        defaultValue={jobDetails && jobDetails[0]?.required_skills ? jobDetails[0].required_skills.map(data => data.id) : []}
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
                                        label="Choose Multiple SKills"
                                        helperText={errors.skills?.message}
                                        error={!!errors.skills}
                                    />
                                )}
                            />
                        )}
                    />

                </div>

                {/* Choose Job Category */}
                <div className="my-8">
                    <Controller
                        control={control}
                        name="job_category"
                        defaultValue={jobDetails && jobDetails[0]?.job_category ? jobDetails[0].job_category.map(data => data.id) : []}
                        render={({ field }) => (
                            <Autocomplete
                                multiple
                                {...field}
                                disableCloseOnSelect
                                options={jobcategory}
                                getOptionLabel={(option) =>
                                    option ?
                                        typeof option === "number" ?
                                            (jobcategory.find(preffJob => preffJob.id === option) || {}).title || '' :
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
                                        placeholder={'Choose multiple Job Categories'}
                                        label='Choose multiple Job Categories'
                                        helperText={errors.job_category?.message}
                                        error={!!errors.job_category}
                                    />
                                )}
                            />
                        )}
                    />

                </div>


                {/* Select Degree */}
                <div className="my-8">
                    <Controller
                        control={control}
                        name="education_info"
                        defaultValue={jobDetails && jobDetails[0]?.education_info ? jobDetails[0].education_info.map(data => data.id) : []}
                        render={({ field }) => (
                            <Autocomplete
                                multiple
                                {...field}
                                disableCloseOnSelect
                                options={educationIfon}
                                getOptionLabel={(option) =>
                                    option ?
                                        typeof option === "number" ?
                                            (educationIfon.find(preffJob => preffJob.id === option) || {}).degree_name || '' :
                                            option.degree_name : ""
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
                                        placeholder={'Choose multiple Education Degree'}
                                        label='Choose multiple Education Degree'
                                        helperText={errors.education_info?.message}
                                        error={!!errors.education_info}
                                    />
                                )}
                            />
                        )}
                    />

                </div>



                {/* Apply before Before */}
                <div className="my-4">
                    <Controller
                        control={control}
                        defaultValue={''}
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
                                    onChange={onChange}
                                    value={value}
                                    inputRef={ref}
                                    format={"YYYY-MM-DD"}
                                    className="mt-4"
                                />
                            </LocalizationProvider>
                        )}
                    />

                </div>


                {/* Job Description */}

                <div className="mt-6">
                    <label htmlFor="description" className="text-sm">Job Description</label>
                    <div className="flex gap-4 items-center mt-1">
                        <Controller
                            control={control}
                            name="description"
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



                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
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
                            "Edit Job"
                        )}
                    </button>

                    <button
                        onClick={() => setAreYouSure(true)}
                        type="button"
                        className="mt-20 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                    >

                        Delete Job

                    </button>

                </div>

            </form>
            {areYouSure && <AreYourSureComponent handelDelete={handleDelete} handelNoDelete={handleCloseDeleteComp} handleModalClose={handleModalClose} open={open} />}
            {
                deleteSuccess && <DialogBox
                    dialogHeading={"Job Has  Deleted Sucessfully"}
                    dialogText={"Job has been deleted SuccessFully"}
                    goToPageName={"View All Jobs"}
                    url={"/recruiter/view-all-jobs"}
                    success={true}
                    deleteBox={true}
                />
            }

            {
                deleteError && <DialogBox
                    dialogHeading={"An Error occured during deletion"}
                    dialogText={"Please try again"}
                    error={true}
                />
            }
        </AdminDashBoardLayout>
    )
}

const AreYourSureComponent = ({ handelDelete, handelNoDelete, open, handleModalClose }) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => handleModalClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Are you Sure you Want To Delete?
                </DialogTitle>
                {/* <DialogContent>
                    <DialogContentText>
                        {dialogText}
                    </DialogContentText>
                </DialogContent> */}
                <DialogActions>

                    <Button onClick={() => handelDelete()} autoFocus>
                        Yes
                    </Button>


                    <Button onClick={() => { handelNoDelete() }} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}