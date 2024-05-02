"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken"
import JobPanelData from "@/app/components/JobPanelData"
import DialogBox from "@/app/components/sucessbox"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import Cookies from "js-cookie"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { styled } from '@mui/material/styles';
import PostFormWithToken from "@/app/api/postFormWithToken"
import Link from "next/link"


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));



export default function JobFromId(){

    const [jobPanelData, setJobPanelData] = useState()
    const [open, setOpen] = useState(true);
    const [isAppliedClicked, setIsApplied] = useState(false)
    const [success, setSuccess] = useState(false)
    const [falliure, setFaliure] = useState(false)

    const router = useParams()

    const handleClose = () => {
        setOpen(false);
        setIsApplied(false)
    };

    const handledApplied = async () => {


        const formData = new FormData()
        formData.append("job", jobPanelData.id)
        try {
            const data = await PostFormWithToken(`/job-seeker/create-job-request/`, formData)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            setIsApplied(false)
            setSuccess(true)
            // The total count of data needs to be dividd by the number of data sent per page by backend

        }
        catch (errors) {

            setIsApplied(false)
            setFaliure(true)
        }
    }

    const accessToken = Cookies.get('accessToken')
    const handleApplyClick = () => {
        setOpen(true)
        setSuccess(false)
        setFaliure(false)
        setIsApplied(true)
    }

    const getJobFromId = async () => {
        console.log("ENterereere");
        try {
            const data = await GetRequestNoToken(`/job-seeker/get-job/${router.id}`)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }

            // The total count of data needs to be dividd by the number of data sent per page by backend
            console.log("DAtaaaaaaaaaaaa",data);
            setJobPanelData(data)

        }
        catch (errors) {
            setJobPanelData([])
        }
    }

    useEffect(()=>{
        getJobFromId()
    },[])

    return(
        <>
       
        <section className="sm:hidden">
        {
                    success && <DialogBox
                        dialogHeading={"Success"}
                        dialogText={"Your application has been sent successfully"}
                        success={true}
                        goToPageName={"Job Status"}
                        url={"/job-status"}
                    />
                }

                {
                    falliure && <DialogBox
                        dialogHeading={"An Error occured during Submission"}
                        dialogText={"Please try again"}
                        error={true}
                    />
                }

                {
                    isAppliedClicked &&
                    <>
                        <BootstrapDialog
                            onClose={handleClose}
                            aria-labelledby="customized-dialog-title"
                            open={open}
                        >
                            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                                Apply for the Job
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >

                            </IconButton>
                            <DialogContent dividers>

                                <Typography gutterBottom>
                                    When clicked "Apply", your profile information along with the resume will be sent to the job poster.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handledApplied}>
                                    Apply
                                </Button>

                                <Button className="bg-red-600 text-white hover:bg-red-400" onClick={handleClose}>
                                    Close
                                </Button>
                            </DialogActions>
                        </BootstrapDialog>
                    </>
                }
            {
                jobPanelData && <JobPanelData jobPanelData={jobPanelData} handleApplyClick={handleApplyClick} isUserLoged={accessToken} />
            }

        </section>
        <section className="hidden sm:grid w-full h-[90vh]">
            <div className="place-self-center">
                <h1 className="font-bold text-3xl mb-6">Not Allowed to View this Page</h1>
            <Link href="/jobs" className="flex justify-center"><button className="bg-gurkha-yellow py-3 px-6 rounded-xl text-white text-lg">Go back</button></Link>
            </div>
               
        </section>
             
        </>
      
    )
}