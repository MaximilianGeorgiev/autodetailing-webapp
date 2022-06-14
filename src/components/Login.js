
import { useState, useEffect } from 'react';

import { login } from "../api/user";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

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

import { Notification } from "./Notification";

import { getLoggedUserRoles, addRole } from "../api/user";
import { getRoleByName } from "../api/role";

import { clientHasLoginCookies } from "../utils/cookies";


export const Login = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['']);
    
    useEffect(() => {
        // logged in users shouldn't access login page
        const hasCookies = clientHasLoginCookies();

        if (hasCookies) navigate("/", {state: {"event": "loggedIn"}});
    }, []);

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const [inputValues, setInputValues] = useState({
        email: { value: "", error: false, errorMsg: "" },
        password: { value: "", error: false, errorMsg: "" }
    });

    const [submitError, setSubmitError] = useState({ error: false, message: "" });

    const processLoginForm = () => {
        let updatedState = { ...inputValues };

        if (!inputValues?.email?.value) updatedState.email = {
            value: updatedState.email.value,
            error: true,
            errorMsg: "Email field cannot be empty.",
        };
        if (!inputValues?.password?.value) updatedState.password = {
            value: updatedState.password.value,
            error: true,
            errorMsg: "Password field cannot be empty.",
        };

        // case: subsequent error requests but one of the fields is corrected
        if (inputValues?.email?.value) updatedState.email = {
            value: updatedState.email.value,
            error: false,
            errorMsg: "",
        };
        if (inputValues?.password?.value) updatedState.password = {
            value: updatedState.password.value,
            error: false,
            errorMsg: "",
        };

        if (inputValues?.email?.value && inputValues?.password?.value) {
            setSubmitError({ error: false, message: "" }); // remove old errors

            login(inputValues.email.value, inputValues.password.value).then((res) => {
                if (res.data.status === "failed") {
                    if (res.data.reason === "user not found") {
                        setSubmitError({ error: true, message: "No user was found with the provided credentials. Please try again." });
                    } else setSubmitError({ error: true, message: "The provided password is incorrect." });

                    return;
                } else if (res.data.status === "success") {
                    // set access token as a cookie (secure), httpOnly: only server can access cookie
                    // 15 minutes access token, 20 minutes refresh token
                    setCookie("accessToken", res.data.accessToken, { maxAge: 900, httpOnly: false });
                    setCookie("refreshToken", res.data.refreshToken, { maxAge: 1200, httpOnly: false });

                    setCookie("user_fullname", res.data.user[0].user_fullname);
                    setCookie("user_username", res.data.user[0].user_username);
                    setCookie("user_id", res.data.user[0].user_id);
                    setCookie("user_phone", res.data.user[0].user_phone ? res.data.user[0].user_phone : "");
                    setCookie("user_address", res.data.user[0].user_address ? res.data.user[0].user_address : "");

                    let roles = [];

                    getLoggedUserRoles(res.data.user[0].user_id).then((userRoles) => {
                        for (const role of userRoles.data.payload)
                            roles.push(role.role_name);

                        // if this is the user's first login (after registration) they will get an "end_user" role
                        // 1. Get the ID from the database
                        // 2. Assign it to the user
                        if (roles.length === 0) {
                            getRoleByName("End User").then((roleName) => {
                                if (roleName.data?.status === "failed") {
                                    setSubmitError({ error: true, message: "A database error has occured." });
                                    return;
                                } else {
                                    const roleId = roleName.data.payload[0].role_id;
                                    const payload = { user_id: res.data.user[0].user_id, role_id: roleId };

                                    addRole(payload).then((secondRoleRes) => {
                                        // Handle errors
                                        if (secondRoleRes.data?.status === "failed") {
                                            setSubmitError({ error: true, message: "A database error has occured." });
                                            return;
                                        }

                                        roles.push("End User"); // UserRole table is populated and we can assign it to the client side cookie
                                        setCookie("user_roles", roles);
                                    });
                                }
                            });
                        }
                    });

                    // redirect to home page with notification
                    navigate('/', { state: { "success": "true", "message": "Login successful.", "event": "loggedIn"} });
                }
            })
        }

        setInputValues(updatedState);
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
                        Sign in
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        {submitError.error &&
                            <Notification
                                severity="error"
                                message={submitError.message}
                                posX="center"
                                posY="bottom"
                            />}
                        <TextField
                            name="email"
                            type="email"
                            placeholder="sample@gmail.com"
                            label="Email"
                            margin="normal"
                            fullWidth
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
                        <TextField
                            name="password"
                            type="password"
                            placeholder="password"
                            label="Password"
                            fullWidth
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => processLoginForm()}
                        >
                            Sign In
                        </Button>

                        <Grid container justifyContent="flex-end">
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Box>
                </Box> 
            </Container>
        </ThemeProvider>
    );
};