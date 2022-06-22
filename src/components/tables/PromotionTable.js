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
import { getAllPromotions, deletePromotion } from "../../api/promotion";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { getProductById } from "../../api/product";
import { getServiceById } from "../../api/service";

export const PromotionTable = () => {
  const [promotions, setPromotions] = useState([]);
  const [entityTitles, setEntityTitles] = useState([]);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);

  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  useEffect(() => {
    getAllPromotions().then((res) => {
      if (res.data.status === "success") setPromotions(res.data.payload);

      let titles = [];

      // promotion only contains service_id/price_id but not the title, fetch it for better readability
      res.data.payload.forEach((promo) => {
        if (promo.product_id)
          getProductById(promo.product_id).then((productRes) =>
            titles.push({
              id: promo.product_id,
              title: productRes.data.payload[0].product_title,
            })
          );
        else if (promo.service_id)
          getServiceById(promo.service_id).then((serviceRes) =>
            titles.push({
              id: promo.product_id,
              title: serviceRes.data.payload[0].service_title,
            })
          );
      });

      setTimeout(() => {
        setEntityTitles(titles);
      }, 200);
    });
  }, []);

  const deleteButtonOnClick = () => {
    deletePromotion(selectedId).then((res) => {
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
              <TableCell>Promotion for</TableCell>
              <TableCell align="right">Start date</TableCell>
              <TableCell align="right">End date</TableCell>
              <TableCell align="right">Discounted price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow
                key={promotion.product_title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {entityTitles.map((entity) => {
                    if (
                      entity.id === promotion.product_id ||
                      entity.id === promotion.service_id
                    )
                      return entity.title;
                  })}
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(promotion.promotion_from).toLocaleDateString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {new Date(promotion.promotion_to).toLocaleDateString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                  {promotion.promotion_new_price}
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <ButtonGroup>
                    <Button
                      sx={{}}
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() =>
                        navigate(`/promotions/edit/${promotion.promotion_id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setSelectedId(promotion.promotion_id);
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