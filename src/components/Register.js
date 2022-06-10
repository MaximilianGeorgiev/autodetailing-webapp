import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

import { register } from "../api/user";

export const Register = () => {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const navigate = useNavigate();

    // state: {field1: {value: "", error: bool, errorMsg: ""}, field2: {...}}
    const [inputValues, setInputValues] = useState({});
    const [submitErrors, setSubmitErrors] = useState({});

    // All textfields will be iterated through and if there are any blank fields that are mandatory
    // the error boolean in state will be set
    const validateForm = () => {
        let updatedState = { ...inputValues };
        let formIsValid = true; // prevent api call if there are errors

        for (const [key, value] of Object.entries(inputValues)) {
            if (key === "address" || key === "phone") continue; // skip non-mandatory fields

            if (!value?.value || value?.value === "") {
                updatedState[key] = { ...value, error: true, errorMsg: 'This field is required.' };
                formIsValid = false;
            }

            // scenario: subsequent form submit and this field is no longer problematic
            else updatedState[key] = { ...value, error: false, errorMsg: '' };
        }

        // set state after the input validation and mark in red the columns as well as display the error messages
        setInputValues(updatedState);

        return formIsValid;
    };

    const submitForm = () => {
        // take the "value" properties only, omit error and errorMsg for API call
        let payload = { email: {}, password: {}, newPassword: {}, username: {}, fullname: {} };

        for (const [key, value] of Object.entries(inputValues))
            payload[key] = value.value;

        register(payload);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="emailAddress"
                                    required
                                    fullWidth
                                    id="emailAddress"
                                    label="E-mail address"
                                    autoFocus
                                    error={inputValues['email']?.error ? inputValues['email'].error : false}
                                    helperText={inputValues['email']?.errorMsg ? inputValues['email'].errorMsg: ""}
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues, email: { ...prevInputValues.email, value: e.target.value }
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    error={inputValues['username']?.error ? inputValues['username'].error : false}
                                    helperText={inputValues['username']?.errorMsg ? inputValues['username'].errorMsg : ""}
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues, username: { ...prevInputValues.username, value: e.target.value }
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    error={inputValues['password']?.error ? inputValues['password'].error : false}
                                    helperText={inputValues['password']?.errorMsg ? inputValues['password'].errorMsg: ""}
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues, password: { ...prevInputValues.password, value: e.target.value }
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="repeatPassword"
                                    label="Repeat password"
                                    type="password"
                                    id="repeatPassword"
                                    autoComplete="new-password"
                                    error={inputValues['newPassword']?.error ? inputValues['newPassword'].error : false}
                                    helperText={inputValues['newPassword']?.errorMsg ? inputValues['newPassword'].errorMsg: ""}
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues, newPassword: { ...prevInputValues.newPassword, value: e.target.value }
                                        }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="fullname"
                                    label="Full name"
                                    id="fullname"
                                    autoComplete="fullname"
                                    error={inputValues['fullname']?.error ? inputValues['fullname'].error : false}
                                    helperText={inputValues['fullname']?.errorMsg ? inputValues['fullname'].errorMsg: ""}
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues, fullname: { ...prevInputValues.fullname, value: e.target.value }
                                        }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="address"
                                    label="Address"
                                    id="address"
                                    autoComplete="address"
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues, address: { ...prevInputValues.address, value: e.target.value }
                                        }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    label="Phone number"
                                    id="phone"
                                    autoComplete="phone"
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues, phone: { ...prevInputValues.phone, value: e.target.value }
                                        }));
                                    }}
                                />
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => {
                                if (validateForm() === true) {
                                    submitForm();
                                    navigate('/');
                                }
                            }}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}