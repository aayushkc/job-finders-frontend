"use client"
import GetRequestNoToken from "@/app/api/getRequestNoToken";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import ReactHookFormSelect from "@/app/components/industrychoices";
import SelectComponent from "@/app/components/selectbox";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, useMediaQuery } from "@mui/material";
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
    () => import ('react-quill'),
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
        }
        catch (errors) {
            setJobDetails([])
        }
    }

    const onSubmit = async (data) => {
        console.log(data.apply_before.format("YYYY-MM-DD"));
        const subData = {...data, 'apply_before':data.apply_before.format("YYYY-MM-DD")}
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
    useEffect(() => {
        getIndustries()
        getSkills()
        getJobCategory()
        getEducationInfo()
        getJob()
    }, [])

   

    useEffect(() => {
        setValue("title", jobDetails.title || "");
        setValue("number_of_vacancy", jobDetails.number_of_vacancy || "");
        setValue("salary", jobDetails.salary || "");
        setValue("job_location", jobDetails.job_location || "");
        setValue("required_skills", requiedSkills || []);
        setValue("job_category", selectedJobCategory || []);
        setValue("education_info", selectedEducationInfo || []);
        setValue("apply_before", dayjs(jobDetails.apply_before) || dayjs().startOf("D"));
        setValue("description", jobDetails.description || "");
        setValue("industry", industries.filter(indus => indus.title_name === jobDetails.industry)[0]?.id || '');

        if(selectedWorkLoc){
            setValue("work_location_type", selectedWorkLoc.id || 0);
        }

        if(selectedJobLevel){
            console.log(selectedJobLevel);
            setValue("level", selectedJobLevel.id || 0)
        }

        if(selectedWorkExperience){
            setValue("required_years_of_experience", selectedWorkExperience.id || 0)
        }

    }, [jobDetails])


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
                    <label htmlFor="salary" className="text-sm">Salary</label>
                    <div className="flex gap-4 items-center mt-1">
                        <input
                            {...register("salary", { required: true })}
                            type="number"
                            name='salary'
                            id="salary"
                            className="w-full rounded-xl bg-white py-4 px-3 text-black"
                        />
                    </div>
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

                <SelectComponent
                    name={"work_location_type"}
                    label={"Job Type"}
                    control={control}
                    defaultValue={selectedWorkLoc ? selectedWorkLoc.id : ''}
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
                    defaultValue={0}
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
                    defaultValue={selectedJobLevel ? selectedJobLevel.id : ''}
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



                {/* Choose Skills */}
                {console.log(requiedSkills)}

                <Controller

                    name="required_skills"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel id="skills">Skills</InputLabel>
                            <Select
                                {...field}
                                labelId="skills"
                                label="skills"
                                multiple
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
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel id="job_category">Job Category</InputLabel>
                            <Select
                                {...field}
                                labelId="job_category"
                                label="job_category"
                                multiple
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
                    className="my-4"
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel id="education_info">Select Required Degree</InputLabel>
                            <Select
                                {...field}
                                labelId="education_info"
                                label="education_info"
                                multiple
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
                    "Are you Sure you Want To Delete?"
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