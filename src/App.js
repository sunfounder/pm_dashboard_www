import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Home from "./components/home";
import {
  green,
  indigo,
  deepPurple,
  amber,
  lightGreen,
  pink,
  blue,
  cyan,
  red,
  yellow,
  grey,
  lightBlue,
  orange,
  purple,
} from '@mui/material/colors';

import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    voltage: {
      main: lightGreen[500],
    },
    current: {
      main: indigo[500],
    },
    power: {
      main: yellow[500],
    },
    temperature: {
      main: green[500],
      cpu: red[500],
      gpu: orange[500],
      speed: blue[500],
    },
    iconFg: {
      main: grey[900],
    },
    externalInput: {
      main: indigo[600],
    },
    battery: {
      main: deepPurple[500],
    },
    raspberryPiPower: {
      main: pink[500],
    },
    storage: {
      main: lightGreen[500],
      mounted: [
        cyan[500],
        blue[500],
        lightGreen[500],
        lightBlue[500],
        green[500],
        amber[500],
        yellow[500],
        pink[500],
        purple[500],
        indigo[500],
        orange[500],
      ],
      notMounted: [
        cyan[100],
        blue[100],
        lightGreen[100],
        lightBlue[100],
        green[100],
        amber[100],
        yellow[100],
        pink[100],
        purple[100],
        indigo[100],
        orange[100],
      ],
    },
    memory: {
      main: cyan[500],
    },
    processor: {
      main: blue[500],
    },
    network: {
      main: amber[500],
      up: green[500],
      down: blue[500],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#ff0000",
            minHeight: 24,
            border: "3px solid #2b2b2b",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    voltage: {
      main: lightGreen[600],
    },
    current: {
      main: indigo[600],
    },
    power: {
      main: yellow[600],
    },
    temperature: {
      main: green[600],
      cpu: red[600],
      gpu: orange[600],
      speed: blue[600],
    },
    iconFg: {
      main: grey[200],
    },
    externalInput: {
      main: indigo[600],
    },
    battery: {
      main: deepPurple[600],
    },
    raspberryPiPower: {
      main: pink[600],
    },
    storage: {
      main: lightGreen[600],
      mounted: [
        cyan[600],
        blue[600],
        lightGreen[600],
        lightBlue[600],
        green[600],
        amber[600],
        yellow[600],
        pink[600],
        purple[600],
        indigo[600],
        orange[600],
      ],
      notMounted: [
        cyan[200],
        blue[200],
        lightGreen[200],
        lightBlue[200],
        green[200],
        amber[200],
        yellow[200],
        pink[200],
        purple[200],
        indigo[200],
        orange[200],
      ]
    },
    memory: {
      main: cyan[600],
    },
    processor: {
      main: blue[600],
    },
    network: {
      main: amber[600],
      up: green[600],
      down: blue[600],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#aaa #eee",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#eee",
            width: '2px',
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#eee",
            minHeight: 24,
            border: "3px solid #eee",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#959595",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#eee",
          },
        },
      },
    },
  },
});

const App = () => {
  const [theme, setTheme] = useState(null);

  const changeTheme = (themeName) => {
    if (themeName === 'dark')
      setTheme(darkTheme);
    else
      setTheme(lightTheme);
  };

  if (theme === null) {
    let _theme = window.localStorage.getItem("pm-dashboard-theme");
    if (_theme === null) _theme = "light"; // default theme
    changeTheme(_theme);
  }

  return (
    <ThemeProvider theme={theme || lightTheme}>
      <CssBaseline enableColorScheme />
      <div className='app'>
        <Home onModeChange={changeTheme} />
      </div>
    </ThemeProvider>
  );
}
export default App;