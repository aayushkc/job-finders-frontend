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
//Read-only Editor
const FroalaEditor = dynamic(
    () => import('react-froala-wysiwyg/FroalaEditorView'),
    { ssr: false }
);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));


export default function Job() {
    const accessToken = Cookies.get('accessToken')
    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [jobPanelData, setJobPanelData] = useState()
    const [totalPage, setTotalPage] = useState(1)
    const [totalJobMatch, setTotalJobMatch] = useState(0)
    const [pageNum, setPageNum] = useState(1)
    const [isAppliedClicked, setIsApplied] = useState(false)
    const [open, setOpen] = useState(true);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      setIsApplied(false)
    };

    const handleApplyClick = () =>{
        setOpen(true)
        setIsApplied(true)
    }
    const getRecommendedJobs = async () => {
        try {
            const data = await getRequestWithToken(`/job-seeker/recommended-jobs/?page=${pageNum}`, accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log(data);
            // The total count of data needs to be dividd by the number of data sent per page by backend
            const pages = Math.ceil(data.count / 4)
            setTotalJobMatch(data.count)
            setTotalPage(pages)
            setRecommendedJobs(data.results)
            setJobPanelData(data.results[0])

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

    const handledApplied =async () =>{
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
            // The total count of data needs to be dividd by the number of data sent per page by backend

        }
        catch (errors) {
            console.log(errors);
        }
    }

    useEffect(() => {
        getRecommendedJobs()
    }, [pageNum])

    return (
        <section className="max-w-[1440px] pt-6 pb-10">
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
                <Button  onClick={handledApplied}>
                   Apply
                  </Button>

                  <Button className="bg-red-600 text-white hover:bg-red-400" onClick={handleClose}>
                   Close
                  </Button>
                </DialogActions>
              </BootstrapDialog>
              </>
            }
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
                                        <div className={`pt-6 cursor-pointer pb-2 pl-4 ${data.id === jobPanelData.id && 'bg-[#EBF3FA]'}`} key={data.id} onClick={(e) => { console.log(data); getJobFromId(data.id); }}>
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
                    <PaginationComponent onChange={handlePageChange} totalPage={totalPage}/>
                    </div>
                   
                </div>

                <Suspense fallback={<h1>Loading..............</h1>}>

                    {
                        jobPanelData &&

                        <div className="py-4 px-16 h-screen overflow-y-scroll">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-2xl">{jobPanelData.title}</h2>
                                { jobPanelData.hasApplied ? 
                                <button disabled className="bg-green-300 rounded-3xl py-2 px-6 text-white">
                                    Already Applied
                                </button>
                                :
                                 <button onClick={handleApplyClick} className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white">
                                 Apply Now
                             </button> }
                                
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Job Type</h2>
                                <p className="text-sm text-[#79767C] mt-3">{jobPanelData.work_location_type}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Domain</h2>
                                <p className="text-sm text-[#79767C] mt-3">{jobPanelData.job_category[0].title}</p>
                            </div>


                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Company Name </h2>
                                <p className="text-sm text-[#79767C] mt-3">{jobPanelData.company}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Required Skills </h2>
                                <div className="border-2 border-[#06BB0E] py-2 px-4 w-full mt-4 rounded-lg flex flex-wrap gap-4">
                                    {jobPanelData.required_skills.map(data => <div className="bg-[#E6F8E7] font-medium text-sm py-2 pl-3 pr-8 rounded-lg max-w-fit capitalize"> {data.title}</div>)}
                                </div>


                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Experience</h2>
                                <p className="text-sm text-[#79767C] mt-3 capitalize">{jobPanelData.required_years_of_experience}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Positions</h2>
                                <p className="text-sm text-[#79767C] mt-3 capitalize">{jobPanelData.number_of_vacancy}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Location</h2>
                                <p className="text-sm text-[#79767C] mt-3 capitalize">{jobPanelData.job_location}</p>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Job Description</h2>
                                <div className="w-full rounded-xl  py-4 px-3 text-[#475569] border-2 border-[#23232180] min-h-[300px] mt-3">
                                    <FroalaEditor
                                        model={jobPanelData.description}
                                        className="bg-white h-[300px]"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">About the Company</h2>
                                <div className="w-full rounded-xl  py-4 px-3 text-[#475569] border-2 border-[#23232180] min-h-[300px] mt-3">
                                    <FroalaEditor
                                        model={jobPanelData.company_description}
                                        className="bg-white h-[300px]"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-semibold text-xl">Salary</h2>
                                <div className="text-lg text-[#79767C] mt-3 capitalize flex gap-4 items-center">
                                    <i className="bi bi-coin text-[#FFB000] text-2xl"></i>
                                    <p className="text-[#01B46A]">{jobPanelData.salary} $/month </p>
                                </div>
                            </div>

                            { !jobPanelData.hasApplied &&
                                 <button onClick={handleApplyClick} className="bg-[#FFB000] rounded-3xl py-2 px-6 text-white">
                                 Apply Now
                             </button> }

                        </div>
                    }


                </Suspense>


            </div>
        </section>
    )
}