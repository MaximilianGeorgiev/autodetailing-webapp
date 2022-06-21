import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useState, useEffect } from "react";
import { getUserById } from "../../api/user";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";
import { validatePhone } from '../../utils/validator';

/*
Current implementation:
1. If the user is logged in the form is prepopulated with their information
2. If not the user will have to input them manually and then a user with the provided info will be saved in the
database for reference (username and password will be mocked)
3. If the user is logged in but has no phone number (since it is not mandatory) the user will be prompted to input one
4. The user profile will then be updated and the reservation successfully made.
*/
export const Reservation = (props) => {
    const [open, setOpen] = useState(true);

    const [inputValues, setInputValues] = useState({
        date: { value: null, error: false, errorMsg: "" },
        email: { value: "", error: false, errorMsg: "" },
        fullname: { value: "", error: false, errorMsg: "" },
        phone: { value: "", error: false, errorMsg: "" },
    });

    useEffect(() => {
        // prepopulate form if user is logged in
        const hasCookies = clientHasLoginCookies();
        const userId = getCookieByName("user_id");

        if (hasCookies && userId !== "undefined") {
            getUserById(userId).then((res) => {
                const user = res.data?.payload[0];
                let updatedState = { ...inputValues };

                updatedState.email = {
                    value: user.user_email,
                    error: inputValues.email.error,
                    errorMsg: inputValues.email.errorMsg,
                };

                updatedState.fullname = {
                    value: user.user_fullname,
                    error: inputValues.fullname.error,
                    errorMsg: inputValues.fullname.errorMsg,
                };

                if (user.user_phone) {
                    updatedState.phone = {
                        value: user.user_phone,
                        error: inputValues.phone.error,
                        errorMsg: inputValues.phone.errorMsg,
                    };
                }

                setInputValues(updatedState);
            })
        }
    }, []);

    const handleClose = () => {
        setOpen(false);

        if (props.handleClose) props.handleClose();
    };

    const processReservation = () => {
        let updatedState = { ...inputValues };

        if (!inputValues?.date?.value)
            updatedState.date = {
                value: updatedState.date.value,
                error: true,
                errorMsg: "Appointment date cannot be empty.",
            };

        if (!inputValues?.phone?.value)
            updatedState.phone = {
                value: updatedState.phone.value,
                error: true,
                errorMsg: "A phone number is required.",
            };

        // case: subsequent error requests but one of the fields is corrected
        if (inputValues?.date?.value)
            updatedState.date = {
                value: updatedState.date.value,
                error: false,
                errorMsg: "",
            };

        if (inputValues?.phone?.value) {
            if (validatePhone(updatedState.phone.value))
                updatedState.phone = {
                    value: updatedState.phone.value,
                    error: false,
                    errorMsg: "",
                };
            else updatedState.phone = {
                value: updatedState.phone.value,
                error: true,
                errorMsg: "The provided phone number is invalid.",
            };
        }

        setInputValues(updatedState);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle align="center">Make an appointment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        In order to book an appointment for this service you will have to verify the following information:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        disabled
                        label="Email Address"
                        type="email"
                        variant="standard"
                        sx={{ marginRight: 25 }}
                        value={inputValues["email"].value}
                        error={
                            inputValues["email"]?.error
                                ? inputValues["email"].error
                                : false
                        }
                        helperText={
                            inputValues["email"]?.errorMsg
                                ? inputValues["email"].errorMsg
                                : ""
                        }
                        onChange={(e) => {
                            setInputValues((prevInputValues) => ({
                                ...prevInputValues,
                                email: {
                                    value: e.target.value,
                                },
                            }));
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Full name"
                        type="email"
                        disabled
                        variant="standard"
                        sx={{ marginRight: 25 }}
                        value={inputValues["fullname"].value}
                        error={
                            inputValues["fullname"]?.error
                                ? inputValues["fullname"].error
                                : false
                        }
                        helperText={
                            inputValues["fullname"]?.errorMsg
                                ? inputValues["fullname"].errorMsg
                                : ""
                        }
                        onChange={(e) => {
                            setInputValues((prevInputValues) => ({
                                ...prevInputValues,
                                fullname: {
                                    value: e.target.value,
                                },
                            }));
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Phone number"
                        type="email"
                        variant="standard"
                        sx={{ marginRight: 25 }}
                        error={
                            inputValues["phone"]?.error
                                ? inputValues["phone"].error
                                : false
                        }
                        helperText={
                            inputValues["phone"]?.errorMsg
                                ? inputValues["phone"].errorMsg
                                : ""
                        }
                        onChange={(e) => {
                            setInputValues((prevInputValues) => ({
                                ...prevInputValues,
                                phone: {
                                    value: e.target.value,
                                },
                            }));
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Appointment date"
                        type="date"
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={
                            inputValues["date"]?.error
                                ? inputValues["date"].error
                                : false
                        }
                        helperText={
                            inputValues["date"]?.errorMsg
                                ? inputValues["date"].errorMsg
                                : ""
                        }
                        onChange={(e) => {
                            setInputValues((prevInputValues) => ({
                                ...prevInputValues,
                                date: {
                                    value: e.target.value,
                                },
                            }));
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => processReservation()}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
