"use client"
import Image from "next/image"
import { Roboto } from "next/font/google";
import Link from "next/link";
import {  useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../utils/checkIsLoggedIn";
import NavProfleTab from "./navProfileTab";



const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"], display:'swap' });

const NavItems = [
    {
        "item": "Home",
        "link": "/"
    },

    {
        "item": "Job",
        "link": "/jobs"
    },
    {
        "item": "Job Status",
        "link": "/job-status"
    },
    {
        "item": "My profile",
        "link": "/my-profile"
    },
   

]



const NavAnonItems = [
    {
        "item": "Home",
        "link": "/",
    },

    {
        "item": "Job",
        "link": "/jobs"
    },

    {
        "item": "Blogs",
        "link": "/blogs"
    },
    {
        "item": "About Us",
        "link": "/about-us"
    },
    {
        "item": "Events",
        "link": "/events"
    },


]

export default function NavBar() {
    const { isLoggedIn, setIsLoggedIn } = useAuth()
    const [hamburg, setHamBurg] = useState(false)
    const isSeeker = Cookies.get('isSeeker') === 'true'
    const router = useRouter();
    const currentRoute = usePathname();
    const accessToken = Cookies.get('accessToken')
    const [isClient, setIsClient] = useState(false)
    const [isTabClicked, setIsTabClicked] = useState(false)
    const handleClick = () => {

        setHamBurg(!hamburg)
    }

    const handleTabClicked = () =>{
        setIsTabClicked(!isTabClicked)
    }

    
    const handleLogOut = () => {
        Cookies.remove('accessToken')
        Cookies.remove('isSeeker')
        Cookies.remove('userId')
        setIsLoggedIn((prevState) =>{return {...prevState,logInStatus:false, username:''}})
        router.push('/signin')
        router.refresh()
    }

    // useEffect(() => {
    //     if (accessToken) {
    //         setIsLoggedIn((prevState) => {return {...prevState, logInStatus:true}})
    //     } else {
    //         setIsLoggedIn((prevState) => {return {...prevState, logInStatus:false}})
    //     }

    // }, [handleLogOut])

    useEffect(() =>{
        setIsClient(true)
    },[])
    return (
        <>
          <header className="px-4 sm:px-40 sm:py-8 border-[1px] border-b-[#CFD1D4] flex flex-col justify-center h-[90px]  fixed top-0 left-0 bg-white w-full z-[888]">
            <div>

            </div>
            <nav className={`flex gap-10 items-center justify-between font-bold relative ${roboto.className}`}>
                <div className="max-w-[100px]  sm:max-w-[175px] sm:max-h-[95px]">
                    <Link href="/" prefetch={false}>
                        <Image src="/images/logo.png" alt="logo" className="max-w-full max-h-full" width="175" height="95" priority={true}/>
                    </Link>
                </div>
                <button className="pr-4 sm:hidden" onClick={handleClick}>
                    {hamburg ? <i className="bi bi-x font-bold text-2xl"></i> : <i className="bi bi-list font-bold text-2xl"></i>}
                </button>

                <ul className={`${hamburg ? "flex flex-col  items-center gap-4 top-16 slide-in pt-14 -mx-4 text-center bg-white w-[110%] h-[100vh] border-2 " : "hidden "} text-xl sm:text-base sm:p-0 bottom-0 border-[#D8D9DC] sm:flex sm:border-none  z-99 bg-white absolute sm:flex-row sm:static sm:w-fit sm:h-fit sm:top-0 sm:gap-12`}>
                    {
                        isLoggedIn.logInStatus && isSeeker ? NavItems.map((data, index) => {
                            return <Link href={data.link} onClick={handleClick} key={index} prefetch={false}>
                                <li className={` ${currentRoute.split('/')[1] === data.link.slice(1) && "text-gurkha-yellow"} mb-4 sm:mb-0`}>{data.item}</li>
                            </Link>
                        })

                            :
                            NavAnonItems.map((data, index) => {
                                return <Link href={data.link} onClick={handleClick} key={index} prefetch={false}>
                                    <li className={` ${currentRoute === data.link && "text-gurkha-yellow"} mb-4 sm:mb-0`}>{data.item}</li>
                                </Link>
                            })
                    }
                    {}
                    {isLoggedIn.logInStatus ? isClient && accessToken && !isSeeker ? <Link href={'/recruiter'} onClick={handleClick} className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl sm:hidden"><li className={`mb-4 sm:mb-0`}>Admin Dashboard</li> </Link> :<button className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl sm:hidden" onClick={() =>{handleLogOut(); handleClick()}}>Log Out</button> : <Link href="/signin" prefetch={false} className="sm:hidden"><button className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl sm:hidden"  onClick={handleClick}>Login</button></Link>}
                </ul>


                {isLoggedIn.logInStatus ?isClient && accessToken && !isSeeker ? <Link href={'/recruiter'} onClick={handleClick} className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl hidden sm:block"><li className={`mb-4 sm:mb-0 list-none`}>Admin Dashboard</li> </Link>: <NavProfleTab handleLogOut={handleLogOut} handleTabClick={handleTabClicked} isTabClicked={isTabClicked} user_type={'Job Seeker'} username={isLoggedIn.username}/> : <Link href="/signin" prefetch={false} className="hidden sm:block"><button className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl"  onClick={handleClick}>Login</button></Link>}

            </nav>
        </header>
        {
                isTabClicked && <div className="absolute w-full h-full z-[88]" onClick={handleTabClicked}></div>
        }
        </>

      
    )
}
