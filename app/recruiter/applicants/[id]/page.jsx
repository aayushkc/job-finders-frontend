"use client"

import getRequestWithToken from "@/app/api/getRequestWithToken"
import AdminDashBoardLayout from "@/app/components/DashBoardLayout"
import ApplicantDisplayCard from "@/app/components/applicantcard"
import PaginationComponent from "@/app/components/paginationcomponent"
import Cookies from "js-cookie"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ApplicantList(){
    const accessToken = Cookies.get('accessToken')
    const router = useParams()
    const navigate = useRouter()
    const [jobsRequests,setJobsRequests] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const getJobRequests = async () => {
        try {
            const data = await getRequestWithToken(`/recruiter/view-recruiter-job-requests/${router.id}?page=${pageNum}`, accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            
            // The total count of data needs to be dividd by the number of data sent per page by backend
            const pages = Math.ceil(data.count / 3)
            setTotalPage(pages)
            setJobsRequests(data.results)
        }
        catch (errors) {
            setJobsRequests([])
        }
    }

    useEffect(()=>{
        getJobRequests()
    },[])

    const handlePageChange = (e, page) => {
        
        setPageNum(page)
    }
    return(
       <AdminDashBoardLayout>
            
            <section>
                {
                    jobsRequests.length > 0 ? <ApplicantDisplayCard applicant = {jobsRequests}/> :(
                        <div className="bg-white w-full h-[400px] flex justify-center items-center flex-col">
                           
                            <h1 className="font-bold text-4xl">No one has Applied yet!</h1>
                            <div>

                            
                            <button className="py-2 px-4 text-sm bg-gurkha-yellow text-white rounded-xl  mt-6" onClick={() => navigate.back() }> <i className="mr-1 bi bi-arrow-left"></i> Go back</button>
                            </div>
                           
                        </div>
                    )
                }
               
                
                
            </section>
            <div className="flex justify-end mt-6">
                <PaginationComponent onChange={handlePageChange} totalPage={totalPage} />
            </div>
       </AdminDashBoardLayout>
    )
}