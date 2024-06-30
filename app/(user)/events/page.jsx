"use client"
import Image from "next/image"
import events from "../../../public/images/events.png"
import completedEventsImg from "../../../public/images/completedEvent.png"
import upcomingEventsImg from "../../../public/images/upcomingEvent.png"
import calendar from "../../../public/images/calendar.png"
import GetRequestNoToken from "@/app/api/getRequestNoToken"
import { useEffect, useState } from "react"
import Footer from "@/app/components/footer"
import PaginationComponent from "@/app/components/paginationcomponent"
export default function Events() {
    const [upComingEvents, setUpcomingEvents] = useState()
    const [completedEvents, setCompletedEvents] = useState()
    const [pageNumUpcoming, setPageNumUpcoming] = useState(1)
    const [totalPageUpcoming, setTotalPageUpcoming] = useState()
    const [pageNumCompleted, setPageNumCompleted] = useState(1)
    const [totalPageCompleted, setTotalPageCompleted] = useState()
    const getUpcomingEvents = async () => {
        try {
            const data = await GetRequestNoToken(`/events-upcoming?page=${pageNumUpcoming}`)
            if (data.detail) {
                throw new Error("Failed to fetch Events");
            }
            const pages = Math.ceil(data.count / 3)
            setTotalPageUpcoming(pages)
            setUpcomingEvents(data.results)
        } catch (errors) {
            console.log(errors);
        }
    }

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

    const handleUpcomingEventPageChange = (e, page) => {

        setPageNumUpcoming(page)

    }

    const handleCompletedEventPageChange = (e, page) => {

        setPageNumCompleted(page)

    }

    useEffect(() =>{
        getUpcomingEvents()
    },[pageNumUpcoming])

    useEffect(() =>{
        getCompletedEvents()
    },[pageNumCompleted])


    useEffect(() => {
        getUpcomingEvents()
        getCompletedEvents()
    }, [])
    return (
        <>

            <section className="bg-[#F6F9FC] pb-10">
                <section className="pt-24 px-8 sm:px-40 aboutus">
                    <div className="flex items-center gap-4">
                        <Image src={upcomingEventsImg} alt="upcoming event" />
                        <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-center sm:text-left text-transparent bg-clip-text">Upcoming Events</h2>
                    </div>

                    {/* Border below heading */}
                    <div className="h-[6px] bg-[#FFB000] w-[280px] sm:w-[346px] mt-2 rounded-2xl"></div>


                    <div className="flex flex-col sm:flex-row gap-10 mt-4">
                        {/* Claneder COntent Part */}
                        <div className="basis-[55%]">
                            {
                                upComingEvents?.length > 0 ? upComingEvents.map((data, index) => (
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
                                    (
                                        <div className="bg-white rounded-xl text-3xl font-bold text-center p-6 mt-10 flex justify-center items-center h-[200px]">No Events To Display</div>
                                    )
                            }
                            <div className="flex justify-center mt-6">
                                <PaginationComponent onChange={handleUpcomingEventPageChange} page={pageNumUpcoming} totalPage={totalPageUpcoming} />
                            </div>

                        </div>

                        {/* Diplay Image in Left of Events */}
                        <div>
                            <Image src={events} alt="events picture" />
                        </div>

                    </div>


                </section>

                <div className="w-full h-[1px]  bg-[#e7e1e3] my-12"></div>

                <section className="mt-10 px-8 sm:px-40">
                    <div className=" flex items-center gap-4">
                        <Image src={completedEventsImg} alt="upcoming event" />
                        <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-center sm:text-left text-transparent bg-clip-text">Completed Events</h2>
                    </div>

                    {/* Border below heading */}
                    <div className="h-[6px] bg-[#FFB000] w-[280px] sm:w-[346px] mt-2 rounded-2xl"></div>


                    {/* Claneder COntent Part */}

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

                    {/* Diplay Image in Left of Events */}



                </section>
            </section>
            <div className="w-full bg-white h-[2px]"></div>
            <Footer />
        </>
    )
}