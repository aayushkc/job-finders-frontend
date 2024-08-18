import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizCompletionBox({ url, dialogHeading, dialogText, goToPageName, success, score, numberOfQuestion }) {
    const [open, setOpen] = useState(true);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const handleRoute = () => {
        router.push(url)
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
                    {dialogHeading}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {success &&
                            <span className='rounded-full flex justify-center '>
                                <i className="bi bi-check-circle-fill text-4xl mb-3 text-[#23A26D]"></i>
                            </span>
                        }
                    </DialogContentText>
                    <p className='text-center font-semibold mb-2'>Quiz Score: {score} out of {numberOfQuestion}</p>
                    <p className='font-bold mt-3 text-lg'>{dialogText}</p>
                </DialogContent>
                <DialogActions>
                    {
                        success ? <Button autoFocus onClick={handleRoute}>
                            Go {goToPageName}
                        </Button> : <Button onClick={() => { handleClose(); router.push('/jobs') }} autoFocus>
                            Ok
                        </Button>
                    }

                </DialogActions>
            </Dialog>
        </>
    );
}