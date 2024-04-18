"use client"
import Image from "next/image"
import { Roboto } from "next/font/google";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../utils/checkIsLoggedIn";


const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });

const NavItems = [
    {
        "item":"Home",
        "link":"/"
    },

    {
        "item":"Job",
        "link":"/jobs"
    },
    {
        "item":"Job Status",
        "link":"/job-status"
    },
    {
        "item":"My profile",
        "link":"/my-profile"
    },
  
]



const NavAnonItems = [
    {
        "item":"Home",
        "link":"/"
    },

    {
        "item":"Job",
        "link":"/jobs"
    },
   
  
]
export default function NavBar(){
    const {isLoggedIn, setIsLoggedIn} = useAuth()
    const [hamburg, setHamBurg] = useState(false)
    const router = useRouter();
    const currentRoute = usePathname();
   

    const handleClick = () =>{
        
        setHamBurg(!hamburg)
    }

    const handleLogOut = () =>{
        Cookies.remove('accessToken')
        router.push('/signin')
    }

    useEffect(()=>{
        if(Cookies.get('accessToken')){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }
       
    },[handleLogOut])
    return(

        <header className="px-4 sm:px-40 sm:py-8 border-[1px] border-b-[#CFD1D4] flex flex-col justify-center h-[90px]  fixed top-0 left-0 bg-white w-full z-[999]">
            <nav className={`flex gap-10 items-center justify-between font-bold relative ${roboto.className}`}>
                <div className="max-w-[100px]  sm:max-w-[175px] sm:max-h-[95px]">
                    <Link href="/">
                        <Image src="/images/logo.png" alt="logo" className="max-w-full max-h-full" width="175" height="95"/>
                    </Link>
                </div>
                <button className="pr-4 sm:hidden" onClick={handleClick}>
                    {hamburg ? <i className="bi bi-x font-bold text-2xl"></i> : <i className="bi bi-list font-bold text-2xl"></i>}
                </button>
              
               <ul className={`${hamburg ? "block top-16 right-0 text-left py-4 text-base pl-3 pr-10 bg-white w-fit h-fit" :"hidden "} bottom-0  z-99 bg-white absolute sm:flex sm:static sm:top-0 sm:gap-12`}>
                    {
                        isLoggedIn ?NavItems.map((data,index) =>{
                            return <Link href={data.link} key={index}>
                                <li className={` ${currentRoute.startsWith(data.link) && "text-gurkha-yellow"} mb-4 sm:mb-0`}>{data.item}</li>
                                </Link>
                        })

                        :
                        NavAnonItems.map((data,index) =>{
                            return <Link href={data.link} key={index}>
                                <li className={` ${currentRoute.startsWith(data.link) && "text-gurkha-yellow"} mb-4 sm:mb-0`}>{data.item}</li>
                                </Link>
                        })
                    }

                    <Link href="/signin" className="sm:hidden"><button className="border-b-2 border-gurkha-yellow">Login</button></Link> 
                </ul>
             
                  
                   {isLoggedIn ? <button className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl" onClick={handleLogOut}>Log Out</button>: <Link href="/signin" className="hidden sm:block"><button className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl">Login</button></Link> }
               
            </nav>
        </header>
    )
}
