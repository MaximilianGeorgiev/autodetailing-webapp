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
import { useTranslation } from "react-i18next";
import { getProductById } from "../../api/product";
import { getServiceById } from "../../api/service";
import { clientHasLoginCookies, getCookieByName } from "../../utils/cookies";

export const PromotionTable = () => {
  const [promotions, setPromotions] = useState([]);
  const [entityTitles, setEntityTitles] = useState([]);

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
      navigate("/");
      return;
    }

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
              <TableCell>{t("Promotion for")}</TableCell>
              <TableCell align="right">{t("Start date")}</TableCell>
              <TableCell align="right">{t("End date")}</TableCell>
              <TableCell align="right">{t("Discounted price")}</TableCell>
              <TableCell align="center">{t("Actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow
                key={promotion.product_title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  onClick={() =>
                    navigate(`/promotions/show/${promotion.promotion_id}`)
                  }
                >
                  {entityTitles.map((entity) => {
                    if (
                      entity.id === promotion.product_id ||
                      entity.id === promotion.service_id
                    )
                      return entity.title;
                  })}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  onClick={() =>
                    navigate(`/promotions/show/${promotion.promotion_id}`)
                  }
                >
                  {new Date(promotion.promotion_from).toLocaleDateString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  onClick={() =>
                    navigate(`/promotions/show/${promotion.promotion_id}`)
                  }
                >
                  {new Date(promotion.promotion_to).toLocaleDateString()}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  onClick={() =>
                    navigate(`/promotions/show/${promotion.promotion_id}`)
                  }
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
                      {t("Edit")}
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
