"use client"

import dynamic from 'next/dynamic';
import Link from 'next/link';

//Read-only Editor
import 'react-quill/dist/quill.snow.css';
import DialogBox from './sucessbox';
import ApplyJob from './applyjob';
import PostFormWithToken from '../api/postFormWithToken';
import { useState } from 'react';
import ShareButton from './Sharebutton';


const ReactQuillEditable = dynamic(
    () => import('react-quill'),
    { ssr: false }
);
export default function JobPanelData({ jobPanelData, isUserLoged, accessToken, pageNum }) {
    const modules = {
        toolbar: false

    }
    const [isAppliedClicked, setIsApplied] = useState(false)
    const [open, setOpen] = useState(true);
    const [success, setSuccess] = useState(false)
    const [falliure, setFaliure] = useState(false)

    const handleClose = () => {
        setOpen(false);
        setIsApplied(false)
    };

    const handleApplyClick = () => {
        setOpen(true)
        setSuccess(false)
        setFaliure(false)
        setIsApplied(true)
    }

    const handledApplied = async () => {


        const formData = new FormData()
        formData.append("job", jobPanelData.id)
        try {
            const data = await PostFormWithToken(`/job-seeker/create-job-request/`, formData)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            setIsApplied(false)
            setSuccess(true)


        }
        catch (errors) {

            setIsApplied(false)
            setFaliure(true)
        }
    }

    const urlTite= jobPanelData.title.replaceAll('-','').replaceAll(' ', '-').toLowerCase()
    return (
        <>

            {
                success && <DialogBox
                    dialogHeading={"Success"}
                    dialogText={"Your application has been sent successfully"}
                    success={true}
                    goToPageName={"Job Status"}
                    url={"/job-status"}
                />
            }

            {
                falliure && <DialogBox
                    dialogHeading={"An Error occured during Submission"}
                    dialogText={"Please try again"}
                    error={true}
                />
            }
            {
                isAppliedClicked &&
                <ApplyJob open={open} quizData={jobPanelData.quiz} jobId={jobPanelData.id} handleClose={handleClose} handledApplied={handledApplied} />
            }

            <div className="sm:h-screen sm:overflow-y-scroll bg-white relative px-4 sm:px-16">
                <header className="sticky bg-white w-full z-[999] top-[90px] flex flex-col py-4 sm:top-0 sm:min-h-[80px] sm:flex-row sm:justify-between sm:items-center sm:border-b sm:border-b-neutral-500">
                    <div className='flex gap-3 items-center mb-2 sm:mb-0 sm:basis-[60%]'>
                    
                        <h2 className="font-bold text-xl sm:text-2xl"><Link href={`/jobs/${jobPanelData.id}/${urlTite}?pageNum=${pageNum}`}>{jobPanelData.title}</Link></h2>
                    </div>

                    <div className='flex items-center gap-3'>
                        {
                            !accessToken ?
                                <Link href="/signin">
                                    <button className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white">
                                        Login to Apply
                                    </button>
                                </Link>
                                : !isUserLoged ?
                                    ""
                                    :
                                    jobPanelData.hasApplied ?
                                        <button disabled className="bg-green-300 rounded-3xl py-2 px-6 text-white">
                                            Already Applied
                                        </button>
                                        :
                                        <button onClick={handleApplyClick} className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white">
                                            Apply Now
                                        </button>


                        }
                     <ShareButton shareableUrl={`https://hiregurkha.com/jobs?id=${jobPanelData.id}&pageNum=${pageNum}&skills=null&industry=null#${jobPanelData.id}`} className={['']} />
                    </div>
                </header>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Job Type</h2>
                    <p className="text-sm text-[#79767C] mt-3">{jobPanelData.work_location_type}</p>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Domain</h2>
                    <p className="text-sm text-[#79767C] mt-3">{jobPanelData.industry}</p>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Job Categories</h2>
                    <div className="mt-4 flex flex-wrap gap-4">
                        {jobPanelData.job_category.length > 0 && jobPanelData.job_category.map(data => <div className="bg-[#FCE4B0] font-medium text-sm py-2 pl-3 pr-8 rounded-lg max-w-fit capitalize" key={data.id}> {data.title}</div>)}
                    </div>
                </div>


                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Company Name </h2>
                    <p className="text-sm text-[#79767C] mt-3">{jobPanelData.company}</p>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Required Skills </h2>
                    <div className="border-2 border-[#06BB0E] py-2 px-4 w-full mt-4 rounded-lg flex flex-wrap gap-4">
                        {jobPanelData.required_skills.map(data => <div className="bg-[#E6F8E7] font-medium text-sm py-2 pl-3 pr-8 rounded-lg max-w-fit capitalize" key={data.id}> {data.title}</div>)}
                    </div>


                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Experience</h2>
                    <p className="text-sm text-[#79767C] mt-3 capitalize">{jobPanelData.required_years_of_experience}</p>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Positions</h2>
                    <p className="text-sm text-[#79767C] mt-3 capitalize">{jobPanelData.number_of_vacancy}</p>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Location</h2>
                    <p className="text-sm text-[#79767C] mt-3 capitalize">{jobPanelData.job_location}</p>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">Job Description</h2>
                    <div className="w-full rounded-xl  py-4 px-3 text-[#475569] border-2 border-[#23232180] min-h-[300px] mt-3">
                        <ReactQuillEditable
                            theme="snow"
                            readOnly
                            value={jobPanelData.description}
                            modules={modules}
                            className="w-full bg-white min-h-[300px] read-quill"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-xl">About the Company</h2>
                    <div className="w-full rounded-xl  py-4 px-3 text-[#475569] border-2 border-[#23232180] min-h-[300px] mt-3">

                        <ReactQuillEditable
                            theme="snow"
                            readOnly
                            modules={modules}
                            value={jobPanelData.company_description}
                            className="w-full bg-white min-h-[300px] read-quill"
                        />
                    </div>
                </div>

                <div className="mt-8 mb-6">
                    <h2 className="font-semibold text-xl">Salary</h2>
                    <div className="text-lg text-[#79767C] mt-3 capitalize flex gap-4 items-center">
                        <i className="bi bi-coin text-[#FFB000] text-2xl"></i>
                        <p className="text-[#01B46A]">


                            {
                                jobPanelData.salary && <span>{jobPanelData.salary} $/month </span>
                            }
                            {
                                jobPanelData.min_salary && <span>{jobPanelData.min_salary} - {jobPanelData.max_salary} $/month </span>
                            }

                            {
                                !jobPanelData.min_salary && !jobPanelData.salary && <span>Undisclosed </span>
                            }
                        </p>
                    </div>
                </div>


            </div>
        </>

    )
}