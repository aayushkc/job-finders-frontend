"use client"

import logo from "../../public/images/logo.png"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GetRequestNoToken from "../api/getRequestNoToken";
export default function AnonUserHomePage({ pageNum, totalPage }) {

  const [recommendedJobs, setRecommendedJobs] = useState([])
  const router = useRouter()
  const getRecommendedJobs = async () => {
    try {
      const data = await GetRequestNoToken(`/job-seeker/get-all-job/?page=${pageNum}`)
      if (data.detail) {
        throw new Error("Cannot Fetch")
      }
      console.log(data);
      // The total count of data needs to be dividd by the number of data sent per page by backend
      const pages = Math.ceil(data.count / 4)
      totalPage = pages
      setRecommendedJobs(data.results)
    }
    catch (errors) {
      setRecommendedJobs([])
    }
  }


  useEffect(() => {
    getRecommendedJobs()
  }, [pageNum])

  useEffect(() => {
    getRecommendedJobs()
  }, [])

  return (
    <>
      <section className="text-center bg-white pt-8">
        <h1 className="text-[#193855] font-bold text-5xl leading-[78.4px]">Welcome to Hire Gurkha</h1>
        <p className="font-semibold text-3xl text-[#6A6666] mt-4">Ready to Apply for <span className="bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block text-transparent bg-clip-text">Jobs?</span></p>

        <div className="flex justify-center">
          <div className="bg-[#F3F4F8] mt-8 p-6 w-[80%]">
            <div>
              <h2 className="text-[#193855]  text-2xl">Best jobs that match your Skills</h2>
            </div>

            <div className="text-center text-2xl font-bold text-[#193855] mt-4">
<<<<<<< HEAD
              <p>Log in to view recommended Jobs </p>
=======
                   <p>Log in to view recommended Jobs </p> 
>>>>>>> 6065d95909bf43d85631dbeea53c47c784c36650

            </div>

          </div>

        </div>
      </section>

      <section className="text-center bg-white p-8  grid">
        <div className="px-16">
          <h2 className="text-xl">Available Jobs</h2>

          <div className="grid grid-cols-3 gap-4 text-left mt-6">
            {
              recommendedJobs?.map(data => {
                return (
                  <Link href={`/jobs?id=${data.id}&pageNum=${pageNum}`} key={data.id}>
                    <div className="px-6 py-4 rounded-2xl border-[1px] border-[#065F46]">
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
                            (data,index) => index < 2 && 
                                 <span key={index}>{index === 1 ? data.title + "..." : data.title + "/"}</span>
                             
                            
                            
                          )
                          :
                          data.required_skills.map((data) =>  data.title)
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

                      <div className="flex justify-between mt-4 items-center">
                        <div className="flex gap-2 items-center">
                          <i className="bi bi-people text-xl"></i>
                          <p className="text-[#01B46A]">{data.applied} Applied</p>
                        </div>

                        <p className="text-sm">Apply Before: {data.apply_before}</p>
                      </div>

                    </div>
                  </Link>
                )
              })}

          </div>

        </div>

      </section>
    </>
  );
}
