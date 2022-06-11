import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useEffect, useState } from 'react';

import { useCookies } from "react-cookie";

import { useTheme } from '@mui/material/styles';

import { login } from "../api/user";
import { useNavigate } from "react-router-dom";

// dummy component used to force dark mode for this component
// useColorScheme must be used within a CssVarsProvider
const Mode = () => {
    const { mode, setMode } = useColorScheme();

    useEffect(() => {
        setMode('dark');
    }, []);
};

export const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

    const [emailValue, setEmailValue] = useState(null);
    const [passwordValue, setPasswordValue] = useState(null);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [submitError, setSubmitError] = useState({ error: false, message: "" });

    const processLoginForm = () => {
        if (!emailValue) setEmailError("Email field cannot be empty");
        if (!passwordValue) setPasswordError("Password field cannot be empty");

        // case: subsequent error requests but one of the fields is corrected
        if (emailValue) setEmailError("");
        if (passwordValue) setPasswordError("");

        if (emailValue && passwordValue) {
            login(emailValue, passwordValue).then((res) => {
                if (res.data.status === "failed") {
                    if (res.data.reason === "user not found") {
                        setSubmitError({ error: true, message: "No user was found with the provided credentials. Please try again." });
                    } else setSubmitError({ error: true, message: "Login failed." });

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

                    // redirect to home page
                    navigate('/');
                }
            })
        }
    };

    return (
        <CssVarsProvider>
            <Mode />
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 400,
                    mx: 'auto',
                    my: 4,
                    py: 3,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                }}>
                <Typography level="h4" component="h1">
                    <b>Welcome!</b>
                </Typography>

                {submitError.error === true && <Typography>{submitError.message}</Typography>}
                <TextField
                    name="email"
                    type="email"
                    placeholder="sample@gmail.com"
                    label="Email"
                    error={emailError}
                    helperText={emailError}
                    onChange={(e) => {
                        setEmailValue(e.target.value);
                        setEmailError("");
                    }}
                />
                <TextField
                    name="password"
                    type="password"
                    placeholder="password"
                    label="Password"
                    error={passwordError}
                    helperText={passwordError}
                    onChange={(e) => {
                        setPasswordValue(e.target.value);
                        setPasswordError("");
                    }}
                />
                <Button
                    sx={{
                        mt: 1,
                    }}
                    onClick={() => processLoginForm()}
                >
                    Log in
                </Button>
                <Typography
                    endDecorator={<Link href="/sign-up">Sign up</Link>}
                    fontSize="sm"
                    sx={{ alignSelf: 'center' }}>
                    Don't have an account?
                </Typography>
            </Sheet>
        </CssVarsProvider >
    );
};