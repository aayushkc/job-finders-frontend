"use client"
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ShareButton({shareableUrl}){
     const [shareLink, setShareLink] = useState('');
     const generateShareLink = () => {
        
        setShareLink(shareableUrl);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        toast( 'Link Copied Successfully', {
            position: "top-center",
            autoClose: 600,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            });
            setShareLink('')
    };
    return(
        <>
         <button className="text-[#455065] flex gap-5 mt-5" onClick={generateShareLink}>
                    <p className="text-sm">SHARE</p>
                    <div className="">
                        <i className="bi bi-share-fill border-2 border-[#DFE3E9] p-2 sm:py-2 sm:px-3"></i>
                    </div>

                </button>
                {
                    shareLink &&
                    <div className="mt-3">
                        <input type="text" value={shareLink}  className="max-w-max border-2 border-grey p-2 text-[#0068B1] underline" readOnly/>
                        <button onClick={copyToClipboard}><i className="bi bi-copy ml-1"></i></button>
                    </div>
                }
                    
        <ToastContainer />
        </>
    )
}