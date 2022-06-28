import * as React from 'react';
import Typography from '@mui/material/Box';
import Box from '@mui/material/Typography';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';

export const NotFound = () => {
    const { t } = useTranslation();

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ width: '100%', marginTop: 15 }}>
                <Typography textAlign="center" variant="h1" component="h1" gutterBottom>
                    {t("An error has occured!")}
                </Typography>
                <Typography textAlign="center" variant="subtitle" gutterBottom component="div">{t("The URL is invalid.")}</Typography>
            </Box>
        </ThemeProvider>
    );
};