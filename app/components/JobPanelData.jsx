"use client"

import dynamic from 'next/dynamic';
import Link from 'next/link';

//Read-only Editor
import 'react-quill/dist/quill.snow.css';


const ReactQuillEditable = dynamic(
    () => import('react-quill'),
    { ssr: false }
);
export default function JobPanelData({ jobPanelData, handleApplyClick, isUserLoged }) {
    const modules = {
        toolbar: false

    }
    return (
        <>
        <Link href="/jobs" className='sm:hidden'>
        <div className='p-5 flex gap-4 items-center'>
            <i className='bi bi-arrow-left'></i>
            <p className='text-[#537FE7] underline'>Go Back</p>
        </div>
        </Link>
       
         <div className="p-6   sm:px-16 bg-white">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h2 className="font-bold text-xl sm:text-2xl mb-5">{jobPanelData.title}</h2>
                {
                    isUserLoged ?
                        jobPanelData.hasApplied ?
                            <button disabled className="bg-green-300 rounded-3xl py-2 px-6 text-white">
                                Already Applied
                            </button>
                            :
                            <button onClick={() => handleApplyClick()} className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white">
                                Apply Now
                            </button>
                        :
                        <Link href="/signin">
                         <button className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white">
                            Log In to Apply
                        </button>
                        </Link>
                       
                }


            </div>

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
                            jobPanelData.salary && <p>{jobPanelData.salary} $/month </p>
                        }
                        {
                            jobPanelData.min_salary && <p>{jobPanelData.min_salary} - {jobPanelData.max_salary} $/month </p>
                        }

                        {
                            !jobPanelData.min_salary && !jobPanelData.salary && <p>Undisclosed </p>
                        }
                    </p>
                </div>
            </div>
            {
                isUserLoged ?
                    !jobPanelData.hasApplied &&
                    (<button onClick={() => handleApplyClick()} className="bg-[#FFB000] rounded-3xl py-2 px-6 mt-4 text-white">
                        Apply Now
                    </button>)
                    :
                    <Link href={"/signin"}>
                        <button  className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white">
                            Log In to Apply
                        </button>
                    </Link>
            }



        </div>
        </>
       
    )
}