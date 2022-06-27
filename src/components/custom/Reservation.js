import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useState, useEffect } from "react";
import { getUserById, updateUser, register } from "../../api/user";
import { getCookieByName, clientHasLoginCookies } from "../../utils/cookies";
import { validatePhone, validateEmail } from "../../utils/validator";
import {
  addServiceToReservation,
  createReservation,
} from "../../api/reservation";
import { getPromotionByServiceId } from "../../api/promotion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
Current implementation:
1. If the user is logged in the form is prepopulated with their information
2. If not the user will have to input them manually and then a user with the provided info will be saved in the
database for reference (username and password will be mocked)
3. If the user is logged in but has no phone number (since it is not mandatory) the user will be prompted to input one
4. The user profile will then be updated and the reservation successfully made.
*/
export const Reservation = (props) => {
  const [open, setOpen] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [inputValues, setInputValues] = useState({
    date: { value: null, error: false, errorMsg: "" },
    email: { value: "", error: false, errorMsg: "" },
    fullname: { value: "", error: false, errorMsg: "" },
    phone: { value: "", error: false, errorMsg: "" },
  });

  useEffect(() => {
    // prepopulate form if user is logged in
    const hasCookies = clientHasLoginCookies();
    const userId = getCookieByName("user_id");

    if (hasCookies && userId !== "undefined") {
      getUserById(userId).then((res) => {
        const user = res.data?.payload[0];
        let updatedState = { ...inputValues };

        updatedState.email = {
          value: user.user_email,
          error: inputValues.email.error,
          errorMsg: inputValues.email.errorMsg,
        };

        updatedState.fullname = {
          value: user.user_fullname,
          error: inputValues.fullname.error,
          errorMsg: inputValues.fullname.errorMsg,
        };

        if (user.user_phone) {
          updatedState.phone = {
            value: user.user_phone,
            error: inputValues.phone.error,
            errorMsg: inputValues.phone.errorMsg,
          };
        }

        setInputValues(updatedState);
        setUserLoggedIn(true);
      });
    }
  }, []);

  const handleClose = () => {
    setOpen(false);

    if (props.handleClose) props.handleClose();
  };

  const processReservation = () => {
    let updatedState = { ...inputValues };

    if (!inputValues?.date?.value)
      updatedState.date = {
        value: updatedState.date.value,
        error: true,
        errorMsg: "Appointment date cannot be empty.",
      };

    if (!inputValues?.phone?.value)
      updatedState.phone = {
        value: updatedState.phone.value,
        error: true,
        errorMsg: "A phone number is required.",
      };

    if (!inputValues?.email?.value)
      updatedState.email = {
        value: updatedState.email.value,
        error: true,
        errorMsg: "An E-mail address is required.",
      };

    if (!inputValues?.fullname?.value)
      updatedState.fullname = {
        value: updatedState.fullname.value,
        error: true,
        errorMsg: "Full name is required.",
      };

    // case: subsequent error requests but one of the fields is corrected
    if (inputValues?.date?.value)
      updatedState.date = {
        value: updatedState.date.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.fullname?.value)
      updatedState.fullname = {
        value: updatedState.fullname.value,
        error: false,
        errorMsg: "",
      };

    if (inputValues?.phone?.value) {
      if (validatePhone(updatedState.phone.value))
        updatedState.phone = {
          value: updatedState.phone.value,
          error: false,
          errorMsg: "",
        };
      else
        updatedState.phone = {
          value: updatedState.phone.value,
          error: true,
          errorMsg: "The provided phone number is invalid.",
        };
    }

    if (inputValues?.email?.value) {
      if (validateEmail(updatedState.email.value))
        updatedState.email = {
          value: updatedState.email.value,
          error: false,
          errorMsg: "",
        };
      else
        updatedState.email = {
          value: updatedState.email.value,
          error: true,
          errorMsg: "The provided E-mail address is invalid.",
        };
    }

    if (
      inputValues?.email.value &&
      inputValues?.fullname.value &&
      inputValues?.phone.value &&
      validatePhone(updatedState.phone.value) &&
      props.service
    ) {
      // 1. Check if this service has an ongoing promotion and if so set the "totalPrice" to the new price of the promotion
      let totalPrice = 0;

      getPromotionByServiceId(props.service.service_id).then((res) => {
        if (res.data?.status === "success") {
          // no promotions for this service
          if (res.data.payload.length === 0)
            totalPrice = props.service.service_price;
          else {
            for (let i = 0; i < res.data.payload.length; i++) {
              const promotionTo = new Date(res.data.payload[i].promotion_to);

              const promotionFrom = new Date(
                res.data.payload[i].promotion_from
              );

              const now = new Date();

              if (now >= promotionFrom && now <= promotionTo) {
                totalPrice = res.data.payload[i].promotion_new_price;
                break;
              }

              // promotions are expired, set the standard price for a service
              if (i === res.data.payload.length - 1)
                totalPrice = props.service.service_price;
            }
          }

          let userId = getCookieByName("user_id");

          // If there is no user we need to create it (for reference) and use the new user id
          // users that have isGuest boolean will not be able to login since they did not consent to a registration
          // they are for reference only and we need their id
          if (userId === "" || userId === "undefined") {
            const payload = {
              email: inputValues.email.value,
              username: "guest",
              password: "foobar",
              fullname: inputValues.fullname.value,
              isGuest: true,
              phone: inputValues.phone.value,
            };

            register(payload).then((res) => {
              userId = res.data.user[0].user_id;
            });
          }

          // await registration if needed
          setTimeout(() => {
            if (userId !== "") {
              // 2. Create the reservation
              createReservation(
                userId,
                inputValues.date.value,
                false,
                totalPrice
              ).then((reservationRes) => {
                if (reservationRes.data?.status === "success") {
                  // 3. Since the db design allows for multiple services in one reservation (not implemented in webapp), we need to manually add the service to the newly created reservation
                  const reservationId =
                    reservationRes.data.reservation.reservation_id;

                  addServiceToReservation(
                    reservationId,
                    props.service.service_id
                  ).then((serviceRes) => {
                    if (serviceRes.data?.status === "success") {
                      // 4. If the user had no phone number associated (its not mandatory) then update the user profile with the provided phone number
                      // only if user was logged in and not newly registered
                      const hasCookies = clientHasLoginCookies();

                      if (
                        (getCookieByName("user_phone") === "undefined" ||
                          getCookieByName("user_phone") === "") &&
                        hasCookies
                      ) {
                        const payload = {
                          updateData: { user_phone: inputValues.phone.value },
                        };

                        updateUser(getCookieByName("user_id"), payload);
                      }

                      if (serviceRes.data?.status === "success") {
                        navigate("/reservations", {
                          state: {
                            success: "true",
                            message: "Reservation created successfully.",
                          },
                        });
                      }
                    }
                  });
                }
              });
            }
          }, 800);
        }
      });
    }

    setInputValues(updatedState);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align="center">{t("Make an appointment")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              "In order to book an appointment for this service you will have to verify the following information:"
            )}
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t("Email Address")}
            type="email"
            variant="standard"
            disabled={userLoggedIn}
            sx={{ marginRight: 25 }}
            value={inputValues["email"].value}
            error={
              inputValues["email"]?.error ? inputValues["email"].error : false
            }
            helperText={
              inputValues["email"]?.errorMsg
                ? t(inputValues["email"].errorMsg)
                : ""
            }
            onChange={(e) => {
              setInputValues((prevInputValues) => ({
                ...prevInputValues,
                email: {
                  value: e.target.value,
                },
              }));
            }}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t("Full name")}
            disabled={userLoggedIn}
            type="email"
            variant="standard"
            sx={{ marginRight: 25 }}
            value={inputValues["fullname"].value}
            error={
              inputValues["fullname"]?.error
                ? inputValues["fullname"].error
                : false
            }
            helperText={
              inputValues["fullname"]?.errorMsg
                ? t(inputValues["fullname"].errorMsg)
                : ""
            }
            onChange={(e) => {
              setInputValues((prevInputValues) => ({
                ...prevInputValues,
                fullname: {
                  value: e.target.value,
                },
              }));
            }}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t("Phone number")}
            type="email"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginRight: 25 }}
            value={inputValues["phone"].value}
            error={
              inputValues["phone"]?.error ? inputValues["phone"].error : false
            }
            helperText={
              inputValues["phone"]?.errorMsg
                ? t(inputValues["phone"].errorMsg)
                : ""
            }
            onChange={(e) => {
              setInputValues((prevInputValues) => ({
                ...prevInputValues,
                phone: {
                  value: e.target.value,
                },
              }));
            }}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label={t("Appointment date")}
            type="date"
            variant="standard"
            sx={{ marginRight: 25 }}
            InputLabelProps={{
              shrink: true,
            }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("Cancel")}</Button>
          <Button onClick={() => processReservation()}>{t("Confirm")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
