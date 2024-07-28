"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken"
import PaginationComponent from "@/app/components/paginationcomponent"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function CompletedEvets(){
    const [completedEvents, setCompletedEvents] = useState()
   
    const [pageNumCompleted, setPageNumCompleted] = useState(1)
    const [totalPageCompleted, setTotalPageCompleted] = useState()
    

    const getCompletedEvents = async () => {
        try {
            const data = await GetRequestNoToken(`/events-completed?page=${pageNumCompleted}`)
            if (data.detail) {
                throw new Error("Failed to fetch Events");
            }
            const pages = Math.ceil(data.count / 3)
            setTotalPageCompleted(pages)
            setCompletedEvents(data.results)
        } catch (errors) {
            console.log(errors);
        }
    }

  

    const handleCompletedEventPageChange = (e, page) => {

        setPageNumCompleted(page)

    }

   
    useEffect(() =>{
        getCompletedEvents()
    },[pageNumCompleted])

  

    return(
        <>
        {
            completedEvents?.length > 0 ? completedEvents.map((data, index) => (
                <div className="bg-white rounded-xl p-6 mt-10 flex flex-col sm:flex-row gap-10 items-center" key={index}>
                    <div>
                        <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-center sm:text-left text-transparent bg-clip-text">{data.title} </h3>
                        <p className="text-sm sm:text-normal text-[#213343] mt-2">{data.description} </p>
                    </div>

                    <Image src={data.thumbnail} alt="calendar" width={254} height={254} />
                </div>
            ))
                :
                (
                    <div className="bg-white rounded-xl text-3xl font-bold text-center p-6 mt-10 flex justify-center items-center h-[200px]">No Events To Display</div>
                )
        }

        <div className="flex justify-center mt-6">
            <PaginationComponent onChange={handleCompletedEventPageChange} page={pageNumCompleted} totalPage={totalPageCompleted} />
        </div>

        </>
    )
}