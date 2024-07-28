"use client"
import { useEffect, useState } from "react"
import GetRequestNoToken from "../api/getRequestNoToken"
import PaginationComponent from "./paginationcomponent"
import Link from "next/link"

export default function HomePageJobDisplayComponent() {
    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const getRecommendedJobs = async () => {
        try {
            const data = await GetRequestNoToken(`/job-seeker/get-all-job/?page=${pageNum}`)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }

            // The total count of data needs to be dividd by the number of data sent per page by backend
            const pages = Math.ceil(data.count / 9)
            setTotalPage(pages)
            setRecommendedJobs(data.results)
        }
        catch (errors) {
            setRecommendedJobs([])
        }
    }

    const handlePageChange = (e, page) => {

        setPageNum(page)

    }
    useEffect(() => {
        getRecommendedJobs()
    }, [pageNum])

    return (
        <>
            <div className="grid sm:grid-cols-3 gap-4 text-left">
                {
                    recommendedJobs?.map(data => {
                        return (
                            <Link href={`/jobs?id=${data.id}&pageNum=${pageNum}`} key={data.id}>
                                <div className={`px-6 py-4 rounded-2xl border-[1px] ${data.has_expried ? 'border-[#B40C01]' : 'border-[#065F46]'}`}>
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-bold">{data.title}</h2>
                                        <i className="bi bi-bookmark text-lg text-[#475569]"></i>
                                    </div>
                                    <p className="">{data.job_category[0]?.title}</p>
                                    <h2 className="text-[#4F5052] text-lg mt-1">{data.company}</h2>

                                    <div className="text-sm my-2">
                                        <p className="">Skills: <span className="text-black">
                                            {
                                                data.required_skills.length >= 2 ?
                                                    data.required_skills.map(
                                                        (data, index) => index < 2 &&
                                                            <span key={index}>{index === 1 ? data.title + "..." : data.title + "/"}</span>



                                                    )
                                                    :
                                                    data.required_skills.map((data) => data.title)
                                            }

                                        </span></p>


                                    </div>

                                    <div className="flex flex-col gap-2 mt-3">
                                        <div className="flex gap-2 items-center text-sm bg-[#FEF4DF] px-4 py-2 rounded-2xl max-w-max">
                                            <p className="">Location:</p>
                                            <p className="text-[#4F5052] font-light">{data.job_location}</p>
                                        </div>

                                        <div className="flex gap-2 items-center text-sm bg-[#FEF4DF] px-4 py-2 rounded-2xl max-w-max">
                                            <p className="">Experience Required:</p>
                                            <p className="text-[#4F5052] font-light capitalize">{data.required_years_of_experience}</p>
                                        </div>




                                    </div>
                                    <div className="flex gap-2 items-center mt-4">
                                        <i className="bi bi-coin text-[#FFB000] text-xl"></i>
                                        {
                                            data.salary && <p className="text-[#01B46A]">{data.salary} $/month </p>
                                        }
                                        {
                                            data.min_salary && <p className="text-[#01B46A]">{data.min_salary} - {data.max_salary} $/month </p>
                                        }

                                        {
                                            !data.min_salary && !data.salary && <p className="text-[#01B46A]">Undisclosed </p>
                                        }
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:justify-between mt-4 sm:items-center">
                                        <div className="flex gap-2 items-center">
                                            <i className="bi bi-people text-xl"></i>
                                            <p className="text-[#01B46A]">{data.applied} Applied</p>
                                        </div>

                                        <p className="text-sm mt-4 sm:mt-0">{data.has_expried ? <span className="text-[#B40C01]">Expried</span>: 'Apply Before: ' + data.apply_before}</p>
                                    </div>

                                </div>
                            </Link>
                        )
                    })

                }
            </div>


            <div className="flex justify-center mt-10">
              <PaginationComponent onChange={handlePageChange} page={pageNum} totalPage={totalPage} />
            </div>


        </>
    )


}

