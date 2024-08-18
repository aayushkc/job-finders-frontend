"use client"
import Link from "next/link";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import PatchRequest from "../api/patchRequest";
import ProtectedAdminPage from "../utils/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ApplicantDisplayCard({ applicant }) {
    const navigate = useRouter()
    const params = useSearchParams()
    const job_title = params?.get('job-title') || null
    const company = params?.get('company') || null
    const [open, setOpen] = useState(false);
    const [reqId, setReqId] = useState()
    const [seekerId, setSeekerId] = useState()
    const handleOpenStatusModal = (id, seekId) => {
        setReqId(id)
        console.log("seeeker id", seekId);
        setSeekerId(seekId)
        setOpen(true)
    }

    const handleCloseStatusModal = () => {
        setOpen(false)
    }

console.log(applicant);
    return (
        <ProtectedAdminPage>
        {open && <ChangeStatusModal open={open} handleModalClose={handleCloseStatusModal} id={reqId} seekId={seekerId} jobTitle= {job_title} company={company}/>}
        <button className="py-2 px-4 text-sm bg-gurkha-yellow text-white rounded-xl  mt-6" onClick={() => navigate.back() }> <i className="mr-1 bi bi-arrow-left"></i> Go back</button>
            {
                applicant.map(data => {
                    const timeToComplete = data.quiz_completion_time?.split(':').map(data => parseInt(data))
                   
                    return (
                        
                        <div className="bg-white px-4 sm:px-8 py-4 rounded-xl border-[1px] border-[#D9D9D9] mt-4 flex flex-col gap-4 sm:flex-row sm:gap-10 items-center" key={data.id}>


                            <div className='w-[125px] h-[125px] grid'>
                                <img src={data.job_seeker.seeker_details.profilePic ? data.job_seeker.seeker_details.profilePic : ""} alt="profile" className='w-24 h-18 object-cover rounded-md shadow-md place-self-center' />
                            </div>


                            <div>

                                <div className="flex gap-2 items-center mt-3">
                                    <p className="text-[#4F5052] text-sm">Full Name:</p>
                                    {`${data.job_seeker.seeker_details.first_name} ${data.job_seeker.seeker_details.middle_name} ${data.job_seeker.seeker_details.last_name}`}

                                </div>

                                <div className="flex flex-wrap gap-2 items-center mt-3">
                                    <p className="text-[#4F5052] text-sm">Skills:</p>
                                    {data.job_seeker.seeker_details.skills.map((data, index) => {
                                        
                                        return <p className="bg-[#F3F4F8] text-black text-xs font-light p-2 rounded-xl" key={index}>{data.title}</p>
                                    })}

                                </div>

                                <div className="flex gap-2 items-center mt-3">
                                    <p className="text-[#4F5052] text-sm">Current Status:</p>
                                    {data.status === 0 && <p className="text-[#FFB636]">Pending</p>}
                                    {data.status === 1 && <p className="text-red-500">Rejected</p>}
                                    {data.status === 2 && <p className="text-green-500">Shortlisted</p>}

                                </div>
                                        
                                <div className="flex gap-2 items-center mt-3">
                                    <p className="text-[#4F5052] text-sm">Quiz Score:</p>
                                    {data.quiz_score === 0 ? <p className="text-[#FFB636]">None</p> : <p className="text-[#FFB636]">{data.quiz_score}/{data.quiz_question}</p>}
                                </div>
                                <div className="text-[#4F5052] text-sm mt-1">
                                    {
                                       data.quiz_completion_time && (timeToComplete[1] === 0 && timeToComplete[2] === 0 ? <p>User could not complete quiz on time</p>: 
                                       <em>User took {timeToComplete[1] > 0 && `${timeToComplete[1]} minutes and`}  {`${timeToComplete[2]} seconds`} to complete the quiz.</em>)
                                    }
                                    
                                   
                                </div>
                                <div>
                                <button className="bg-gurkha-yellow py-2 px-3 text-sm rounded-xl mt-4 text-white" onClick={() =>handleOpenStatusModal(data.id,data.job_seeker.id)}>Change Status</button>
                                </div>
                                

                                <button className="bg-gurkha-yellow py-2 px-3 text-sm rounded-xl mt-4 text-white"><a href={data.job_seeker.seeker_details.resume} target="_blank">Download Resume</a></button>
                                <div className=" mt-4 text-blue-600 flex items-center gap-3"><Link href={`applicants-details/${data.job_seeker.seeker_details.id}?job_req=${data.id}&job-title=${job_title}&company=${company}&userId=${data.job_seeker.id}`}>View Profile Details</Link> <i className="bi bi-arrow-up-right"></i></div>




                            </div>



                        </div>
                    )

                })
            }
        </ProtectedAdminPage>
    )

}

const ChangeStatusModal = ({ open, handleModalClose, id, seekId, jobTitle, company }) => {
    const theme = useTheme();
    const router = useRouter()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (data) => {
        console.log(seekId);
        const d = {'user':seekId,'job_title':jobTitle, 'company':company,...data}
        try {
            const res = await PatchRequest(`/recruiter/edit-recruiter-job-requests/${id}`, d)
         
            if (res.detail) {
                
                throw new Error("Cannot Fetch")
            }
          
            handleModalClose()
            window.location.reload()
        }
        catch (errors) {
            toast.error( 'An error Occured. Try again Later.', {
                position: "bottom-right",
                autoClose: 800,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                });
           
            
        }
    }

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => handleModalClose()}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Change Job Request Status
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth>
                                {/* <InputLabel htmlFor="demo-dialog-native">Choose Status</InputLabel> */}
                                <Controller
                                    control={control}
                                    name="status"
                                    defaultValue={0}
                                    render={({ field }) => (

                                        <Select
                                            {...field}
                                            native
                                            value={field.value}
                                            onChange={field.onChange}

                                        >
                                            <option value={0} disabled>Pending</option>
                                            <option value={1}>Reject</option>
                                            <option value={2}>Shortlist</option>
                                        </Select>

                                    )}

                                />




                            </FormControl>
                            <div className="flex gap-2 justify-end mt-6">
                                <button  disabled={isSubmitting} type="submit" autoFocus className="text-white rounded-lg bg-gurkha-yellow py-2 px-3">
                                {isSubmitting ? (
                            <ClipLoader
                                color={"#FFFFFF"}
                                loading={true}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        ) : (
                            "Confirm"
                        )}
                                </button>
                                <button type="button" className="text-white rounded-lg bg-red-500 py-2 px-3" onClick={() => handleModalClose()}>
                                        Close
                                </button>

                            </div>

                        </form>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <ToastContainer />
        </>
    );
}