import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import { useEffect } from 'react';

// dummy component used to force dark mode for this component
// useColorScheme must be used within a CssVarsProvider
const Mode = () => {
    const { mode, setMode } = useColorScheme();

    useEffect(() => {
        setMode('dark');
    }, []);
};

export const Login = () => {
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
                    placeholder="johndoe@email.com"
                    label="Email"
                />
                <TextField
                    name="password"
                    type="password"
                    placeholder="password"
                    label="Password"
                />
                <Button
                    sx={{
                        mt: 1,
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