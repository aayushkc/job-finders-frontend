"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { ClipLoader } from "react-spinners"
import AdminDashBoardLayout from "@/app/components/DashBoardLayout"
import DialogBox from "@/app/components/sucessbox"
import PutWithTokien from "@/app/api/putRequest"
import GetRequestNoToken from "@/app/api/getRequestNoToken"

export default function EditPageMetaDataDetails() {
    const accessToken = Cookies.get('accessToken')
    const router = useParams()
    const [pageMetaSuccess, setPagMetaSuccess] = useState(false)
    const [pageMetaError, setPagMetaError] = useState(false)
    const [pageDetails, setPageDetails] = useState()
    const {
        handleSubmit,
        register,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm()

    const onSubmit = async (data) => {

        console.log(data);
        const subdata = { ...data,  'pageName':pageDetails[0]?.pageName}
        setPagMetaSuccess(false)
        setPagMetaError(false)
        try {
            const res = await PutWithTokien(`/page-meta-update/${pageDetails[0]?.id}`, subdata)
           
            if (res.detail) {
                throw new Error("Cannot Fetch")
            }
         
            setPagMetaSuccess(true)
        }
        catch (errors) {
            console.log(errors);
            setPagMetaError(true)
        }
    }

    const getPageDetatails = async () => {
        try {
            const pageDetails = await GetRequestNoToken(`/page-meta-view?pageName=${router.slug}`)
            console.log(pageDetails);
            setPageDetails(pageDetails)
            setValue('title', pageDetails[0].title)
            setValue('description', pageDetails[0].description)
        }
        catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getPageDetatails()
    }, [])
    return (
        <AdminDashBoardLayout>

{
                pageMetaSuccess && <DialogBox
                    dialogHeading={"Meta Data Has Been Edited Sucessfully"}
                    dialogText={"Meta Data has been edited SuccessFully"}
                    goToPageName={"View All Pages"}
                    url={"/euro-admin/edit-page-meta-data"}
                    success={true}
                />
            }

            {
                pageMetaError && <DialogBox
                    dialogHeading={"An Error occured during Submission"}
                    dialogText={"Please try again"}
                    error={true}
                />
            }

            {
                pageDetails?.length > 0 && (
                    <>
                        <h2 className="text-2xl font-semibold">Page Name: {pageDetails[0]?.pageName}</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/*  Title */}
                            <div className="my-4">
                                <label htmlFor="title" className="text-sm">Title</label>
                                <div className="flex gap-4 items-center mt-1">
                                    <input
                                        {...register("title", { required: true })}
                                        type="text"
                                        name='title'
                                        id="title"
                                        className="w-full rounded-xl bg-white py-4 px-3 text-black"


                                    />

                                </div>
                            </div>

                            {/*  Description */}
                            <div className="my-4">
                                <label htmlFor="description" className="text-sm">Description</label>
                                <div className="flex gap-4 items-center mt-1">
                                    <input
                                        {...register("description", { required: true })}
                                        type="text"
                                        name='description'
                                        id="description"
                                        className="w-full rounded-xl bg-white py-4 px-3 text-black"


                                    />

                                </div>
                            </div>


                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-6 block w-full cursor-pointer rounded bg-rose-500 px-4 py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <ClipLoader
                                            color={"#FFFFFF"}
                                            loading={true}
                                            size={20}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    ) : (
                                        "Edit Page Meta Data"
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )
            }


        </AdminDashBoardLayout>
    )
}