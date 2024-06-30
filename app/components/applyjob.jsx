"use client"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Link from "next/link";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function ApplyJob({quizData, handleClose, handledApplied, open, jobId}){
    return(
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
                    {
                        quizData ? 'The Job Poster requires you to take quiz before applying. Click the "Take Quiz" button below to take the quiz and apply to the job.' : 'When clicked "Apply", your profile information along with the resume will be sent to the job poster.'
                    }
                    
                </Typography>
            </DialogContent>
            <DialogActions>
                {
                    quizData ? (
                        <Link href={`/question-set/${quizData.id}?jobId=${jobId}`}>
                            <Button>
                                Take Quiz
                            </Button>
                        </Link>

                    )
                        :
                        (
                            <Button onClick={() => handledApplied()}>
                                Apply
                            </Button>
                        )
                }


                <Button className="bg-red-600 text-white hover:bg-red-400" onClick={() => handleClose()}>
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    </>
    )
}