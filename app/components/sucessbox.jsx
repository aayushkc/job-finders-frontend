
"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

export default function DialogBox({ url, dialogHeading, dialogText, goToPageName, success, error, deleteBox }) {
  const [open, setOpen] = React.useState(true);
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
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {dialogHeading}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {success &&
              <div className='rounded-full flex justify-center '>
                <i className="bi bi-check-circle-fill text-4xl mb-3 text-[#23A26D]"></i>
              </div>
            }
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            success ? <Button autoFocus onClick={handleRoute}>
              Go {goToPageName}
            </Button> : <Button onClick={handleClose} autoFocus>
              Ok
            </Button>
          }

          {!deleteBox && <Button onClick={handleClose} autoFocus>
            Close
          </Button>}

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}