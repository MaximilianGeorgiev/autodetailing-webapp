import * as React from 'react';
import Typography from '@mui/material/Box';
import Box from '@mui/material/Typography';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';
import GoogleMapReact from 'google-map-react';
import Divider from '@mui/material/Divider';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

// accepted props: phone, address, email, ownerName
export const Contacts = (props) => {
    const defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    };

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const { t } = useTranslation();

    return (
        // Important! Always set the container height explicitly
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ width: '100%', marginTop: 12 }}>
                <Typography textAlign="center" variant="h1" component="h1" gutterBottom>
                    {t("Contacts")}
                </Typography>
                <Divider />
                <Typography textAlign="center" variant="h3" gutterBottom component="h4">{t("Address: ")}{props.address}</Typography>
                <Typography textAlign="center" variant="h3" gutterBottom component="h4">{t("Owner: ")}{props.ownerName}</Typography>
                <Typography textAlign="center" variant="h3" gutterBottom component="h4">{t("Phone number: ")}{props.phone}</Typography>
                <Typography textAlign="center" variant="h3" gutterBottom component="h4">{t("Email: ")}{props.email}</Typography>
                <Divider />
                <Typography textAlign="center" variant="h3" gutterBottom component="h4">{props.description}</Typography>
                <Divider />
                <Box mt={4} display="flex" justifyContent="center"
  alignItems="center">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.2361581657087!2d27.90668382065657!3d43.225508076216585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a455a21e9cd035%3A0xb4633644e73a1c03!2z0JDQstGC0L7RgdCw0LvQvtC9INCV0LLRgNC-0L_QsA!5e0!3m2!1sbg!2sbg!4v1656516326153!5m2!1sbg!2sbg" width="50%" height="450" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </Box>
            </Box>
        </ThemeProvider>
    );
}