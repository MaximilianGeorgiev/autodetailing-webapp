import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState, useEffect } from "react";
import { getAllReservations, deleteReservation } from "../../api/reservation";
import { getUserById } from "../../api/user";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clientHasLoginCookies, getCookieByName } from "../../utils/cookies";

export const ReservationTable = () => {
    const [reservations, setReservations] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [customerInfo, setCustomerInfo] = useState([]);
    const [selectedId, setSelectedId] = useState(-1);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    useEffect(() => {
        // don't allow non logged in users to access this page
        const hasCookies = clientHasLoginCookies();
        if (!hasCookies) navigate("/home");

        // don't permit non moderator and non admin users to access this page (redirect)
        const userRoles = getCookieByName("user_roles");
        if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
            navigate("/home");
            return;
        }

        getAllReservations().then((res) => {
            if (res.data.status === "success") {
                let customerInfo = [];

                res.data.payload.forEach((reservation) => {
                    getUserById(reservation.user_id).then((userRes) => {
                        customerInfo.push(userRes.data.payload[0]);
                    });
                });

                setTimeout(() => {
                    setCustomerInfo(customerInfo);
                    setReservations(res.data.payload);
                }, 500);
            }
        });
    }, []);

    const deleteButtonOnClick = () => {
        deleteReservation(selectedId).then((res) => {
            navigate(0);
            setShowConfirmationDialog(false);
        });
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <TableContainer component={Card} sx={{ maxWidth: "85%", m: 12.5 }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("Reservation №")}</TableCell>
                            <TableCell align="right">{t("Reservation date")}</TableCell>
                            <TableCell align="right">{t("Reservation price")}</TableCell>
                            <TableCell align="right">{t("Customer name")}</TableCell>
                            <TableCell align="right">{t("Customer phone")}</TableCell>
                            <TableCell align="center">{t("Actions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((reservation) => (
                            <TableRow
                                key={reservation.reservation_id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {reservation.reservation_id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {new Date(reservation.reservation_datetime).toLocaleDateString()}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {reservation.reservation_totalprice + " BGN"}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {customerInfo.filter((c) => c.user_id === reservation.user_id)[0].user_fullname}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {customerInfo.filter((c) => c.user_id === reservation.user_id)[0].user_phone}
                                </TableCell>
                                <TableCell align="right">
                                    {" "}
                                    <ButtonGroup sx={{ width: "100%" }}>
                                        <Button
                                            sx={{}}
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() =>
                                                navigate(`/reservations/edit/${reservation.reservation_id}`)
                                            }
                                        >
                                            {t("Edit")}
                                        </Button>
                                        <Button
                                            color="error"
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => {
                                                setSelectedId(reservation.reservation_id);
                                                setShowConfirmationDialog(true);
                                            }}
                                        >
                                            {t("Delete")}
                                        </Button>
                                    </ButtonGroup>
                                    {showConfirmationDialog && (
                                        <ConfirmationDialog
                                            handleClose={() => setShowConfirmationDialog(false)}
                                            handleConfirm={deleteButtonOnClick}
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    );
};
