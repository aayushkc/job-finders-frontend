import Image from "next/image"
import events from "../../../public/images/events.png"
import completedEventsImg from "../../../public/images/completedEvent.png"
import upcomingEventsImg from "../../../public/images/upcomingEvent.png"
import Footer from "@/app/components/footer"
import UpComingEvents from "./_upcomingEvents"
import CompletedEvets from "./_completedEvents"
export default function Events() {

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
                      <UpComingEvents />

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

                   <CompletedEvets />

                    {/* Diplay Image in Left of Events */}



                </section>
            </section>
            <div className="w-full bg-white h-[2px]"></div>
            <Footer />
        </>
    )
}