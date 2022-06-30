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
    updateOrder,
    getOrderById,
} from "../../api/order";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";

import { useParams } from "react-router";
import { useTranslation } from 'react-i18next';

export const EditOrder = (props) => {
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
        address: { value: "", error: false, errorMsg: "" },
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
        getOrderById(id).then((res) => {
            if (res.data?.status === "failed") {
                navigate('/orders');
                return;
            }

            const order = res.data?.payload[0];

            // end users can only edit their own
            if (order.customer_id !== parseInt(getCookieByName("user_id")) && !userIsAdmin) {
                navigate("/home");
                return;
            }

            let updatedState = { ...inputValues };

            updatedState.address = {
                value: order.order_address,
                error: inputValues.address.error,
                errorMsg: inputValues.address.errorMsg,
            };

            setInputValues(updatedState);
        });
    }, []);

    const processOrderEditForm = () => {
        if (!inputValues?.address.value) {
            let updatedState = { ...inputValues };

            updatedState.address = {
                value: updatedState.address.value,
                error: true,
                errorMsg: "Address cannot be empty.",
            };

            setInputValues(updatedState);
            return;
        }

        if (inputValues?.address?.value) {
            updateOrder(
                id,
                inputValues.address.value
            ).then((res) => {
                if (res.data?.status === "success")
                    navigate('/orders', {
                        state: { success: "true", message: "Update successful." },
                    });
                else
                    navigate('/orders', {
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
                        {t("Edit order")}
                    </Typography>
                    <Box noValidate sx={{ mt: 1 }}>
                        <TextField
                            name="Address"
                            type="text"
                            label={t("Address")}
                            margin="normal"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={
                                inputValues["address"]?.value ? inputValues["address"].value : ""
                            }
                            error={
                                inputValues["address"]?.error ? inputValues["address"].error : false
                            }
                            helperText={
                                inputValues["address"]?.errorMsg
                                    ? t(inputValues["address"].errorMsg)
                                    : ""
                            }
                            onChange={(e) => {
                                setInputValues((prevInputValues) => ({
                                    ...prevInputValues,
                                    address: {
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
                            onClick={() => processOrderEditForm()}
                        >
                            {t("Edit order")}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};
