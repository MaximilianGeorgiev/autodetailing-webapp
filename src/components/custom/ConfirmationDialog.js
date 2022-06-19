import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

/*
props:
title, description, handleConfirm (what to do when confirm is clicked)
*/
export const ConfirmationDialog = (props) => {
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    console.log("is mounted");
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title ? props.title : "Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.description
              ? props.description
              : "You are about to delete this item."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
              handleClose();

              if (props.handleClose) props.handleClose();
          }}>Cancel</Button>
          <Button
            onClick={() => {
              props.handleConfirm();
              handleClose();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
