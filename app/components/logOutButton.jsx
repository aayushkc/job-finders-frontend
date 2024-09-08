"use client"

import Cookies from "js-cookie"
import { useAuth } from "../utils/checkIsLoggedIn"
import { useRouter } from "next/navigation"

export default function LogOutButton(){
    const { setIsLoggedIn } = useAuth()
    const router = useRouter()

    const handleLogOut = () =>{
        Cookies.remove('accessToken')
        Cookies.remove('isSeeker')
        Cookies.remove('userId')
        Cookies.remove('hasUserBeenActivated')
        setIsLoggedIn((prevState) =>{return {...prevState,logInStatus:false, username:''}})
        router.push('/signin')
        router.refresh()
    }
    return(
        <button className="text-left text-xs text-blue-500" onClick={handleLogOut}>Log out..??</button>
    )
}