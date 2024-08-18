"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken"
import JobPanelData from "@/app/components/JobPanelData"
import Cookies from "js-cookie"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function JobFromId(){

    const isSeeker = Cookies.get('isSeeker') === 'true'
    const accessToken = Cookies.get('accessToken')
    const router = useParams()
    const serachParam = useSearchParams()
    const [jobPanelData, setJobPanelData] = useState()
 
    const pageNum = serachParam.get('pageNum' || 1)
    useEffect(()=>{
        async function getJobFromId(){

            try {
                const data = await GetRequestNoToken(`/job-seeker/get-job/${router.id}`)
                if (data.detail) {
                    throw new Error("Cannot Fetch")
                }
    
                // The total count of data needs to be dividd by the number of data sent per page by backend
                setJobPanelData(data)
    
            }
            catch (errors) {
                setJobPanelData([])
            }
        }
        getJobFromId()
        return () =>{}
        
    },[router.id])

    return(
        <>
        <section className="sm:hidden">
    
            {
                jobPanelData && <JobPanelData jobPanelData={jobPanelData} pageNum={pageNum}  isUserLoged={isSeeker} accessToken={accessToken} />
            }

        </section>
        <section className="hidden sm:grid w-full h-[90vh]">
            <div className="place-self-center">
                <h1 className="font-bold text-3xl mb-6">Not Allowed to View this Page</h1>
            <Link href="/jobs" className="flex justify-center"><button className="bg-gurkha-yellow py-3 px-6 rounded-xl text-white text-lg">Go back</button></Link>
            </div>
               
        </section>
             
        </>
      
    )
}