import GetRequestNoToken from "@/app/api/getRequestNoToken";
import getRequestWithToken from "@/app/api/getRequestWithToken";
import JobPanelData from "@/app/components/JobPanelData";
import ServerPagination from "@/app/components/serverpagination";
import { data } from "autoprefixer";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

let currentJobIndex = null
async function getJobs(accessToken, isSeeker, pageNum, skills, industry) {
    let data = []

   
        if (accessToken && isSeeker) {
            data = await getRequestWithToken(`/job-seeker/recommended-jobs/?page=${pageNum}&industry=${industry}&skills=${skills}&currentJobIndex=${currentJobIndex}`, accessToken)
        } else {
            data = await GetRequestNoToken(`/job-seeker/get-all-job/?page=${pageNum}&industry=${industry}&skills=${skills}&currentJobIndex=${currentJobIndex}`)
        }

        if (data.detail) {
            throw new Error("Cannot fetch data")
        }

        return data


   

}

async function getJobFromIndex(currentJobIndex) {
    const data = await GetRequestNoToken(`/job-seeker/get-job/${currentJobIndex}`)
    return data
}
export default async function Jobs({ searchParams }) {
    const accessToken = cookies().get('accessToken')?.value || undefined
    const isSeeker = cookies().get('isSeeker')?.value || undefined
    const pageNum = searchParams?.pageNum || 1
    const skills = searchParams?.skills || null
    const industry = searchParams?.industry || null

    const jobsData = await getJobs(accessToken, isSeeker, pageNum, skills, industry).catch((err) => console.log(err))
    if (!jobsData) {
        return (
            <div className="bg-white pb-6  mx-20 h-screen flex justify-center items-center font-extrabold text-4xl">
                Could not Find Any Jobs!
            </div>
        )
    } else {
        const totalJobMatch = jobsData.count
        const jobs = jobsData.results
        const totalPage = Math.ceil(totalJobMatch / 9)
        currentJobIndex = searchParams?.currentJobIndex || jobs[0]?.id
        let jobPanelData = await getJobFromIndex(currentJobIndex).catch((err) => console.log(err))
        return (
            <>
                <section className="hidden sm:block sm:max-w-[1440px] pt-6 pb-10">
                    <div className="bg-white pb-6  mx-20 grid grid-cols-[450px_1fr]">
                        <div>
                            <div className="pl-6 py-4 border-r-[1px] border-r-[#DEE2E6] h-screen overflow-y-scroll">
                                <div className="bg-gurkha-yellow h-[55px] text-white py-4 pl-3">
                                    <span className="font-bold">{totalJobMatch} Jobs</span> Match Your Skills
                                </div>

                                {
                                    jobs?.map(data => {
                                        return (
                                            <div key={data.id} id={data.id}>
                                                <Link href={`jobs-server?pageNum=${pageNum}&industry=${industry}&skills=${skills}&currentJobIndex=${data.id}`}>
                                                    <div className={`pt-6 cursor-pointer pb-2 pl-4 ${data.id === jobPanelData?.id && 'bg-[#EBF3FA]'}`} key={data.id}>
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-[55px] h-[55px]">
                                                                <img src={data.logo} className="w-full h-full object-contain" alt="logo" />
                                                            </div>

                                                            <div>
                                                                <h2 className="font-bold text-lg capitalize">{data.title}</h2>
                                                                <p className="text-[#79767C]"> {data.company}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm mt-8 mb-2 text-[#4F5052] capitalize mt-2">
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

                                                        <div className="flex gap-2 font-medium items-center mt-8">
                                                            <p className="text-[#3C831B]"> {data.work_location_type} |</p>

                                                            {
                                                                data.salary && <p>{data.salary}$ <span className="text-[#828282] text-sm">/month</span></p>
                                                            }
                                                            {
                                                                data.min_salary && <p>{data.min_salary} - {data.max_salary}$ <span className="text-[#828282] text-sm">/month</span> </p>
                                                            }

                                                            {
                                                                !data.min_salary && !data.salary && <p>Undisclosed </p>
                                                            }
                                                        </div>


                                                    </div>
                                                </Link>

                                                <hr className=""></hr>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="flex justify-center">
                                <ServerPagination totalPages={totalPage} currentPage={pageNum} />
                            </div>

                        </div>



                        {
                            jobPanelData?.id ?

                                <Suspense>
                                    <JobPanelData jobPanelData={jobPanelData} accessToken={accessToken} isUserLoged={isSeeker} />
                                </Suspense>

                                :
                                <div className="flex justify-center items-center text-4xl font-bold">
                                    <h2>Loading.........</h2>
                                </div>
                        }





                    </div>
                </section>

                <section className="block sm:hidden sm:max-w-[1440px]">
                    <div className="bg-white pb-6  sm:mx-20">
                        <div>
                            <div className="py-4 border-r-[1px] border-r-[#DEE2E6] h-screen overflow-y-scroll">
                                <div className="bg-gurkha-yellow h-[55px] text-white py-4 pl-3">
                                    <span className="font-bold">{totalJobMatch} Jobs</span> Match Your Skills
                                </div>

                                {
                                    jobs?.map(data => {
                                        return (
                                            <Link href={`/jobs-server/${data.id}`} key={data.id}>
                                                <div key={data.id}>
                                                    <div className={`pt-6 cursor-pointer pb-2 pl-4 ${data.id === jobPanelData?.id && 'bg-[#EBF3FA]'}`} key={data.id}>
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-[55px] h-[55px]">
                                                                <img src={data.logo} className="w-full h-full object-contain" alt="logo" />
                                                            </div>

                                                            <div>
                                                                <h2 className="font-bold text-lg capitalize">{data.title}</h2>
                                                                <p className="text-[#79767C]"> {data.company}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm mt-8 mb-2 text-[#4F5052] capitalize mt-2">
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

                                                        <div className="flex gap-2 font-medium items-center mt-8">
                                                            <p className="text-[#3C831B]"> {data.work_location_type} |</p>

                                                            {
                                                                data.salary && <p>{data.salary}$ <span className="text-[#828282] text-sm">/month</span></p>
                                                            }
                                                            {
                                                                data.min_salary && <p>{data.min_salary} - {data.max_salary}$ <span className="text-[#828282] text-sm">/month</span> </p>
                                                            }

                                                            {
                                                                !data.min_salary && !data.salary && <p>Undisclosed </p>
                                                            }
                                                        </div>


                                                    </div>
                                                    <hr className=""></hr>
                                                </div>
                                            </Link>

                                        )
                                    })
                                }

                            </div>
                            <div className="flex justify-center">
                                <ServerPagination totalPages={totalPage} currentPage={pageNum} />
                            </div>

                        </div>
                    </div>

                </section>
            </>
        )
    }
}