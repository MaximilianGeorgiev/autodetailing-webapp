import logo from "./logo.svg";
import React from 'react';
import "./App.css";
import { NavBar } from "./components/NavBar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useLocation } from "react-router-dom";
import { Notification } from "./components/Notification";

export const App = () => {
  /* Sometimes on redirects from other pages back here they provide a some sort of notification.
  Via the useLocation react-router hook information sent from the previous page can be accessed */
  const location = useLocation();

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
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
