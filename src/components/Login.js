import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useEffect, useState } from 'react';

import { login } from "../api/user";

// dummy component used to force dark mode for this component
// useColorScheme must be used within a CssVarsProvider
const Mode = () => {
    const { mode, setMode } = useColorScheme();

    useEffect(() => {
        setMode('dark');
    }, []);
};

export const Login = () => {
    const [emailValue, setEmailValue] = useState(null);
    const [passwordValue, setPasswordValue] = useState(null);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

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
                <TextField
                    name="email"
                    type="email"
                    placeholder="sample@gmail.com"
                    label="Email"
                    error={emailError}
                    helperText={emailError}
                    onChange={(e) => setEmailValue(e.target.value)}
                />
                <TextField
                    name="password"
                    type="password"
                    placeholder="password"
                    label="Password"
                    error={passwordError}
                    helperText={passwordError}
                    onChange={(e) => setPasswordValue(e.target.value)}
                />
                <Button
                    sx={{
                        mt: 1,
                    }}
                    onClick={() => {
                        if (!emailValue) setEmailError("Email field cannot be empty");
                        if (!passwordValue) setPasswordError("Password field cannot be empty");

                        // case: subsequent error requests but one of the fields is corrected
                        if (emailValue) setEmailError("");
                        if (passwordValue) setPasswordValue("");

                        if (emailValue && passwordValue) {
                            login(emailValue, passwordValue).then((res) => {console.log("pederme" + res.data.response)})
                        }
                    }}
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
        </CssVarsProvider>
    );
};