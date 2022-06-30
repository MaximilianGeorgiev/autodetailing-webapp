import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

import {
    updateReservation,
    getReservationById,
} from "../../api/reservation";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

import { useParams } from "react-router";
import { useTranslation } from 'react-i18next';

export const EditReservation = (props) => {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const navigate = useNavigate();
    const { id } = useParams(); // query param from url
    const { t } = useTranslation();

    let userIsAdmin = false;

    const [inputValues, setInputValues] = useState({
        date: { value: "", error: false, errorMsg: "" },
    });

    useEffect(() => {
        // don't allow non logged in users to access this page
        const hasCookies = clientHasLoginCookies();
        if (!hasCookies) navigate("/home");

        const userRoles = getCookieByName("user_roles");

        // admins can edit all reservations
        if (userRoles.includes("Moderator") || userRoles.includes("Admin"))
            userIsAdmin = true;

        // prepopulate edit form
        getReservationById(id).then((res) => {
            if (res.data?.status === "failed") {
                navigate('/reservations');
                return;
            }

            const reservation = res.data?.payload[0];

            // end users can only edit their own
            if (reservation.user_id !== id && !userIsAdmin) {
                navigate("/home");
                return;
            }

            let updatedState = { ...inputValues };

            updatedState.date = {
                value: reservation.reservation_datetime,
                error: inputValues.date.error,
                errorMsg: inputValues.date.errorMsg,
            };

            setInputValues(updatedState);
        });
    }, []);

    const processReservationEditForm = () => {
        if (inputValues?.date?.value) {
            updateReservation(
                id,
                inputValues.date.value
            ).then((res) => {
                if (res.data?.status === "success")
                    navigate('/reservations', {
                        state: { success: "true", message: "Update successful." },
                    });
                else
                    navigate('/reservations', {
                        state: { success: "false", message: "Update failed." },
                    });
            });
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
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
                        <EditIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {t("Edit reservation")}
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <TextField
                            name="Date"
                            type="date"
                            placeholder="Date"
                            label={t("Date")}
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={
                                inputValues["date"]?.value ? inputValues["date"].value : ""
                            }
                            error={
                                inputValues["date"]?.error ? inputValues["date"].error : false
                            }
                            helperText={
                                inputValues["date"]?.errorMsg
                                    ? t(inputValues["date"].errorMsg)
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => processReservationEditForm()}
                        >
                            {t("Edit reservation")}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
