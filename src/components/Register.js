import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { register, checkUserExists } from "../api/user";
import { validateUsername, validatePhone, validateEmail, validatePassword } from "../utils/validator";
import { clientHasLoginCookies } from "../utils/cookies";

export const Register = () => {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const navigate = useNavigate();

    useEffect(() => {
        // logged in users shouldn't access register page
        const hasCookies = clientHasLoginCookies();

        if (hasCookies) navigate("/");
    }, []);

    // state: {field1: {value: "", error: bool, errorMsg: ""}, field2: {...}}
    const [inputValues, setInputValues] = useState({
        email: { value: "", error: false, errorMsg: "" },
        username: { value: "", error: false, errorMsg: "" },
        password: { value: "", error: false, errorMsg: "" },
        newPassword: { value: "", error: false, errorMsg: "" },
        fullname: { value: "", error: false, errorMsg: "" },
        phone: { value: "", error: false, errorMsg: "" },
        address: { value: "", error: false, errorMsg: "" }
    });

    const [submitErrors, setSubmitErrors] = useState({});

    /* Due to the complex logic behind validation it is described as:
        1. All text fields will be iterated through and if there are any blank fields that mandatory 
        an error message and an error will occur next to the textfield
        2. On subsequent calls the fields get validated again and if there is no longer an error then the
        state is updated and the textfield no longer has errors but the form can still have other errors (we 
            just have to clear this particular field)
        3. The phone is a non-mandatory field but if there is an invalid phone number provided it must be validated.
        If there is no phone or it is a valid phone, then it's good to go.
        4. The password and confirm password fields must match.
        5. The password, email, username and phone have their own validation rules in src/utils/validator.js and must be valid
        
        Only after all of the conditions are met and the form is free of errors, only then can it be submitted and an API call made.
    */

    const validateForm = () => {
        let updatedState = { ...inputValues };
        let formIsValid = true; // prevent api call if there are errors

        // if there are two passwords inputted we proceed to compare both fields if they are the same
        if (
            updatedState.password?.value !== "" &&
            updatedState.password?.value !== undefined
        ) {

            if (updatedState.newPassword.value === "" || updatedState.newPassword.value === undefined) {
                updatedState.newPassword = {
                    value: updatedState.newPassword.value,
                    error: true,
                    errorMsg: "Please confirm your password.",
                };

                setInputValues(updatedState);
                return false;
            } else {
                updatedState.newPassword = {
                    value: updatedState.newPassword.value,
                    error: false,
                    errorMsg: "",
                };

            }

            if (updatedState.password.value !== updatedState.newPassword.value) {
                const password = updatedState.password.value;
                updatedState.password = {
                    value: updatedState.password.value,
                    error: true,
                    errorMsg: "Passwords do not match.",
                };

                updatedState.newPassword = {
                    value: updatedState.newPassword.value,
                    error: true,
                    errorMsg: "Passwords do not match.",
                };

                setInputValues(updatedState);
                return false;
            } else {
                // scenario: previous button click they didn't match, now they match
                updatedState.password = {
                    value: updatedState.password.value,
                    error: false,
                    errorMsg: "",
                };
                updatedState.newPassword = {
                    value: updatedState.newPassword.value,
                    error: false,
                    errorMsg: "",
                };
            }
        }

        for (const [key, value] of Object.entries(inputValues)) {
            /* Non-mandatory fields are skipped but if there is a phone number inputted
                 then it will be validated. It should either start with a "0" or with the country
                 code "+359". Respectively, the length would be either 13 (plus country code) or 10 with the
                 other type.
              */

            if (key === "address") continue;

            if (key === "phone" && value.value !== "") {
                if (!validatePhone(value.value)) {
                    updatedState[key] = {
                        ...value,
                        error: true,
                        errorMsg: "The provided phone number is invalid.",
                    };

                    setInputValues(updatedState);
                    return false;

                } else {
                    updatedState[key] = {
                        ...value,
                        error: false,
                        errorMsg: "",
                    }; // subsequent call where the phone is now valid

                    setInputValues(updatedState);
                    continue;
                }
            } else if (key === "phone" && value.value === "") {
                updatedState[key] = {
                    ...value,
                    error: false,
                    errorMsg: "",
                }; // subsequent call where the phone is now valid/omitted

                setInputValues(updatedState);
                continue;
            }

            if (!value?.value || value?.value === "") {
                updatedState[key] = {
                    ...value,
                    error: true,
                    errorMsg: "This field is required.",
                };
                formIsValid = false;
            } else {
                updatedState[key] = {
                    ...value,
                    error: false,
                    errorMsg: "",
                };
                formIsValid = true;
            }


            if (key === "email" && formIsValid) {
                const isValid = validateEmail(value?.value);

                if (!isValid) {
                    updatedState[key] = {
                        ...value,
                        error: true,
                        errorMsg: "The provided E-mail is not valid.",
                    };
                    formIsValid = false;
                } else {
                    // scenario: subsequent form submit and this field is no longer problematic
                    updatedState[key] = {
                        ...value,
                        error: false,
                        errorMsg: "",
                    };

                    formIsValid = true;
                }
            }

            if (key === "username" && formIsValid) {
                const isValid = validateUsername(value?.value);

                if (!isValid) {
                    updatedState[key] = {
                        ...value,
                        error: true,
                        errorMsg: "User name is not valid. The length should be between 5 and 20 characters.",
                    };
                    formIsValid = false;
                }
                else {
                    // scenario: subsequent form submit and this field is no longer problematic
                    updatedState[key] = {
                        ...value,
                        error: false,
                        errorMsg: "",
                    };

                    formIsValid = true;
                }
            }

            if (key === "password" && formIsValid && updatedState.newPassword.value !== "") {
                const isValid = validatePassword(updatedState.password.value);

                if (!isValid) {
                    updatedState.password = {
                        ...updatedState.password.value,
                        error: true,
                        errorMsg: "Password is not valid. It should contain at least one uppercase and lower case character and a digit. It should be between 5 and 20 characters.",
                    };

                    formIsValid = false;
                } else {
                    // scenario: subsequent form submit and this field is no longer problematic
                    updatedState[key] = {
                        ...value,
                        error: false,
                        errorMsg: "",
                    };
                }
            }

        }

        // set state after the input validation and mark in red the columns as well as display the error messages
        setInputValues(updatedState);

        return formIsValid;
    };

    const submitForm = async () => {
        // take the "value" properties only, omit error and errorMsg for API call
        let payload = {
            email: {},
            password: {},
            newPassword: {},
            username: {},
            fullname: {},
        };

        for (const [key, value] of Object.entries(inputValues))
            payload[key] = value.value;

        let userExists = false;

        await checkUserExists({
            email: payload.email,
            username: payload.username,
        }).then((res) => {
            if (res.data?.status !== "success")
                setSubmitErrors({
                    error: true,
                    errorMsg: "A database error has occured",
                });

            if (res.data?.status === "success" && res.data?.result === "user exists")
                userExists = true;
        });

        if (userExists) {
            setSubmitErrors({
                error: true,
                errorMsg: "User with provided credentials already exists.",
            });
            return false; // submitForm not successful
        }

        register(payload).then((res) => {
            if (res.data?.status === "failed")
                setSubmitErrors({
                    error: true,
                    errorMsg: "A database error has occured.",
                });
            else setSubmitErrors({ error: false, errorMsg: "" });
        });

        return true;
    };

    return (
        <ThemeProvider theme={darkTheme}>
            {submitErrors.error === true && (
                <Stack sx={{ width: "100%", height: "20%", marginTop: 8 }} spacing={2}>
                    <Alert severity="error">
                        {submitErrors.errorMsg ? submitErrors.errorMsg : ""}
                    </Alert>
                </Stack>
            )}

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
                                                ...prevInputValues.email,
                                                value: e.target.value,
                                            },
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
                                    error={
                                        inputValues["username"]?.error
                                            ? inputValues["username"].error
                                            : false
                                    }
                                    helperText={
                                        inputValues["username"]?.errorMsg
                                            ? inputValues["username"].errorMsg
                                            : ""
                                    }
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues,
                                            username: {
                                                ...prevInputValues.username,
                                                value: e.target.value,
                                            },
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
                                    error={
                                        inputValues["password"]?.error
                                            ? inputValues["password"].error
                                            : false
                                    }
                                    helperText={
                                        inputValues["password"]?.errorMsg
                                            ? inputValues["password"].errorMsg
                                            : ""
                                    }
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues,
                                            password: {
                                                ...prevInputValues.password,
                                                value: e.target.value,
                                            },
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
                                    error={
                                        inputValues["newPassword"]?.error
                                            ? inputValues["newPassword"].error
                                            : false
                                    }
                                    helperText={
                                        inputValues["newPassword"]?.errorMsg
                                            ? inputValues["newPassword"].errorMsg
                                            : ""
                                    }
                                    onChange={(e) => {
                                        setInputValues((prevInputValues) => ({
                                            ...prevInputValues,
                                            newPassword: {
                                                ...prevInputValues.newPassword,
                                                value: e.target.value,
                                            },
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
                                                ...prevInputValues.fullname,
                                                value: e.target.value,
                                            },
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
                                            ...prevInputValues,
                                            address: {
                                                ...prevInputValues.address,
                                                value: e.target.value,
                                            },
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
                                                ...prevInputValues.phone,
                                                value: e.target.value,
                                            },
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
                                const validationPassed = validateForm();

                                if (validationPassed) {
                                    submitForm().then((status) => {
                                        if (status) navigate("/");
                                    });
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
};
