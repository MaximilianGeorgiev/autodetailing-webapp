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
import { getAllServices, deleteService } from "../../api/service";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import { useNavigate } from "react-router-dom";

export const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);

  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    getAllServices().then((res) => {
      if (res.data.status === "success") setServices(res.data.payload); // category_name is present
    });
  }, []);

  const deleteButtonOnClick = () => {
    deleteService(selectedId).then((res) => {
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
              <TableCell>Service name</TableCell>
              <TableCell align="right">Service price</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service.service_title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {service.service_title}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {service.service_price}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {service.service_description}
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <ButtonGroup sx={{ width: "100%" }}>
                    <Button
                      sx={{}}
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() =>
                        navigate(`/services/edit/${service.service_id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setSelectedId(service.service_id);
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
