"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import GetRequestNoToken from "../api/getRequestNoToken";
// const skills = [
//     {
//         "iconPath":"/images/codeCom.png",
//         "title":"Jobs in Python Developer",
//         "alt":"Jobs in Python Developer"
//     },
//     {
//         "iconPath":"/images/codeCom.png",
//         "title":"Jobs in Java",
//         "alt":"Jobs in Java"
//     },
//     {
//         "iconPath":"/images/codeCom.png",
//         "title":"Jobs in UI/UX",
//         "alt":"Jobs in UI/UX"
//     }, 
//     {
//         "iconPath":"/images/codeCom.png",
//         "title":"Jobs in Graphics Designing",
//         "alt":"Jobs in Graphics Designing"
//     },
//     {
//         "iconPath":"/images/codeCom.png",
//         "title":"Jobs in Skill",
//         "alt":"Jobs in Skill"
//     },
//     {
//         "iconPath":"/images/codeCom.png",
//         "title":"Jobs in Jira Project Management",
//         "alt":"Jobs in Jira Project Management"
//     }
// ]

const countries = [
    {
        "iconPath":"/images/bahrain.png",
        "title":"Jobs in Bahrain",
        "alt":"Jobs in Bahrain"
    },
    {
        "iconPath":"/images/kuwait.png",
        "title":"Jobs in Kuwait",
        "alt":"Jobs in Kuwait"
    },
    {
        "iconPath":"/images/oman.png",
        "title":"Jobs in Oman",
        "alt":"Jobs in Oman"
    }, 
    {
        "iconPath":"/images/qatar.png",
        "title":"Jobs in Qatar",
        "alt":"Jobs in Qatar"
    },
    {
        "iconPath":"/images/saudi-arabia.png",
        "title":"Jobs in Saudi Arabia",
        "alt":"Jobs in Saudi Arabia"
    },
    {
        "iconPath":"/images/united-arab-emirates.png",
        "title":"Jobs in UAE",
        "alt":"Jobs in UAE"
    }
]
const Footer = () => {

    const [skills,setSkills] = useState()
    const [jobCategory,setJobCategory] = useState()
    const getSkills = async () => {
        try {
          const data = await GetRequestNoToken(`/get-skills/?industry=null`)
          if (data.detail) {
            throw new Error("Cannot Fetch")
          }
          setSkills(data)
        }
        catch (errors) {
          setSkills([{ "id": "", "title": "" }])
        }
      }


      const getJobCategory = async () => {
        try {
          const data = await GetRequestNoToken('/job-preference/')
          if (data.detail) {
            throw new Error("Cannot Fetch")
          }
          setJobCategory(data)
        }
        catch (errors) {
          setJobCategory([{ "id": "", "title": "" }])
        }
      }


      useEffect(()=>{
        getSkills()
        getJobCategory()
      },[])

    return (
        <footer className="bg-[#F5F9FC] py-16 px-4 sm:px-32">
            <div className="flex flex-col sm:flex-row">
                <div className="basis-3/5">
                    <Image src="/images/Footerlogo.png" alt="logo" className="max-w-full max-h-full" width="102" height="42"/>
                    <p className="text-sm font-light mt-8">© 2023 Nexsewa Pvt. Ltd. All Rights Reserved.</p>

                    <div className="my-8 flex gap-8 items-center text-3xl sm:text-4xl">
                        <i className="bi bi-facebook"></i>
                        <i className="bi bi-youtube"></i>
                        <i className="bi bi-instagram"></i>
                        <i className="bi bi-linkedin"></i>
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-10 sm:gap-24">
                    <div>
                    <h3 className="font-bold">More About Us</h3>
                    <ul>
                        <li className="mt-6"><Link href={"/about-us"}>About Us</Link></li>
                        <li className="mt-6">Contact Us</li>
                        <li className="mt-6"><Link href={"/blogs"}>Blogs</Link></li>
                        {/* <li className="mt-6">Career</li> */}
                    </ul>
                    </div>
                   

                    <div>

                        <h3 className="font-bold">Related Information</h3>
                        <ul>
                            <li className="mt-6"><Link href={"/blogs"}>Blogs</Link></li>
                            <li className="mt-6"><Link href={"/privacy-policy"}>Privacy</Link></li>
                            {/* <li className="mt-6">Applicant and Candidate</li> */}
                            <li className="mt-6"><Link href={"/terms-and-conditions"}>Terms</Link></li>
                        </ul>
                    </div>
                </div>



            </div>
            
            <div className="w-full h-[1px]  bg-[#6f7172] mt-16">

            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-20">

                {/* Domain */}
                <div>
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block sm:text-left text-transparent bg-clip-text">Domains</h2>
                <ul className="grid grid-cols-2 gap-x-8 text-sm">
                 {
                    jobCategory?.map(data =>(
                
                        <Link href={`/jobs?industry=${data.id}`} key={data.id}>
                            
                        <li className="mt-5 flex gap-3 items-center"> <Image src={data.icon} alt="icon" width={20} height={20}/>  Jobs In {data.title}</li>
                        </Link> 
                    ))
                 }
                </ul>
                </div>

                {/* Countries */}
                {/* <div>
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block sm:text-left text-transparent bg-clip-text">Countries</h2>
                <ul>
                    {
                        countries.map((data,index) =>(
                            <Link href={"#"} key={index}>
                            <li className="mt-5 flex gap-3 items-center">  <Image src={data.iconPath} width={18} height={18} alt={data.alt}/> {data.title}</li>
                            </Link> 
                        ))
                    }
                </ul>
               
                </div> */}

                {/* Skills */}
                <div>
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block sm:text-left text-transparent bg-clip-text">Skills</h2>
                <ul className="grid grid-cols-2 gap-x-10 text-sm">
                    {
                        skills?.map((data,index) =>(
                            <Link href={`/jobs?skills=${data.id}`} key={index}>
                            <li className="mt-5 flex gap-3 items-center"> <Image src={data.icon} alt="icon" width={20} height={20}/>  Jobs In {data.title}</li>
                            </Link> 
                        ))
                    }
                </ul>
               
                </div>
            </div>


        </footer>
    )
}

export default Footer;