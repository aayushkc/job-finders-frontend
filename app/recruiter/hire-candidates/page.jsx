"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken";
import getRequestWithToken from "@/app/api/getRequestWithToken";
import PostWithTokien from "@/app/api/postWithToken";
import DialogBox from "@/app/components/sucessbox";
import ProtectedAdminPage from "@/app/utils/auth";
import { Autocomplete, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { Controller, useForm } from 'react-hook-form'


import 'react-quill/dist/quill.snow.css';


const ReactQuillEditable = dynamic(
  () => import('react-quill'),
  { ssr: false }
);
export default function HireCandidates() {
  const router = useRouter()
  //React Quill Modules
  const modules = {
    toolbar: false

  }
  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [quizSet, setQuizSet] = useState([])
  const [jobcategory, setJobCategory] = useState([]);
  const [educationIfon, setEducationInfo] = useState([]);
  const [showCalendly, setShowCalendly] = useState(false);
  const [jobSuccess, setJobSuccess] = useState(false)
  const [jobError, setJobError] = useState(false)
  const [showSalaryRange, setShowSalaryRange] = useState(false)
  const [showFixedSalary, setShowFixedSalary] = useState(false)
  const accessToken = Cookies.get('accessToken');
  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm()

  const formData = watch();

  const workExpereinceChoices = [
    {
      "id": 0,
      "type": "0-1 Year"
    },
    {
      "id": 1,
      "type": "1-3 years"
    },
    {
      "id": 2,
      "type": "3-6 yearrs"
    },
    {
      "id": 3,
      "type": "More than Six years"
    }
  ]


  const getSkills = async () => {
    try {
      const data = await GetRequestNoToken(`/get-skills/?industry=${formData.industry ? formData.industry : null}`)
      if (data.detail) {
        throw new Error("Cannot Fetch")
      }
      setSkills(data)
    }
    catch (errors) {
      setSkills([{ "id": "", "title": "" }])
    }
  }

  const getQuizSet= async () => {
    try {
      const data = await getRequestWithToken(`/quiz/get-quiz-name`,accessToken)
      if (data.detail) {
        throw new Error("Cannot Fetch")
      }
      console.log(data);
      setQuizSet(data)
    }
    catch (errors) {
      setQuizSet([{ "id": "", "quiz_name": "" }])
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
      setEducationInfo(data)
     
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

    onEventScheduled: (e) => handleSubmit(async (data) => {
      // Submit the form data to your backend or perform any other action
      const d = {
        ...data,

        "required_years_of_experience": parseInt(data.required_years_of_experience),
        "level": parseInt(data.level)
      }

      try {
        const res = await PostWithTokien('/recruiter/add-job/', d)
       
        if (res.detail) {
         
          throw new Error("Cannot Fetch")
        }
        setJobSuccess(true)
      }
      catch (errors) {
      
        setJobError(true)
      }
    })()
  })

  const onSubmit = async (data) => {

    const d = {
      ...data,

      "required_years_of_experience": parseInt(data.required_years_of_experience),
      "level": parseInt(data.level)
    }
    setShowCalendly(true)

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
    getIndustries()
    getJobCategory()
    getEducationInfo()
    getQuizSet()
    setShowCalendly(false)
  }, [])

  useEffect(() => {
    getSkills()

  }, [formData.industry])

  return (
    <ProtectedAdminPage>
      {
        jobSuccess && <DialogBox
          dialogHeading={"Job Request Sent Sucessfully"}
          dialogText={"Request for Job Approval has benn sent successFully"}
          goToPageName={"View All Pending Jobs"}
          url={"/recruiter/view-all-pending-jobs"}
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
      <section className="flex">
        <div className="bg-white  sm:mt-6 sm:ml-12 sm:w-[95%] rounded-2xl mb-8">
          <h1 className="text-5xl text-[#193855] font-bold text-center pt-10 sm:text-3xl">Welcome to Hire Gurkha</h1>
          <div className="flex justify-center ">
            <div className="border-[1px] w-[144px] border-gurkha-yellow my-8"></div>
          </div>
          <h2 className="text-3xl text-center font-semibold text-[#6A6666]">Ready to Hire <span className="bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block text-transparent bg-clip-text">Candidates?</span></h2>

          <section className="flex justify-center items-center mt-6 gap-2">
            <div className={`${showCalendly ? 'bg-[#D9D9D9]' : 'bg-[#FFB000]'} w-[33px] h-[6px] rounded-xl`}></div>
            <div className={`${showCalendly ? 'bg-[#FFB000]' : 'bg-[#D9D9D9]'} w-[33px] h-[6px] rounded-xl`}></div>

          </section>

          {
            showCalendly ? <div className="">
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
                      {errors.title ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.title.message}</p> : ""}
                    </div>

                    {/* Number of Vacancy */}
                    <div className="my-4">
                      <label htmlFor="vacancy-number" className="text-sm">Number of Vacancy*</label>
                      <div className="flex gap-4 items-center mt-1">
                        <input
                          {...register("number_of_vacancy", { required: "This field is required", min: 1 })}
                          type="number"
                          name='number_of_vacancy'
                          id="number_of_vacancy"
                          className="w-full rounded-xl bg-white py-4 px-3 text-black"
                          placeholder="Enter Number of Vacancy" />
                      </div>
                      {errors.number_of_vacancy ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.number_of_vacancy.message}</p> : ""}
                    </div>

                    {/* Salary Amount */}
                    <div className="my-4">
                      <FormControl className="mt-4">
                        <FormLabel id="salary-radio-buttons-group-label" className="text-sm">Salary</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="salary-radio-buttons-group-label"
                          name="salary-radio-buttons-group"
                          className="mt-3 ml-2 gap-3"
                          onChange={handleSalaryRadioChange}

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
                                <input min="1" type="number" {...register("min_salary", { required: "Salary is required" })} id="min_salary" className="w-full rounded-xl bg-white py-4 px-3 text-black" />

                              </div>

                              <div className="flex gap-4 items-center mt-1 mb-4">
                                <label htmlFor="max_salary" className="text-sm basis-[30%]">Max</label>
                                <input min="1" type="number" {...register("max_salary", { required: "Salary is required" })} id="max_salary" className="w-full rounded-xl bg-white py-4 px-3 text-black" />

                              </div>

                            </div>
                          )
                        }

                        {showFixedSalary &&
                          (


                            <div className="flex gap-4 items-center mt-3 mb-4">
                              <label htmlFor="salary" className="text-sm basis-[20%] font-bold">Enter Salary</label>
                              <input min="1" type="number" {...register("salary", { required: "Salary is required" })} id="salary" className="w-full rounded-xl bg-white py-4 px-3 text-black" />

                            </div>


                          )
                        }
                      </FormControl>
                    </div>


                    {/* Site Location */}
                    <div className="my-4">
                      <label htmlFor="site-location" className="text-sm">Site Location*</label>
                      <div className="flex gap-4 items-center mt-1">
                        <input
                          {...register("job_location", { required: "This field is required" })}
                          type="text"
                          name='job_location'
                          id="job_location"
                          className="w-full rounded-xl bg-white py-4 px-3 text-black"
                          placeholder="Enter Job Site Location" />
                      </div>
                      {errors.job_location ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.job_location.message}</p> : ""}
                    </div>


                    {/* work Location Type */}

                    <div className="my-4">
                      <FormControl className="mt-4">
                        <FormLabel id="demo-row-radio-buttons-group-label" className="text-sm">Job Type*</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          className="mt-3 ml-2 gap-3"

                        >
                          <FormControlLabel value="0" control={<Radio size="small" {...register('work_location_type', { required: "This field is required" })} />} label="Remote" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                          <FormControlLabel value="1" control={<Radio size="small" {...register('work_location_type', { required: "This field is required" })} />} label="On-Site" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                          <FormControlLabel value="2" control={<Radio size="small" {...register('work_location_type', { required: "This field is required" })} />} label="Hybrid" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                        </RadioGroup>
                      </FormControl>
                      {errors.work_location_type ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.work_location_type.message}</p> : ""}
                    </div>

                    {/* Job Level required  */}

                    <div className="my-4">
                      <FormControl className="mt-4">
                        <FormLabel id="demo-row-radio-buttons-group-label" className="text-sm">Required Job Experience Level*</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          className="mt-3 ml-2 gap-3"

                        >
                          <FormControlLabel value="0" control={<Radio size="small" {...register('level', { required: "This field is required" })} />} label="Intern" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                          <FormControlLabel value="1" control={<Radio size="small" {...register('level', { required: "This field is required" })} />} label="Freshers" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                          <FormControlLabel value="2" control={<Radio size="small" {...register('level', { required: "This field is required" })} />} label="Experienced" className="border-[0.5px] border-[#CFD1D4] rounded py-[4px] pr-2" />
                        </RadioGroup>
                      </FormControl>
                      {errors.level ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.level.message}</p> : ""}
                    </div>

                    {/* Choose Industry */}
                    <div className="my-4">
                      <Controller
                        control={control}
                        name="industry"
                        rules={{ required: "Industry is Required" }}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            defaultValue={null}
                            options={industries}
                            getOptionLabel={(option) => option.title_name}
                            onChange={(event, values) => {
                              onChange(values?.id)
                              setValue("required_skills", [])
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
                    

                     {/* Choose Quiz Set */}
                     <div className="my-4">
                      <Controller
                        control={control}
                        name="quiz"
                        // rules={{ required: "Quiz  is Required" }}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            defaultValue={null}
                            options={quizSet}
                            getOptionLabel={(option) => option.quiz_name}
                            onChange={(event, values) => {
                              onChange(values?.id)
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Choose One Quiz Set"
                                placeholder="Choose One Quiz Set"
                                helperText={errors.quiz?.message}
                                error={!!errors.quiz}
                              />
                            )}
                          />)}
                      />

                    </div>

                    {/* Choose Skills */}

                    {
                      formData.industry && (
                        <div className="my-4">

                          <Controller
                            control={control}
                            name="required_skills"
                            rules={{ required: "Skills is Required" }}
                            render={({ field }) => (
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
                                    helperText={errors.required_skills?.message}
                                    error={!!errors.required_skills}
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                      )
                    }


                    {/*Job Experence Required */}

                    <div className="my-4">

                      <Controller
                        control={control}
                        name="required_years_of_experience"
                        rules={{ required: "This field is Required" }}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            defaultValue={null}
                            options={workExpereinceChoices}
                            getOptionLabel={(option) => option.type}
                            onChange={(event, values) => {
                              onChange(values?.id)
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Choose One Required Years of Experience"
                                placeholder="Choose One Required Years of Experience"
                                helperText={errors.required_years_of_experience?.message}
                                error={!!errors.required_years_of_experience}
                              />
                            )}
                          />)}
                      />
                    </div>


                    {/* Choose Job Category */}
                    <div className="my-4">
                      <Controller
                        control={control}
                        name="job_category"
                        rules={{ required: "Job Keywords is Required" }}
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
                        rules={{ required: "Education Info is Required" }}
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
                                helperText={errors.education_info?.message}
                                error={!!errors.education_info}
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
                      rules={{ required: "Appy Before Data is Required" }}
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
                          rules={{ required: "Description is Required" }}
                          render={({ field: { onChange, value } }) => (
                            <ReactQuillEditable
                              theme="snow"
                              value={value}
                              onChange={onChange}
                              className="w-full bg-white read-quill write-quill" />

                          )}
                        />



                      </div>
                      {errors.description ? <p className="text-sm text-left mb-2 font-bold text-[#E33629]">{errors.description.message}</p> : ""}
                    </div>
                    <button
                      className="mt-6 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                      type="submit"
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