import Image from "next/image"
import aboutUs from "../../../public/images/about-us.png"
import ourMission from "../../../public/images/our-mission.png"
import ourStory1 from "../../../public/images/our-story-1.png"
import ourStory2 from "../../../public/images/our-story-2.png"
import ourStory3 from "../../../public/images/our-story-3.png"
import ourStory4 from "../../../public/images/our-story-4.png"
import bhudu from "../../../public/images/ceo.png"
import susil from "../../../public/images/susil.jpeg"
import sandeep from "../../../public/images/sandeepBushal.webp"
import aayush from "../../../public/images/aayush.jpg"
import EmblaCarousel from "@/app/components/emblacarousel"
import Footer from "@/app/components/footer"
import Link from "next/link"
import { CLIENT_SLIDES } from "@/app/components/anonymoususerhomepage"


const OPTIONS = { align: 'center', dragFree: true, loop: true }

export default function AboutUs() {
    return (
        <>
        <section className="bg-white pb-10">
            <section className="py-20 px-8 sm:px-40 bg-[#F6F9FC] aboutus flex flex-col sm:flex-row gap-10 items-center">
                <div className="sm:basis-[40%]">
                    <Image src={aboutUs} alt="bout-us-img" />
                </div>

                <div className="sm:basis-[60%]">
                    <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-center sm:text-left text-transparent bg-clip-text">About Us</h2>
                    <p className="mt-4 text-justify sm:text-left">At HireGurkha, our mission is to support your professional journey and enhance the recruitment process through innovation and personalized solutions. We do this by leveraging advanced AI technology to connect job seekers with their dream roles and assist employers in finding top talent with ease.</p>
                </div>
            </section>

            <section className="px-8 sm:px-40 mt-12 flex flex-col sm:flex-row items-center gap-12">
                <div className="sm:basis-[60%]">
                    <h2 className="text-xl sm:text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-center sm:text-left text-transparent bg-clip-text">Our Mission: AI-Powered Solutions for Job Recruitment</h2>
                    <p className="mt-4 text-justify sm:text-left">Our goal at HireGurkha is to use cutting-edge AI technology to transform the hiring and job search processes. We work to give people the confidence to pursue their professional goals and to help companies find the best candidates quickly. Our mission is to support success, growth, and innovation for employers and job seekers alike.</p>
                </div>

                <div className="sm:basis-[40%]">
                    <Image src={ourMission} alt="our Mission" />
                </div>
            </section>

            <div className="flex justify-center my-14">
                <div className="w-[286px] h-[8px] rounded-xl bg-gurkha-yellow "></div>
            </div>

            <section className="px-8 sm:px-40">
                <h2 className="text-center text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-transparent bg-clip-text">Our Story: The Visionary Inception of HireGurkha</h2>
                <p className="mt-6 text-justify sm:text-left">
                    HireGurkha was born out of a vision to transform the job market by harnessing the power of artificial intelligence. Our founders, inspired by their own challenges in job hunting and recruitment, set out to create a platform that simplifies and enhances these processes for everyone. With a team of dedicated experts in technology and human resources, we have developed an AI-driven solution that matches job seekers with their ideal roles and helps employers find the perfect candidates.
                </p>

                <p className="text-justify sm:text-left mt-4">
                Faced with the complexities of the traditional hiring landscape, our founders sought to create a solution that would streamline the job search and recruitment experience. Their goal was to eliminate the inefficiencies and frustrations that many encounter, making the process more accessible and effective.
                With a team of dedicated experts in technology and human resources, HireGurkha was meticulously crafted. Our AI-driven solution was developed to intuitively match job seekers with their ideal roles and help employers find the perfect candidates with precision and ease.
                </p>

                <p className="text-justify sm:text-left mt-4">
                From our humble beginnings, HireGurkha has grown to become a trusted partner in the professional journeys of countless individuals. Our story is one of passion, perseverance, and a relentless pursuit of excellence. We are proud to have made a significant impact on the job market, simplifying the path to employment and empowering professionals and businesses alike.
                </p>

                <p className="text-justify sm:text-left mt-4">
                Join us at <Link href={'/'} className="text-gurkha-yellow underline font-bold"> HireGurkha</Link>, where our story intertwines with yours, creating a narrative of success and innovation in the world of recruitment.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 sm:items-end mt-12">
                    <div>
                        <Image src={ourStory1} alt="Our Story" className="object-contain w-full" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Image src={ourStory2} alt="Our Story" className="object-contain w-full" />
                        <Image src={ourStory3} alt="Our Story" className="object-contain w-full" />
                    </div>

                    <div>
                        <Image src={ourStory4} alt="Our Story" className="object-contain w-full" />
                    </div>
                </div>
            </section>

            <div className="flex justify-center my-14">
                <div className="w-[286px] h-[8px] rounded-xl bg-gurkha-yellow "></div>
            </div>

            <section className="px-8 sm:px-40">
                <h2 className="text-center text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-transparent bg-clip-text">Our Company</h2>
                <p className="mt-6 text-justify sm:text-left">
                    Our team is a blend of technology enthusiasts and human resource professionals, working together to create a user-centric experience that addresses the unique needs of both job seekers and employers. We believe in the power of AI to not only streamline the recruitment process but also to make it more personalized and efficient. We are more than just a platform; it is a partner in your professional journey, committed to supporting your ambitions and driving success through intelligent solutions. Whether you are looking to advance your career or find the best talent for your organization, HireGurkha is here to guide you every step of the way.
                </p>
            </section>

            <div className="flex justify-center my-14">
                <div className="w-[286px] h-[8px] rounded-xl bg-gurkha-yellow "></div>
            </div>

            <section className="px-4 sm:px-40">
                <h2 className="text-center text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-transparent bg-clip-text">Our Team</h2>

                <div className="border border-[#EDF2F7] flex flex-col items-center sm:items-start  sm:flex-row py-6 px-4 sm:px-10 m-4 sm:m-12 rounded-2xl">
                    <div className="sm:basis-[25%] ml-7 sm:ml-0">
                        <Image src={bhudu} alt="Dipendra" />
                    </div>
                    <div className="sm:basis-[75%] text-center sm:text-left">
                        <h2 className="text-xl sm:text-3xl font-semibold">Dipendra Neupane</h2>
                        <p className="text-lg sm:text-2xl font-semibold text-[#544444] mt-1">Founder, CEO</p>
                        <div className="flex gap-2 items-center justify-center sm:justify-start mt-2 text-lg">
                            <i className="bi bi-facebook"></i>
                            <i className="bi bi-linkedin"></i>
                        </div>
                        <p className="text-lg mt-6 sm:text-justify">
                        Dipendra Neupane, the visionary founder and CEO of HireGurkha, embodies the spirit of our mission. With a rich background in computer science and extensive experience in recruitment, he has dedicated his career to bridging the gap between technology and talent, creating innovative solutions that transform the job market.
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-10">

                <div className="text-center place-self-center">
                    <div className="w-[200px] h-[200px] rounded-full">
                            <Image src={aayush}  className="w-full h-full rounded-full object-cover"/>
                        </div>
                        <h4 className="text-xl font-semibold mt-3">Aayush KC</h4>
                        <p className="text-[#666666] text-lg">CTO</p>
                    </div>
                    <div className="text-center place-self-center">
                        <div className="w-[200px] h-[200px] rounded-full">
                            <Image src={susil}  className="w-full h-full rounded-full object-cover"/>
                        </div>
                        <h4 className="text-xl font-semibold mt-3">Susil Khatri</h4>
                        <p className="text-[#666666] text-lg">US Team Lead</p>
                    </div>

                    <div className="text-center place-self-center">
                    <div className="w-[200px] h-[200px] rounded-full">
                            <Image src={sandeep}  className="w-full h-full rounded-full object-cover"/>
                        </div>
                        <h4 className="text-xl font-semibold mt-3">Sandeep Bushal</h4>
                        <p className="text-[#666666] text-lg">UK Team Lead</p>
                    </div>

                </div>
            </section>

            <div className="flex justify-center my-14">
                <div className="w-[286px] h-[8px] rounded-xl bg-gurkha-yellow "></div>
            </div>

            <section className="mt-12 ">
                <h2 className="text-3xl text-center font-semibold text-center px-8 sm:px-0">What Our Clients Say</h2>
                <p className="text-lg text-[#213343] mt-4 text-center px-8 sm:px-0">See how HubSpot customers are growing their businesses and getting incredible results.</p>
                <div className="mt-10 flex justify-center">

                    <EmblaCarousel slides={CLIENT_SLIDES} options={OPTIONS} delay={2500} />
                </div>


            </section>

            <div className="flex justify-center my-14">
                <div className="w-[286px] h-[8px] rounded-xl bg-gurkha-yellow "></div>
            </div>

            <section className="px-8 sm:px-40">
            <h2 className="text-center text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] text-transparent bg-clip-text">Awards and Accolades</h2>
            <p className="mt-8 text-justify sm:text-left">At HireGurkha, our commitment to innovation and excellence has been recognized through various prestigious awards and accolades. We are proud to have been honored for our contributions to the recruitment industry and our advancements in AI technology. These awards underscore our dedication to providing exceptional service and solutions to our users:</p>
            </section>

        </section>

        <Footer />
        </>
    )
}