"use client"
import { Tooltip } from "@mui/material";
import { useState } from "react";

import { FaShareFromSquare } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
export default function ShareButton({ shareableUrl, className }) {
    const [openLink, setOpenLink] = useState(true);
    const generateShareLink = () => {
        navigator.clipboard.writeText(shareableUrl);
        toast('Link Copied Successfully', {
            position: "top-center",
            autoClose: 600,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
        });
    };

    const copyToClipboard = () => {
      
        setOpenLink(false)
    };

   
    return (
        <>
        <Tooltip title="Share Link">
        <button className={`text-[#455065] ${className?.map(data => data)}`} onClick={generateShareLink}>
                    <FaShareFromSquare className="" />
                </button>
        </Tooltip>
         
                {/* <div className="flex gap-2 mt-3">
                    <input type="text" value={shareableUrl} className="max-w-max border-2 border-grey p-2 text-[#0068B1] underline" readOnly />
                    <button onClick={copyToClipboard}><i className="bi bi-copy ml-1"></i></button>
                </div> */}
            <ToastContainer />
        </>

    )
}