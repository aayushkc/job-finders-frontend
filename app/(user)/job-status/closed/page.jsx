"use client"

import getRequestWithToken from "@/app/api/getRequestWithToken"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export default function Closed() {
    const accessToken = Cookies.get('accessToken')
    const [appliedJobs, setAppliedJobs] = useState([])

    const getAppliedJobs = async () => {
        try {
            const data = await getRequestWithToken(`/job-seeker/get-job-request/`, accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            
            setAppliedJobs(data.filter(data => data.seen_status === 1 && data.status === 1 || data.seen_status ===0 && data.status === 1))
            // The total count of data needs to be dividd by the number of data sent per page by backend



        }
        catch (errors) {
            setAppliedJobs([])
        }
    }

    useEffect(() => {
        getAppliedJobs()
    }, [])
    return (
        <>
            {
                appliedJobs.length > 0 ?
                    appliedJobs.map(data => {
                        return (
                            <div key={data.id} className="bg-white mt-8 rounded-xl p-6">
                                <div className="flex flex-col sm:flex-row  gap-4 sm:gap-8 sm:items-center">
                                    <div className="text-xl font-semibold flex gap-2 items-center">
                                        <i className="bi bi-briefcase"></i>
                                        <h2>{data.job.title}</h2>
                                    </div>

                                    <div>
                                        Applied on: {data.applied_on}
                                    </div>
                                </div>

                                <div className="text-[#149236] text-sm flex gap-2 capitalize mt-3 sm:mt-1">
                                    <p>{data.job.work_location_type}</p>
                                    <p>{data.job.required_years_of_experience} years of experience</p>
                                    {/* <button className="text-[#0B69FF]">View Details</button> */}
                                </div>

                                <div className="flex flex-col gap-1 font-medium  mt-8">
                                    <p className=""> Salary/Month</p>
                                    <p className="sm:text-lg">
                                         {
                                            data.salary && <p>{data.salary}$ <span className="text-[#828282]">/month</span></p>
                                        }
                                        {
                                            data.min_salary && <p>{data.min_salary} - {data.max_salary}$ <span className="text-[#828282]">/month</span> </p>
                                        }

                                        {
                                            !data.min_salary && !data.salary && <p>Undisclosed </p>
                                        }
                                        </p>
                                </div>

                                <div className={`w-full rounded-xl p-4 flex gap-4 items-center mt-6 ${data.status === 1 && 'bg-red-500'}`}>
                                    <div className="bg-[#DDEAFF] rounded-full px-4 py-3">
                                        <i className="bi bi-x text-[#2D60FE]"></i>
                                    </div>

                                    <div className="text-white">
                                        <p className="font-semibold sm:text-lg">{data.status === 1 && "Your application has been rejected."}</p>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                    :
                    <div className="font-bold text-5xl flex items-center justify-center h-[400px] bg-white">
                        No jobs Closed
                    </div>
            }
        </>
    )
}