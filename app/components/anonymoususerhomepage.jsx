"use client"
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GetRequestNoToken from "../api/getRequestNoToken";
import Image from "next/image";
import hero from "../../public/images/hero-img.png"
import mobileHero from "../../public/images/mobileHero.png"
import Bolb from "../../public/images/blob.png"
import Cube from "../../public/images/cube.png"
import airAsia from "../../public/images/airAsia.png"
import demir from "../../public/images/demir.png"
import dhl from "../../public/images/dhlpng.png"
import suzuki from "../../public/images/Suzuki.png"
import navi from "../../public/images/Navistar.png"
import arrow from "../../public/images/arrow.png"
import meeting from "../../public/images/meeting.png"
import monitorPlay from "../../public/images/monitorPlay.png"
import bannnerIcon from "../../public/images/bannnerIcon.png"
import { Open_Sans } from "next/font/google";
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import chooseUs1 from "../../public/images/chooseUs1.png"
import chooseUs2 from "../../public/images/chooseUs2.png"
import chooseUs3 from "../../public/images/chooseUs3.png"
import chooseUs4 from "../../public/images/chooseUs4.png"
import chooseUs5 from "../../public/images/chooseUs5.png"
import EmblaCarousel from "./emblacarousel";
import FAQCard from "./faq";


const timeLineData = [
  {
    'step_no': "1",
    'title': "Candidate Evaluation",
    'desc': "Our AI thoroughly reviews each profile within our talent pool, selecting only the most qualified talent based on their resumes and past experiences."
  },
  {
    'step_no': "2",
    'title': "Skill and Aptitude Assessment",
    'desc': "We Assess communication skills, analyze problem-solving abilities, and evaluate personal strengths of the developers."
  },
  {
    'step_no': "3",
    'title': "Competency Analysis",
    'desc': "Our thorough technical assessments scrutinize talents for their  capabilities, guaranteeing that only the highest caliber candidates progress further."
  },
  {
    'step_no': "4",
    'title': "Expert Review",
    'desc': "To ensure the hiring of top talent, our skilled TA team makes an effort to understand the goals, degree of competition, and learning capacity of each candidate."
  }
]
export default function AnonUserHomePage({ pageNum, totalPage }) {
  const OPTIONS = { align: 'start', dragFree: true, loop: true }
  const CLIENT_SLIDES = [
    {
      'name': "Aakash Chaudhary",
      'profilePic': "/images/aakash.jpeg",
      'company': "Company",
      'review': "Hiregurkha was instrumental in securing my position at Samsung; its  resources and guidance were invaluable throughout the recruitment  process",
      'proficient': "Senior DotNet Developer"
    },
    {
      'name': "Prashant Pradhan",
      'profilePic': "/images/prashant.jpeg",
      'company': "NexSewa",
      'review': "Hiregurkha played a pivotal role in helping me secure my role at NexSewa.",
      'proficient': "Graphic Designer"
    },
    {
      'name': "Ayush Duyadi",
      'company': "Company",
      'profilePic': "/images/ayush.jpeg",
      'review': "My journey to AirAsia was made possible by Hiregurkh.",
      'proficient': "Project Manager"
    }
  ]


  const BUSINESS_SLIDES = [
    {
      'name': "Name",
      'profilePic': "/images/business1.png",
      'position': "POSITION",
      'company': "Company",
      'review': "Working with Hiregurkha has been a game-changer for our recruitment needs. Their ability to source high-quality talent efficiently has saved  us time and resources, allowing us to focus on our core business  objectives",
      'proficient': null
    },
    {
      'name': "Name",
      'profilePic': "/images/business1.png",
      'position': "POSITION",
      'company': "Company",
      'review': "Thanks to Hiregurkha, our company's talent acquisition process has been transformed. Their expertise in recruiting top-tier talent has been  instrumental in shaping our success.",
      'proficient': null
    },
    {
      'name': "Name",
      'company': "Company",
      'position': "POSITION",
      'profilePic': "/images/business1.png",
      'review': "Hiregurkha has truly exceeded our expectations in talent acquisition. Their dedication to finding the right fit for our company culture and  goals has been invaluable",
      'proficient': null
    },
    {
      'name': "Name",
      'company': "Company",
      'position': "POSITION",
      'profilePic': "/images/business1.png",
      'review': "Hiregurkha has truly exceeded our expectations in talent acquisition. Their dedication to finding the right fit for our company culture and  goals has been invaluable",
      'proficient': null
    }
  ]

  const [recommendedJobs, setRecommendedJobs] = useState([])
  const router = useRouter()
  const getRecommendedJobs = async () => {
    try {
      const data = await GetRequestNoToken(`/job-seeker/get-all-job/?page=${pageNum}`)
      if (data.detail) {
        throw new Error("Cannot Fetch")
      }

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
    <div className="bg-white">
      <section className="flex flex-col sm:flex-row gap-10 pt-16 relative px-8 sm:px-24">
        <div className="order-last sm:order-first block">
          <Image src={hero} alt="hero" className="max-h-[690px] max-w-[557px] hidden sm:block" />
          <Image src={mobileHero} alt="hero" className="max-h-[300px] max-w-[300px] block sm:hidden" />
        </div>

        <div className="py-2 sm:py-8 text-center relative sm:px-6 text-[#212529]">
          <h2 className="text-3xl sm:text-5xl font-bold sm:leading-[62px]">
            {/* Secure The <span className="text-[#FD810E]"> Job</span> You Desire  With Our
            <br></br>
            <span className="bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block text-transparent bg-clip-text">
              AI Tailored Platform
            </span> */}
            Would You Like To <span className="bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block text-transparent bg-clip-text">Work Abroad</span> While Residing In <span className="text-[#FD810E]">Nepal</span> With Your Family?
          </h2>

          <h4 className="text-lg sm:text-xl font-bold mt-8 sm:leading-[30px]">Pursue your ambitions and shape your ideal professional path with our support.</h4>

          <div className="flex mt-8 justify-center">
            <Link href="/jobs">
              <button className="bg-[#FFB000] rounded-3xl py-2 px-8 text-xl font-bold text-white">
                Search Job
              </button>
            </Link>


          </div>

          <div className="flex justify-center my-8">
            <div className="w-[286px] h-[8px] rounded-xl bg-gurkha-yellow "></div>
          </div>

          <h2 className="text-5xl font-bold  mb-4 sm:leading-[62px]"><span className="text-[#FD810E]">Hire </span> From Nepal </h2>
          <h4 className="text-xl font-bold mt-8 leading-[30px]">With Our AI Powered Process</h4>
          <div className="flex mt-8 justify-center">
            <Link href="/register-as-recruiter">
              <button className="bg-[#FFB000] rounded-3xl py-2 px-8 text-xl font-bold text-white">
                Recruit Employees
              </button>

            </Link>
          </div>



          <div className="hidden sm:block absolute left-10 -bottom-14 sm:bottom-4">
            <Image src={Cube} alt="cube" />
          </div>
        </div>

        <div className="hidden sm:block absolute right-0 bottom-20">
          <Image src={Bolb} alt="bolb" />
        </div>


      </section>

      <section className=" sm:px-32 mt-12">
        <div className="px-4 sm:p-10">
          <h2 className="text-3xl font-bold text-center sm:leading-[48px]">Over <span className="text-[#FE810F]">100 NRN</span> businesses using our platform to hire <span className="text-[#FE810F]">from Nepal</span></h2>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-14 mt-12">

            <Image src={airAsia} alt="air asia" />
            <Image src={demir} alt="air asia" />
            <Image src={dhl} alt="air asia" />
            <Image src={suzuki} alt="air asia" />
            <Image src={navi} alt="air asia" />

          </div>
        </div>

      </section>


      {/* Job Seeker Testimonial Carousel */}
      <section className="mt-12">
        <h2 className="text-2xl text-center font-bold px-4">We help <span className="text-[#FD810E]"> talents</span> find their perfect spots</h2>
        <div className="mt-10 flex justify-center">

          <EmblaCarousel slides={CLIENT_SLIDES} options={OPTIONS} delay={2500} />
        </div>


      </section>

      <div className="flex justify-center my-12">
        <div className="bg-gradient-to-r from-[#FD810E] to-[#DA4C98] w-[345px] h-[8px] rounded-2xl">

        </div>
      </div>

      {/* Recruiter Testimonial Carousel */}
      <section className="mt-12">
        <h2 className="text-2xl text-center font-bold px-4">We accelerate <span className="text-[#FD810E]"> businesses</span> towards their goals</h2>
        <div className="mt-10 flex justify-center">

          <EmblaCarousel slides={BUSINESS_SLIDES} options={OPTIONS} delay={2000} />
        </div>


      </section>


      {/* Grid Section */}
      <section className="mt-16 px-4">
        <h2 className="text-3xl font-bold text-center">Recruit top-tier talent from our </h2>
        <h2 className="text-3xl font-bold text-center text-[#FE810F] mt-4">Well Curated Domains</h2>
        <p className="text-[#84888E] text-center mt-4">Our expansive global network comprises leading business, design, and tech professionals, primed to address your key initiatives</p>

        <div className="grid sm:grid-cols-3 mt-10 sm:mx-20 sm:border-b-2 border-[#D8D9DC] text-center sm:text-left">
          <div className="px-10 pt-8 border-b-2 sm:border-r-2 border-[#D8D9DC] flex flex-col items-center sm:items-start">
            <Image src="/images/codeCom.png" width={51} height={51} alt="computer" />
            <h3 className="text-lg mt-4">Software Development</h3>
            <p className="py-8">Experienced software engineers, coders, and architects proficient in a multitude of technologies</p>
          </div>

          <div className="px-10 pt-8 border-b-2 sm:border-r-2 border-[#D8D9DC] flex flex-col items-center sm:items-start">
            <Image src="/images/it.png" width={51} height={51} alt="Information Technology" style={{ width: '51px', height: '51px' }} />
            <h3 className="text-lg mt-4">Information Technology</h3>
            <p className="py-8">Skilled IT professionals specializing in UI, UX, Visual, Interaction  design etc.</p>
          </div>


          <div className="px-10 pt-8 border-b-2 flex flex-col items-center sm:items-start">
            <Image src="/images/finance.png" width={51} height={51} alt="finance" style={{ width: '51px', height: '51px' }} />
            <h3 className="text-lg mt-4">Finance and Accounting</h3>
            <p className="py-8">Professionals proficient in financial modeling & valuation, startup funding, interim etc.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 text-center sm:text-left sm:mx-20">
          <div className="px-10 pt-8 border-b-2 sm:border-r-2 border-[#D8D9DC] flex flex-col items-center sm:items-start">
            <Image src="/images/cusSupppng.png" width={51} height={51} alt="Customer Support" />
            <h3 className="text-lg mt-4">Customer support</h3>
            <p className="py-8">Professionals in customer support specialized in addressing various needs</p>
          </div>

          <div className="px-10 pt-8 border-b-2 sm:border-r-2 border-[#D8D9DC] flex flex-col items-center sm:items-start">
            <Image src="/images/hr.png" width={51} height={51} alt="HR" />
            <h3 className="text-lg mt-4">Human Resource</h3>
            <p className="py-8">HR professionals often play a crucial role in fostering a positive  workplace culture and supporting the organization's overall strategic  goals.</p>
          </div>


          <div className="px-10 pt-8 border-b-2 flex flex-col items-center sm:items-start">
            <Image src="/images/market.png" width={51} height={51} alt="marketing" />
            <h3 className="text-lg mt-4">Marketing</h3>
            <p className="py-8">Professionals in marketing are responsible for developing and  implementing strategies to promote products or services, attract  customers, and drive sales.</p>
          </div>
        </div>
      </section>

      {/* Timeline of Steps */}
      <section className="mt-12">
        <h2 className="text-3xl text-center font-bold">Our <span className="text-[#FD810E]"> Hiring Process</span></h2>
        <p className="text-[#84888E] text-center mt-4">We will ensure that you hire software developers who are the best fit for your company</p>

        <div className="sm:max-w-[1090px] mt-10">
          <Timeline sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }} className="sm:ml-[23rem]">
            <TimelineItem>
              <TimelineSeparator className="ml-2">

                <TimelineConnector sx={{ bgcolor: "#221F7E" }} />
              </TimelineSeparator>
              <TimelineContent>
                <div className="bg-transparent to-[#FE810F] rounded-xl text-white p-12">
                </div>
              </TimelineContent>
            </TimelineItem>
            {
              timeLineData.map((data) => (
                <TimelineItem key={data.step_no} className="my-6">
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: "#FFC033", width: "25px", height: "25px" }} />
                    <TimelineConnector sx={{ bgcolor: "#221F7E" }} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <div className="bg-gradient-to-b from-[#FFB000] to-[#FE810F] rounded-xl text-white p-12">
                      <div className="flex gap-4 items-end">
                        <h6 className="text-xs">Step <span className="opacity-50">0{data.step_no}</span></h6>
                        <div className="bg-gradient-to-r from-[#21262D] to-[#21262D00] w-[80%] h-[1px] rounded-2xl"></div>
                      </div>


                      <div className="flex gap-4 items-center mt-6">
                        <i className="bi bi-dash-circle sm:text-lg"></i>
                        <h2 className="text-lg sm:text-3xl font-bold">{data.title}</h2>
                      </div>
                      <p className="leading-[33.33px] mt-4">{data.desc}</p>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))
            }

          </Timeline>


        </div>

      </section>

      <section className="pt-12 bg-[#FCFCFC]">
        <h2 className="text-4xl text-center font-bold">Our <span className="text-[#FD810E]"> Hiring Strategies</span></h2>
        <p className="text-[#84888E] text-center mt-4">Quickly assemble the teams you need, exactly when you need them.</p>

        <div className="flex justify-center  mt-6">
          <div className="flex gap-20 items-center">
            <div className="border-l-2 border-[#2F6AE3] pl-6">
              <h2 className="text-3xl font-lightbold">100+</h2>
              <p className="text-lg">companies <br></br> accelerated</p>
            </div>

            <div className="border-l-2 border-[#2F6AE3] pl-6">
              <h2 className="text-3xl font-lightbold">30000+</h2>
              <p className="text-lg">Talents <br></br>Ready</p>
            </div>

          </div>

        </div>

        <div className="bg-white mt-8 flex justify-center text-center p-6 mx-12 sm:text-left sm:mx-40 ">
          <div className="grid sm:grid-cols-3 gap-8 ">
            <div>
              <i className="bi bi-speedometer2 text-gurkha-yellow text-6xl"></i>
              <h2 className="text-lg font-bold mt-2">Hire Quickly</h2>
              Get  <span className="text-gurkha-yellow">Top 3% </span>matching profiles within 24-48 hours
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <Image src={bannnerIcon} alt="banner" />
              <h2 className="text-lg font-bold mt-2">The Top 3%</h2>
              <p> Just take <span className="text-gurkha-yellow">one or two </span>interviews of
                only selected profiles</p>
            </div>


            <div className="flex flex-col items-center sm:items-start">
              <Image src={bannnerIcon} alt="banner" />
              <h2 className="text-lg font-bold mt-2">100+ Skills</h2>
              <p>Ranging from 10+ Domains with each
                curated skills list</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center p-6 ">
          <div className="grid sm:grid-cols-2 gap-12 max-w-[1040px]">
            <div className="bg-white p-6 flex items-center flex-col sm:items-start text-center sm:text-left">
              <Image src={monitorPlay} alt="monitor" />
              <h2 className="text-lg font-bold">2 Weeks Trial </h2>
              <p className="text-[#455065]">You can get used to our website with 2 weeks of trial available to get used to our hiring process</p>
            </div>

            <div>
              <Image src={meeting} alt="meeting" />
            </div>
          </div>

        </div>
      </section>

      {/* Why chose us */}
      <section className="mt-12">
        <h2 className="text-4xl text-center font-bold">Why Choose <span className="text-[#FD810E]">HireGurkha </span></h2>
        <p className="text-[#84888E] text-center mt-4">Explore the myriad ways in which our clients have embraced the advantages offered by the Hiregurkha network.</p>

        <div className="grid grid-cols-3 mx-24 mt-12">
          <div className="">
            <Image src={chooseUs1} alt="choose" />
          </div>

          <div className="">
            <Image src={chooseUs2} alt="choose" />
          </div>

          <div className="">
            <Image src={chooseUs3} alt="choose" />
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="">
            <Image src={chooseUs4} alt="choose" />
          </div>

          <div className="">
            <Image src={chooseUs5} alt="choose" />
          </div>
        </div>
      </section>


      <section className="mt-16 px-6 sm:px-40 py-20 bg-[#F7F9FC] relative">
        <div className="absolute left-[12%] top-[25%] hidden sm:block">
          <Image src={arrow} alt="cube" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-center text-[#FE810F]">Frequently Asked Questions</h2>
        <div className="mt-10 flex justify-center">
          <div className="max-w-[900px]">
            <FAQCard question={'What sets Hiregurkha apart from other hiring platforms?'} answer={"With Hiregurkha' , clients can effortlessly hire talents. A week is all it takes to access the best  profiles, with an almost guaranteed remote joining rate. Customers also get a two-week trial period and excellent post-hiring services."} />
            <FAQCard question={'What is the process of hiring a talent at Hiregurkha?'} answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'} />
            <FAQCard question={'How does your screening process ensure quality candidates that meet our requirements?'} answer={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'} />

          </div>

        </div>
        <div className="absolute left-32 top-[70%] hidden sm:block">
          <Image src={Cube} alt="cube" />
        </div>
      </section>



      <section className="text-center p-8  grid">
        <div className="sm:px-16">
          <h2 className="text-xl">Available Jobs</h2>

          <div className="grid sm:grid-cols-3 gap-4 text-left mt-6">
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
                                (data, index) => index < 2 &&
                                  <span key={index}>{index === 1 ? data.title + "..." : data.title + "/"}</span>



                              )
                              :
                              data.required_skills.map((data) => data.title)
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

                      <div className="flex flex-col sm:flex-row sm:justify-between mt-4 sm:items-center">
                        <div className="flex gap-2 items-center">
                          <i className="bi bi-people text-xl"></i>
                          <p className="text-[#01B46A]">{data.applied} Applied</p>
                        </div>

                        <p className="text-sm mt-4 sm:mt-0">Apply Before: {data.apply_before}</p>
                      </div>

                    </div>
                  </Link>
                )
              })}

          </div>

        </div>

      </section>
    </div>
  );
}
