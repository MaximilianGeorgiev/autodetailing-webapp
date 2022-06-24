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
import { getAllUsers, deleteUser, getUserRoles } from "../../api/user";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { clientHasLoginCookies, getCookieByName } from "../../utils/cookies";

export const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(-1);

    const navigate = useNavigate();

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    useEffect(() => {
        // don't allow non logged in users to access this page
        const hasCookies = clientHasLoginCookies();
        if (!hasCookies) navigate("/", { state: { "event": "loggedOut" } });

        // don't permit non moderator and non admin users to access this page (redirect)
        const userRoles = getCookieByName("user_roles");
        if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
            navigate("/", { state: { "event": "loggedIn" } });
            return;
        }

        getAllUsers().then((res) => {
            if (res.data.status === "success") {
                let userRoles = [];

                res.data.payload.forEach((user) => {
                    getUserRoles(user.user_id).then((userRes) => {
                        userRoles.push({ userId: user.user_id, roles: userRes.data.payload });
                    });
                });

                setTimeout(() => {
                    setUserRoles(userRoles);
                    setUsers(res.data.payload);
                }, 500);
            }
        });
    }, []);

    const deleteButtonOnClick = () => {
        deleteUser(selectedId).then((res) => {
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
                            <TableCell>User №</TableCell>
                            <TableCell align="right">Username</TableCell>
                            <TableCell align="right">E-mail address</TableCell>
                            <TableCell align="right">Full name</TableCell>
                            <TableCell align="right">Phone</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.user_id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {user.user_id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {user.user_username}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {user.user_email}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {user.user_fullname}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {user.user_phone}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                                >
                                    {user.user_address}
                                </TableCell>
                                <TableCell align="right">
                                    {" "}
                                    <ButtonGroup sx={{ width: "100%" }}>
                                        <Button
                                            sx={{}}
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() =>
                                                navigate(`/users/edit/${user.user_id}`)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="error"
                                            variant="outlined"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => {
                                                setSelectedId(user.user_id);
                                                setShowConfirmationDialog(true);
                                            }}
                                        >
                                            Delete
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
