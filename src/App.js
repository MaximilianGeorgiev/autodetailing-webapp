import logo from "./logo.svg";
import React from 'react';
import "./App.css";
import { NavBar } from "./components/NavBar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useLocation } from "react-router-dom";
import { Notification } from "./components/Notification";
import { EntityCards } from "./components/custom/EntityCards";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const App = () => {
  /* Sometimes on redirects from other pages back here they provide a some sort of notification.
  Via the useLocation react-router hook information sent from the previous page can be accessed */
  const location = useLocation();

  const Item = styled(EntityCards)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <div className="App">
        <NavBar />
      </div>

      {location.state?.success === "true" && <Notification
        severity="success"
        message={location.state?.message}
        posX="center"
        posY="bottom"
      />}
    </ThemeProvider>
  );
};
