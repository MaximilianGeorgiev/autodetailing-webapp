import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from 'react-i18next';

/*
props:
title, description, handleConfirm (what to do when confirm is clicked)
*/
export const ConfirmationDialog = (props) => {
  const [open, setOpen] = React.useState(true);
  const { t } = useTranslation();

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
          {props.title ? props.title : t("Are you sure?")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.description
              ? props.description
              : t("You are about to delete this item.")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            handleClose();

            if (props.handleClose) props.handleClose();
          }}>{t("Cancel")}</Button>
          <Button
            onClick={() => {
              props.handleConfirm();
              handleClose();
            }}
            autoFocus
          >
            {t("Confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
