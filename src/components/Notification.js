
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

/* 
    Acceptable props:
    1. posY, posX = location of the notification
    2. open = whether it is intiialized as open
    3. duration = how long should it be visible
    4. severity = message type
    5. message = what to display
*/
export const Notification = (props) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (<Snackbar
        open={open}
        autoHideDuration={props.autoHideDuration ? props.autoHideDuration : 3500}
        anchorOrigin={{ vertical: props.posY, horizontal: props.posX }}
        onClose={handleClose}
    >
        <Alert
            severity={props.severity ? props.severity : "info"}
            sx={{ width: '100%' }}
        >
            {props.message ? props.message : ""}
        </Alert>
    </Snackbar >)
};

