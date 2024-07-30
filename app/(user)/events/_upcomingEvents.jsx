"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken"
import PaginationComponent from "@/app/components/paginationcomponent"
import calendar from "../../../public/images/calendar.png"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Skeleton } from "@mui/material"

export default function UpComingEvents(){
    const [upComingEvents, setUpcomingEvents] = useState()
    const [pageNumUpcoming, setPageNumUpcoming] = useState(1)
    const [totalPageUpcoming, setTotalPageUpcoming] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState(false)
    const getUpcomingEvents = async () => {
        try {
            const data = await GetRequestNoToken(`/events-upcoming?page=${pageNumUpcoming}`)
            if (data.detail) {
                throw new Error("Failed to fetch Events");
            }
            const pages = Math.ceil(data.count / 3)
            setTotalPageUpcoming(pages)
            setUpcomingEvents(data.results)
            setIsLoading(false)
        } catch (errors) {
            console.log(errors);
            setFetchError(true)
        }
    }
    const handleUpcomingEventPageChange = (e, page) => {

        setPageNumUpcoming(page)

    }
    useEffect(() =>{
        getUpcomingEvents()
    },[pageNumUpcoming])
    
    return(
        <div className="basis-[55%]">
            {
                !fetchError ?  upComingEvents?.length > 0 ? upComingEvents.map((data, index) => (
                    <div className="bg-white rounded-xl py-3 mb-4 px-2 sm:px-6 flex flex-col sm:flex-row gap-10 items-center" key={index}>
                        <Image src={calendar} alt="calendar" />
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-center sm:text-left text-transparent bg-clip-text">{index + 1}. {data.title} </h3>
                            <p className="text-[#213343] mt-2">Date: {data.date} </p>
                            <p className="text-[#213343] mt-2">Time: {data.time}</p>
                            <p className="text-[#213343] mt-2">Venue:  {data.venue}</p>
                        </div>
                    </div>
    
                ))
    
                    :
                    !isLoading ?
                    (
                        <div className="bg-white rounded-xl text-3xl font-bold text-center p-6 mt-10 flex justify-center items-center h-[200px]">No Events To Display</div>
                    ):
                    <div>
                        <Skeleton height={150}/>
                    </div>
                :
                <div className="bg-white rounded-xl text-3xl font-bold text-center p-6 mt-10 flex justify-center items-center h-[200px]">No Events To Display</div>
            }
           
        
        <div className="flex justify-center mt-6">
            <PaginationComponent onChange={handleUpcomingEventPageChange} page={pageNumUpcoming} totalPage={totalPageUpcoming} />
        </div>

    </div>
    )
}