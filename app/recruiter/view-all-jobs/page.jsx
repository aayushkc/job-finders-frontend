"use client"
import getRequestWithToken from "@/app/api/getRequestWithToken";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import JobDisplayCard from "@/app/components/jobdisplaycard";
import PaginationComponent from "@/app/components/paginationcomponent";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


export default function ViewJobs() {

    const accessToken = Cookies.get('accessToken')
    const [jobs, setJobs] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const getAllJobs = async () => {
        try {
            const data = await getRequestWithToken(`/recruiter/view-jobs/?page=${pageNum}`, accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            // The total count of data needs to be dividd by the number of data sent per page by backend
            const pages = Math.ceil(data.count / 3)
            setTotalPage(pages)
            setJobs(data.results)

        }
        catch (errors) {
            console.log(errors);
           setJobs([])
        }
    }

    const handlePageChange = (e, page) => {
        console.log(page);
        setPageNum(page)
    }
    useEffect(() => {
        getAllJobs()

    }, [pageNum])

    return (
        <AdminDashBoardLayout>
            {console.log(jobs)}
            <section>
                {
                    jobs.length > 0 ? <JobDisplayCard jobs = {jobs}/>:(
                        <div className="bg-white w-full h-[400px] grid">
                            <h1 className="place-self-center font-bold text-4xl">No Jobs to Display!</h1>
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