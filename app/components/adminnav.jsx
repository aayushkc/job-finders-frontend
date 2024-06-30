"use client"
import Image from "next/image"

import { Roboto } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../utils/checkIsLoggedIn";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

const RecruiterNavItems = [
    {
        "item": "Hire Candidates",
        "link": "/recruiter/hire-candidates"
    },

    {
        "item": "Admin Dashboard",
        "link": "/recruiter"
    },


]

const SuperAdminNavItems = [
    {
        "item": "Super Admin Dashboard",
        "link": "/view-all-pending-jobs"
    },




]
export default function AdminNav({ isSuperAdmin, isRecruiter }) {
    const router = useRouter();
    const currentRoute = usePathname();
    
    const { isLoggedIn, setIsLoggedIn } = useAuth()
    const [hamburg, setHamBurg] = useState(false)


    const handleClick = () => {
        
        setHamBurg(!hamburg)
    }

    const handleLogOut = () => {
        Cookies.remove('accessToken')
        Cookies.remove('userId')
        setIsLoggedIn(false)
        router.push('/signin')
    }
    return (

        <header className="px-4 sm:px-40 sm:py-8 border-[1px] border-b-[#CFD1D4] flex flex-col justify-center h-[90px]  fixed top-0 left-0 bg-white w-full z-[999]">
            <nav className={`flex gap-10 items-center justify-between font-bold relative ${roboto.className}`}>
                <div className="max-w-[100px]  sm:max-w-[175px] sm:max-h-[95px]">
                    <Link href="/recruiter">
                        <Image src="/images/logo.png" alt="logo" className="max-w-full max-h-full" width="175" height="95" />
                    </Link>
                </div>
                <button className="pr-4 sm:hidden" onClick={handleClick}>
                    {hamburg ? <i className="bi bi-x font-bold text-2xl"></i> : <i className="bi bi-list font-bold text-2xl"></i>}
                </button>

                <ul className={`bottom-0 z-99 bg-white absolute sm:flex sm:static sm:top-0 sm:gap-4 ${hamburg ? "block top-16 right-0 text-left py-4 text-base pl-3 pr-10 bg-white w-fit h-fit" : "hidden "}`}>

                    {/* Navitems for Recruiter Page */}
                    {
                        isRecruiter && RecruiterNavItems.map((data, index) => {
                            return <Link href={data.link} onClick={handleClick} key={index}><li className={` ${currentRoute === `${data.link}` && "text-gurkha-yellow"
                                } mb-4 sm:mb-0`}>{data.item}</li></Link>
                        })
                    }


                    {/* Navitems for Recruiter SuperAdmin */}
                    {
                        isSuperAdmin && SuperAdminNavItems.map((data, index) => {
                            return <Link href={data.link} onClick={handleClick} key={index}><li className={` ${currentRoute === `${data.link}` && "text-gurkha-yellow"
                                } mb-4 sm:mb-0`}>{data.item}</li></Link>
                        })
                    }

                    <button className="sm:hidden bg-gurkha-yellow text-white py-2 px-6 rounded-3xl" onClick={handleLogOut}>Log Out</button>
                </ul>


                <button className="hidden sm:block bg-gurkha-yellow text-white py-2 px-6 rounded-3xl" onClick={handleLogOut}>Log Out</button>

            </nav>
        </header>
    )
}
