"use client"
import Link from "next/link";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function NavProfleTab({ user_type, username, handleLogOut, handleTabClick, isTabClicked,isRecruiter }) {
   
    return (
        <>
        <div className="hidden sm:block"> 
            <div className="bg-[#F4F4F4] rounded-full py-2 px-3 flex gap-2 items-center relative">
                <div className="bg-[#99E8A5] text-[#414C61] rounded-full text-xs font-bold p-2">
                    {user_type}
                </div>
                <button className="bg-[#EDF3FB] text-lg rounded-full text-[#0D141F] px-3 py-2 flex gap-1 items-center" onClick={() => handleTabClick()}>
                    {username}
                    <FaAngleDown />
                </button>

                {
                    isTabClicked &&
                    (
                            <div className="bg-white shadow-2xl rounded-2xl z-[999] absolute text-center  py-3 -bottom-[6.5rem] right-3 w-[200px]" onClick={() => handleTabClick()}>
                                <ul className="flex items-center gap-2 flex-col">
                                    {
                                        !isRecruiter ?  <li><Link href={'/my-profile'}>My Profile</Link></li>: <li><Link href={'/recruiter'}>Dashboard</Link></li>
                                    }
                                   
                                    <button className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl hidden sm:block" onClick={() => {handleLogOut()}}>Log Out</button>
                                </ul>

                            </div>
                    )
                }
            </div>

        </div>
           

           
            {/* <button className="bg-gurkha-yellow text-white py-2 px-6 rounded-3xl hidden sm:block" onClick={() =>handleLogOut()}>Log Out</button> */}
        </>
    )
}