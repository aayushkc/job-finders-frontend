"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken";
import PostWithTokien from "@/app/api/postWithToken";
import DialogBox from "@/app/components/sucessbox";
import ProtectedAdminPage from "@/app/utils/auth";
import { Autocomplete, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { Controller, useForm } from 'react-hook-form'


import 'react-quill/dist/quill.snow.css';


const ReactQuillEditable = dynamic(
    () => import ('react-quill'),
    { ssr: false }
);
export default function HireCandidates() {
  const router = useRouter()

  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [jobcategory, setJobCategory] = useState([]);
  const [educationIfon, setEducationInfo] = useState([]);
  const [showCalendly, setShowCalendly] = useState(false);
  const [jobSuccess,setJobSuccess] = useState(false)
  const [jobError, setJobError] = useState(false)

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
  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm()

  const formData = watch();

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

  useCalendlyEventListener({

    onEventScheduled: (e) => handleSubmit(async(data) => {
      // Submit the form data to your backend or perform any other action
      const d ={...data, 
        "job_location_type":parseInt(data.job_location_type),
        "required_years_of_experience":parseInt(data.required_years_of_experience),
      "level":parseInt(data.level)}

      try {
        const res = await PostWithTokien('/recruiter/add-job/', d)
        console.log(res);
        if (res.detail) {
            console.log(res);
            throw new Error("Cannot Fetch")
        }
       setJobSuccess(true)
    }
    catch (errors) {
        console.log("ENteerereddddddd");
        console.log(errors);
        setJobError(true)
    }
    })()
  })

  const onSubmit = async (data) => {
  
    const d ={...data, 
      "job_location_type":parseInt(data.job_location_type),
      "required_years_of_experience":parseInt(data.required_years_of_experience),
    "level":parseInt(data.level)}
    console.log("Form Data: ", d);
    setShowCalendly(true)

  }


  useEffect(() => {
    getIndustries()
    getSkills()
    getJobCategory()
    getEducationInfo()
  }, [])


  return (
    <ProtectedAdminPage>
       {
                jobSuccess &&<DialogBox
                                dialogHeading={"Job Request Sent Sucessfully"} 
                                dialogText={"Request for Job Approval has benn sent successFully"}
                                goToPageName={"View All Pending Jobs"}
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
      <section className="flex">
        <div className="bg-white  mt-6 ml-12 w-[95%] rounded-2xl mb-8">
          <h1 className="text-5xl text-[#193855] font-bold text-center pt-10">Welcome to Hire Gurkha</h1>
          <div className="flex justify-center ">
            <div className="border-[1px] w-[144px] border-gurkha-yellow my-8"></div>
          </div>
          <h2 className="text-3xl text-center font-semibold text-[#6A6666]">Ready to Hire <span className="bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block text-transparent bg-clip-text">Candidates?</span></h2>

          <section className="flex justify-center items-center mt-6 gap-2">
            <div className={`${showCalendly ? 'bg-[#D9D9D9]' : 'bg-[#FFB000]'} w-[33px] h-[6px] rounded-xl`}></div>
            <div className={`${showCalendly ? 'bg-[#FFB000]' : 'bg-[#D9D9D9]'} w-[33px] h-[6px] rounded-xl`}></div>

          </section>

          {
            showCalendly ?<div className="">
              <InlineWidget url="https://calendly.com/aayush-nexsewa/job-request" />
            </div>
            :
            (
              <section className="flex justify-center mb-6">
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-[#F3F4F8] p-6 rounded-xl max-w-[800px]">
  
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
                      {...register("number_of_vacancy", { required: true, min: 1 })}
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
  
                <div className="my-4">
                  <FormControl className="mt-4">
                    <FormLabel id="demo-row-radio-buttons-group-label" className="text-sm">Job Type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      className="mt-3 ml-2 gap-3"
  
                    >
                      <FormControlLabel value="0" control={<Radio size="small" {...register('work_location_type', { required: "Requried" })} />} label="Remote" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                      <FormControlLabel value="1" control={<Radio size="small" {...register('work_location_type', { required: "Requried" })} />} label="On-Site" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                      <FormControlLabel value="2" control={<Radio size="small" {...register('work_location_type', { required: "Requried" })} />} label="Hybrid" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                    </RadioGroup>
                  </FormControl>
                </div>
  
  
                {/*Job Experence Required */}
  
                <div className="my-4">
                  <FormControl className="mt-4">
                    <FormLabel id="demo-row-radio-buttons-group-label" className="text-sm">Required Years of Experience</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      className="mt-3 ml-2 gap-3"
  
                    >
                      <FormControlLabel value="0" control={<Radio size="small" {...register('required_years_of_experience', { required: "Requried" })} />} label="Not Important" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                      <FormControlLabel value="1" control={<Radio size="small" {...register('required_years_of_experience', { required: "Requried" })} />} label="Less Than Three" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                      <FormControlLabel value="2" control={<Radio size="small" {...register('required_years_of_experience', { required: "Requried" })} />} label="Between Three and Six" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                      <FormControlLabel value="3" control={<Radio size="small" {...register('required_years_of_experience', { required: "Requried" })} />} label="More Than Six" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                    </RadioGroup>
                  </FormControl>
                </div>
  
  
  
                {/* Job Level required  */}
  
                <div className="my-4">
                  <FormControl className="mt-4">
                    <FormLabel id="demo-row-radio-buttons-group-label" className="text-sm">Required Job Experience Level</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      className="mt-3 ml-2 gap-3"
  
                    >
                      <FormControlLabel value="0" control={<Radio size="small" {...register('level', { required: "Requried" })} />} label="Intern" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                      <FormControlLabel value="1" control={<Radio size="small" {...register('level', { required: "Requried" })} />} label="Freshers" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                      <FormControlLabel value="2" control={<Radio size="small" {...register('level', { required: "Requried" })} />} label="Experienced" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                    </RadioGroup>
                  </FormControl>
                </div>
  
                {/* Choose Industry */}
                <div className="my-4">
                  <Controller
                    control={control}
                    name="industry"
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
  
  
  
  
                {/* Choose Skills */}
                <div className="my-4">
  
                  <Controller
                    control={control}
                    name="required_skills"
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        defaultValue={[]}
                        multiple
                        disableCloseOnSelect
                        options={skills}
                        getOptionLabel={(option) => option.title}
                        onChange={(event, values) => {
                          onChange(values.map(val => { return val.id }))
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
  
  
                {/* Choose Job Category */}
                <div className="my-4">
                  <Controller
                    control={control}
                    name="job_category"
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        defaultValue={[]}
                        multiple
                        disableCloseOnSelect
                        options={jobcategory}
                        getOptionLabel={(option) => option.title}
                        onChange={(event, values) => {
                          onChange(values.map(val => { return val.id }))
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Choose Job KeyWords"
                            placeholder="Choose Job KeyWords"
                            helperText={errors.job_category?.message}
                            error={!!errors.job_category}
                          />
                        )}
                      />
                    )}
                  />
  
                </div>
  
  
                {/* Select Degree */}
                <div className="my-4">
                  <Controller
                    control={control}
                    name="education_info"
                    render={({ field: { onChange } }) => (
                      <Autocomplete
                        defaultValue={[]}
                        multiple
                        disableCloseOnSelect
                        options={educationIfon}
                        getOptionLabel={(option) => option.degree_name}
                        onChange={(event, values) => {
                          onChange(values.map(val => { return val.id }))
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Choose Required Education Level"
                            placeholder="Choose Required Education Level"
                            helperText={errors.prefferd_job?.message}
                            error={!!errors.prefferd_job}
                          />
                        )}
                      />
                    )}
                  />
  
                </div>
  
  
  
                {/* Apply before Before */}
                <Controller
                  control={control}
                  defaultValue={''}
                  name="apply_before"
                  rules={{
                    required: {
                      value: true,
                      message: "Date of Birth is required",
                    },
                  }}
                  render={({ field: { onChange, value, ref } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                      <DatePicker
                        label="Apply Before"
                        disablePast
                        onChange={(value) => onChange(value.format("YYYY-MM-DD"))}
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
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <ReactQuillEditable 
                              theme="snow" 
                              value={value} 
                              onChange={onChange} 
                              className="w-full bg-white "/>
  
                      )}
                    />
  
  
  
                  </div>
                </div>
                <button
                  className="mt-20 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                  type="submit"
                  disabled={!isValid}
                >
                  Next
                </button>
              </form>
            </section>
            )
          }


         
         




        </div>

      </section>

    </ProtectedAdminPage>

  )
}