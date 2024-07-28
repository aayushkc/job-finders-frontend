"use client"
import { useEffect, useState } from "react";
import getRequestWithToken from "../api/getRequestWithToken";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PaginationComponent from "../components/paginationcomponent";
import { APIENDPOINT } from "../api/APIENDPOINT";
import Cookies from "js-cookie";


export default function UserHomePage() {
    const accessToken = Cookies.get('accessToken')
    const isSeeker = Cookies.get('isSeeker')
    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [topTwo, setTopTwo] = useState([])
    const router = useRouter()
    const getRecommendedJobs = async () => {
        try {
            const data = await getRequestWithToken(`/job-seeker/recommended-jobs/?page=${pageNum}`, accessToken)
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

    const getTopTwoRecommendedJobs = async () => {
        try {
            const data = await getRequestWithToken(`/job-seeker/recommended-jobs/?page=1`, accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }

            setTopTwo(data.results)
        }
        catch (errors) {
            setTopTwo([])
        }
    }
    // Gets all the profileDetail of the request user
    const checkSeekerDetails = async () => {
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
                router.push("/create-profile")

            }
            getRecommendedJobs()
            getTopTwoRecommendedJobs()
        } catch (error) {
            console.error('There was a problem with the fetch request:', error);
            // Handle error
            return { error: error.message };
        }
    }

    const handlePageChange = (e, page) => {

        setPageNum(page)

    }
    useEffect(() => {
        if (accessToken && isSeeker) {
            getRecommendedJobs()
        }

    }, [pageNum, accessToken])

    useEffect(() => {

        if (accessToken && isSeeker) {
            checkSeekerDetails()
        }

    }, [accessToken, isSeeker])
    return (
        <>
            <section className="text-center bg-white pt-8">
                <h1 className="text-[#193855] font-bold text-3xl sm:text-5xl sm:leading-[78.4px]">Welcome to Hire Gurkha</h1>
                <p className="font-semibold text-2xl sm:text-3xl text-[#6A6666] mt-4">Ready to Apply for <span className="bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block text-transparent bg-clip-text">Jobs?</span></p>

                <div className="flex justify-center px-4">
                    <div className="bg-[#F3F4F8] mt-8 p-6 sm:w-[80%]">
                        <div>
                            <h2 className="text-[#193855] text-lg sm:text-2xl">Best jobs that match your Skills</h2>
                        </div>

                        <div className="mt-4 grid sm:grid-cols-2 gap-6">
                            {
                                topTwo?.map((data, index) => {

                                    return (
                                        index < 2 &&
                                        <div className="bg-white p-4 sm:p-6 text-left rounded-lg" key={index}>
                                            <div className="flex gap-4 items-center">
                                                <div className="w-[35px] h-[35px]">
                                                    <img src={data ? data.logo : logo} className="w-full h-full object-contain" alt="logo" />
                                                </div>
                                                <div>
                                                    <h2 className="font-bold text-lg sm:text-xl">{data.title}</h2>
                                                    <p className="">{data.job_category[0].title}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm my-2">
                                                <p className="">Skills:
                                                    <span className="text-black">
                                                        {
                                                            data.required_skills.length >= 2 ?
                                                                data.required_skills.map(
                                                                    (data, index) => index < 2 &&
                                                                        <span key={index}>{index === 1 ? data.title + "..." : data.title + "/"}</span>



                                                                )
                                                                :
                                                                data.required_skills.map((data) => data.title)
                                                        }
                                                    </span>
                                                </p>

                                            </div>

                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-3 pr-4">
                                                <p className="text-[#01B46A]">Location Type: <span>{data.work_location_type}</span></p>
                                                <Link href={`/jobs?id=${data.id}&pageNum=1`}>
                                                    <button className="text-[#0B69FF] mt-3 sm:mt-0">View Details <i className="bi bi-arrow-up-right"></i></button>
                                                </Link>

                                            </div>

                                            <div className="mt-4">

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
                                            <hr className="my-3"></hr>

                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <div className="flex gap-2 items-center">
                                                    <i className="bi bi-people text-xl"></i>
                                                    <p className="text-[#01B46A]">{data.applied} Applied</p>
                                                </div>
                                                <Link href={`/jobs?id=${data.id}&pageNum=1`}>
                                                    <button className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white mt-4 sm:mt-0">
                                                        Apply Now
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>

                                    )

                                })
                            }




                        </div>

                    </div>

                </div>
            </section>

            <section className="text-center bg-white p-8  grid">
                <div className="sm:px-16">
                    <h2 className="text-xl">Recommended Jobs</h2>

                    <div className="grid sm:grid-cols-3 gap-4 text-left mt-6">
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
                            })}

                    </div>

                    <div className="flex justify-center mt-10">
                        <PaginationComponent onChange={handlePageChange} page={pageNum} totalPage={totalPage} />
                    </div>



                </div>

            </section>
        </>
    )
}