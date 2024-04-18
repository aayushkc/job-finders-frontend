"use client"
import Link from "next/link";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { useForm, Controller } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import PatchRequest from "../api/patchRequest";
import ProtectedAdminPage from "../utils/auth";
import { useRouter } from "next/navigation";
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
    const [open, setOpen] = useState(false);
    const [reqId, setReqId] = useState()
    const handleOpenStatusModal = (id) => {
        setReqId(id)
        setOpen(true)
    }

    const handleCloseStatusModal = () => {
        setOpen(false)
    }


    return (
        <ProtectedAdminPage>
        {open && <ChangeStatusModal open={open} handleModalClose={handleCloseStatusModal} id={reqId}/>}
            {
                applicant.map(data => {
                    return (
                        
                        <div className="bg-white px-8 py-4 rounded-xl border-[1px] border-[#D9D9D9] mt-4 flex gap-10 items-center" key={data.id}>


                            <div className='w-[125px] h-[125px] grid'>
                                <img src={data.job_seeker.seeker_details.profilePic ? data.job_seeker.seeker_details.profilePic : ""} alt="profile" className='w-24 h-18 object-cover rounded-md shadow-md place-self-center' />
                            </div>


                            <div>

                                <div className="flex gap-2 items-center mt-3">
                                    <p className="text-[#4F5052] text-sm">Full Name:</p>
                                    {`${data.job_seeker.seeker_details.first_name} ${data.job_seeker.seeker_details.middle_name} ${data.job_seeker.seeker_details.last_name}`}

                                </div>

                                <div className="flex gap-2 items-center mt-3">
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
                                
                                <div>
                                <button className="bg-gurkha-yellow py-2 px-3 text-sm rounded-xl mt-4 text-white" onClick={() =>handleOpenStatusModal(data.id)}>Change Status</button>
                                </div>
                                

                                <button className="bg-gurkha-yellow py-2 px-3 text-sm rounded-xl mt-4 text-white"><a href={data.job_seeker.seeker_details.resume}>Download Resume</a></button>
                                <div className=" mt-4 text-blue-600 flex items-center gap-3"><Link href={`applicants-details/${data.job_seeker.seeker_details.id}?job_req=${data.id}`}>View Profile Details</Link> <i className="bi bi-arrow-up-right"></i></div>




                            </div>



                        </div>
                    )

                })
            }
        </ProtectedAdminPage>
    )

}

const ChangeStatusModal = ({ open, handleModalClose, id }) => {
    const theme = useTheme();
    const router = useRouter()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (data) => {
        
        try {
            const res = await PatchRequest(`/recruiter/edit-recruiter-job-requests/${id}`, data)
         
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
                                            <option value={0}>Pending</option>
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