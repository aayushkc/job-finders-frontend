"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken";
import Image from "next/image";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { Lexend_Deca } from "next/font/google";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const lexend = Lexend_Deca({ subsets: ["latin"] });
export default function BlogPage() {
    const blogId = useParams();
    const [blogDetail, setBlogDetail] = useState()
    const [shareLink, setShareLink] = useState('');


    const getBlogDetail = async () => {
        console.log("Enterredddd");
        try {
            const data = await GetRequestNoToken(`/api/v2/pages/${blogId.id}/`)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }

            setBlogDetail(data)

        }
        catch (errors) {
            console.log("Erro Data", errors);
            setBlogDetail()
        }
    }

    const generateShareLink = (postTitle, postUrl) => {
        const titleForSharing = `HireGurkha-${postTitle}`;
        const urlForSharing = `https://hiregurkha.com/blogs/${blogId.id}`;
        const sharedLink = `${urlForSharing}?title=${encodeURIComponent(titleForSharing)}`;
        setShareLink(sharedLink);
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

    useEffect(() => {
        getBlogDetail()
    }, [blogId.id])
    return (
        <>


            <section className={lexend.className + " bg-white sm:px-40 py-16 px-8"} key={blogDetail?.id}>

                <h2 className="text-2xl sm:text-4xl text-[#213343] sm:leading-[60px]">{blogDetail?.title}</h2>
                <button className="text-[#455065] flex gap-5 mt-5" onClick={() => generateShareLink(blogDetail?.title, `${APIENDPOINT}/blogs/${blogDetail?.id}`)}>
                    <p className="text-sm">SHARE</p>
                    <div className="">
                        <i className="bi bi-share-fill border-2 border-[#DFE3E9] p-2 sm:py-2 sm:px-3"></i>
                    </div>

                </button>
                {shareLink && (
                    <div className="mt-3">
                        <input type="text" value={shareLink} className="max-w-max border-2 border-grey p-2 text-[#0068B1] underline" readOnly/>
                        <button onClick={copyToClipboard}>Copy Link</button>
                    </div>
                )}
                <hr className="mt-6"></hr>
                <div className="flex flex-col sm:flex-row justify-between items-center my-4 px-4">
                    <p className="underline text-[#0068B1]">By: Hire Gurkha</p>
                    <p className="text-[#2E475D] mt-3 sm:mt-0">Published: April 09, 2024</p>
                </div>
                <hr className="mt-6"></hr>
                <div className="py-10 sm:px-12">
                    <div className="flex justify-center">
                        <img src={blogDetail ? `${blogDetail?.thumbnail.url}` : ""} width={626} height={626} alt={blogDetail ? blogDetail.thumbnail.alt : "thumbnail"}/>
                    </div>

                    <div className="mt-5 sm:mx-16">
                        <p className="text-lg text-[#213343] font-light mt-4 sm:leading-[32px]" dangerouslySetInnerHTML={{ __html: blogDetail?.body }}></p>
                    </div>
                </div>
            </section>

            <ToastContainer />

        </>
    )
}