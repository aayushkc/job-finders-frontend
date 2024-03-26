"use client"

import GetRequestNoToken from "@/app/api/getRequestNoToken"
import getRequestWithToken from "@/app/api/getRequestWithToken"
import PaginationComponent from "@/app/components/paginationcomponent"
import Cookies from "js-cookie"
import dynamic from "next/dynamic"
import { Suspense, useEffect, useState } from "react"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PostWithTokien from "@/app/api/postWithToken"
import PostFormWithToken from "@/app/api/postFormWithToken"
import DialogBox from "@/app/components/sucessbox"
import JobPanelData from "@/app/components/JobPanelData"
import { useParams, useSearchParams,useRouter, usePathname } from "next/navigation"



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


export default function JobDetail() {
    const serachParam = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const accessToken = Cookies.get('accessToken')
    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [jobPanelData, setJobPanelData] = useState()
    const [totalPage, setTotalPage] = useState(1)
    const [totalJobMatch, setTotalJobMatch] = useState(0)
    const [pageNum, setPageNum] = useState(serachParam.get("pageNum")||1)
    const [isAppliedClicked, setIsApplied] = useState(false)
    const [open, setOpen] = useState(true);
    const [success, setSuccess] = useState(false)
    const [falliure, setFaliure] = useState(false)
    console.log(serachParam.get("id"), serachParam.get("pageNum"));
    const handleClose = () => {
        setOpen(false);
        setIsApplied(false)
    };

    const handleApplyClick = () => {
        setOpen(true)
        setSuccess(false)
        setFaliure(false)
        setIsApplied(true)
    }
    const getRecommendedJobs = async (pageChange) => {
        try {

            const data = accessToken ? await getRequestWithToken(`/job-seeker/recommended-jobs/?page=${pageNum}`, accessToken) : await GetRequestNoToken(`/job-seeker/get-all-job/?page=${pageNum}`)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            // The total count of data needs to be dividd by the number of data sent per page by backend
            const pages = Math.ceil(data.count / 4)
            setTotalJobMatch(data.count)
            setTotalPage(pages)
            setRecommendedJobs(data.results)
            if(pageChange){
                setJobPanelData(data.results[0])

            }
        }
        catch (errors) {
            setRecommendedJobs([])
        }
    }

    const getJobFromId = async (id) => {
        try {
            const data = await GetRequestNoToken(`/job-seeker/get-job/${id}`)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            // The total count of data needs to be dividd by the number of data sent per page by backend
            
            setJobPanelData(data)

        }
        catch (errors) {
            setJobPanelData([])
        }
    }

    const handlePageChange = (e, page) => {
        console.log(page);
        setPageNum(page)
        
    }

    const handledApplied = async () => {
        console.log("Enterererserssfonsdfdsnoin");
       
        const formData = new FormData()
        formData.append("job", jobPanelData.id)
        try {
            const data = await PostFormWithToken(`/job-seeker/create-job-request/`, formData)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            getJobFromId(data.job)
            setIsApplied(false)
            setSuccess(true)
            // The total count of data needs to be dividd by the number of data sent per page by backend

        }
        catch (errors) {
            console.log(errors);
            setIsApplied(false)
            setFaliure(true)
        }
    }

    useEffect(() => {
        
        if(serachParam.get("id") && serachParam.get("pageNum")){
            getRecommendedJobs()
        }
            const nextSearchParams = new URLSearchParams(serachParam.toString())
            nextSearchParams.delete('id')
            nextSearchParams.delete('pageNum')
            
            router.replace(`${pathname}?${nextSearchParams}`)
        if(!serachParam.get("id")){
            getRecommendedJobs(true)
        }
           
    }, [pageNum])


    useEffect(()=>{
        if(serachParam.get("id") && serachParam.get("pageNum")){
            getJobFromId(serachParam.get("id"))
            setPageNum(serachParam.get("pageNum"))
        }
        else{
            getRecommendedJobs(true)
        }
     
      

    },[])

    return (
        <section className="max-w-[1440px] pt-6 pb-10">
           

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
                recommendedJobs.length >0 ? 
                <div className="bg-white pb-6  mx-20 grid grid-cols-[450px_1fr]">
                <div>
                    <div className="pl-6 py-4 border-r-[1px] border-r-[#DEE2E6] h-screen overflow-y-scroll">
                        <div className="bg-gurkha-yellow h-[55px] text-white py-4 pl-3">
                            <span className="font-bold">{totalJobMatch} Jobs</span> Match Your Skills
                        </div>

                        {
                            recommendedJobs?.map(data => {
                                return (
                                    <div>
                                        <div className={`pt-6 cursor-pointer pb-2 pl-4 ${data.id === jobPanelData?.id && 'bg-[#EBF3FA]'}`} autoFocus={data.id === jobPanelData?.id} key={data.id} onClick={(e) => {setJobPanelData(data); getJobFromId(data.id); }}>
                                            <div className="flex items-center gap-6">
                                                <div className="w-[55px] h-[55px]">
                                                    <img src={data.logo} className="w-full h-full object-contain" alt="logo" />
                                                </div>

                                                <div>
                                                    <h2 className="font-bold text-lg capitalize">{data.title}</h2>
                                                    <p className="text-[#79767C]"> {data.company}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm mt-8 mb-2 text-[#4F5052] capitalize mt-2">
                                                <p className="">Skills: <span className="text-black"> {data.required_skills.map(data => data.title + "/")}</span></p>

                                            </div>

                                            <div className="flex gap-2 font-medium items-center mt-8">
                                                <p className="text-[#3C831B]"> {data.work_location_type} |</p>
                                                <p>{data.salary}$ <span className="text-[#828282] text-sm">/month</span></p>
                                            </div>


                                        </div>
                                        <hr className=""></hr>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className="flex justify-center">
                        <PaginationComponent onChange={handlePageChange} page={pageNum} totalPage={totalPage} />
                    </div>

                </div>

           

                    {
                        jobPanelData?.id ?

                        
                        <JobPanelData jobPanelData={jobPanelData} handleApplyClick={handleApplyClick} isUserLoged = {accessToken}/>
                        :
                        <div className="flex justify-center items-center text-4xl font-bold">
                                <h2>Loading.........</h2>
                        </div>
                    }


               


            </div>
            :
            <div className="bg-white pb-6  mx-20 h-screen flex justify-center items-center font-extrabold text-4xl">
                Could not Find Any Jobs!
            </div>
            }
           
        </section>
    )
}