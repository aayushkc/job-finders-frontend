"use client"
import getRequestWithToken from "@/app/api/getRequestWithToken";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


export default function ViewJobs(){
    
    const accessToken = Cookies.get('accessToken')
    const [jobs, setJobs] = useState([])
    
    const getAllJobs = async () =>{
        try {
            const data = await getRequestWithToken('/recruiter/view-jobs/', accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            setJobs(data)
            console.log(data);
        }
        catch (errors) {
            setEducationInfo([])
        }
    }
    useEffect(()=>{
        getAllJobs()
       
    },[])

    return(
        <AdminDashBoardLayout>
          {console.log(jobs)}
        </AdminDashBoardLayout>
    )

}