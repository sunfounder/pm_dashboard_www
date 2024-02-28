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
      main: red[500],
    },
    fan: {
      main: green[500],
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
      styleOverrides: `
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-track {
        background-color: rgb(60, 60, 60);
      }
      ::-webkit-scrollbar-thumb {
        background-color: #888;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
      `,
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
      main: red[600],
    },
    iconFg: {
      main: grey[200],
    },
    externalInput: {
      main: indigo[600],
    },
    fan: {
      main: green[600],
    },
    battery: {
      main: deepPurple[600],
    },
    raspberryPiPower: {
      main: pink[600],
    },
    storage: {
      main: lightGreen[600],
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
      styleOverrides: `
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background-color: rgb(240, 240, 240);
        }
        ::-webkit-scrollbar-thumb {
          background-color: #aaa;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #bbb;
        }
      `,
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='app'>
        <Home onModeChange={changeTheme} />
      </div>
    </ThemeProvider>
  );
}
export default App;