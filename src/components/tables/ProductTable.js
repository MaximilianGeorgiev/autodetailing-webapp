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
import { getAllProducts, deleteProduct } from "../../api/product";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clientHasLoginCookies, getCookieByName } from "../../utils/cookies";

export const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
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
    if (!hasCookies) navigate("/", { state: { event: "loggedOut" } });

    // don't permit non moderator and non admin users to access this page (redirect)
    const userRoles = getCookieByName("user_roles");
    if (!userRoles.includes("Moderator") && !userRoles.includes("Admin")) {
      navigate("/", { state: { event: "loggedIn" } });
      return;
    }

    getAllProducts().then((res) => {
      if (res.data.status === "success") setProducts(res.data.payload); // category_name is present
    });
  }, []);

  const deleteButtonOnClick = () => {
    deleteProduct(selectedId).then((res) => {
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
              <TableCell>{t("Product name")}</TableCell>
              <TableCell align="right">{t("Product price")}</TableCell>
              <TableCell align="right">{t("Description")}</TableCell>
              <TableCell align="right">{t("Category")}</TableCell>
              <TableCell align="center">{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.product_title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  onClick={() =>
                    navigate(`/products/show/${product.product_id}`)
                  }
                >
                  {product.product_title}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  onClick={() =>
                    navigate(`/products/show/${product.product_id}`)
                  }
                >
                  {product.product_price}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  onClick={() =>
                    navigate(`/products/show/${product.product_id}`)
                  }
                >
                  {product.product_description}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  onClick={() =>
                    navigate(`/products/show/${product.product_id}`)
                  }
                >
                  {product.category_name}
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <ButtonGroup sx={{ width: "100%" }}>
                    <Button
                      sx={{}}
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() =>
                        navigate(`/products/edit/${product.product_id}`)
                      }
                    >
                      {t("Edit")}
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setSelectedId(product.product_id);
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
