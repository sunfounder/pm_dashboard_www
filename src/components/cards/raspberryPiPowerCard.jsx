import React from 'react';
import Card from './card.jsx';
import Chart from './chart.jsx';
import {
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const POWER_SOURCE = [
  "External",
  "Battery",
]

const SWITCH_COMMAND = {
  POWER_OFF: 0,
  SHUTDOWN: 1,
  POWER_ON: 2,
}

const SWITCH_STATE = {
  OFF: 0,
  ON: 1,
  SHUTTING_DOWN: 2,
}

const RaspberryPiPowerCard = (props) => {
  const theme = useTheme();

  const detail = {
    voltage: {
      title: "Voltage",
      unit: "V",
      color: theme.palette.voltage.main,
    },
    current: {
      title: "Current",
      unit: "A",
      color: theme.palette.current.main,
    },
    power: {
      title: "Power",
      unit: "W",
      color: theme.palette.power.main,
    },
    source: {
      title: "Source",
      unit: "",
    },
  };
  // 处理显示警告信息
  if (props.data.length > 0) {
    let localStorageData = JSON.parse(localStorage.getItem("pm-dashboard-banner"));
    let lastData = JSON.parse(localStorage.getItem("pm-dashboard-bannerLastData"));
    if (props.data[0].power_source === 1 && !localStorageData && lastData == null) {
      props.showBanner("warning", "Running on battery🔋");
    }
    if (props.data[0].power_source === 0) {
      localStorage.removeItem("pm-dashboard-bannerLastData");
    }
  }
  let newData = props.data.map(obj => {
    let tmp = {
      timestamp: timeFormatting(obj.time),
    }
    if ('power_source' in obj) {
      tmp.source = POWER_SOURCE[obj.power_source];
    }
    if ('output_voltage' in obj || 'raspberry_pi_voltage' in obj) {
      tmp.voltage = (obj.output_voltage || obj.raspberry_pi_voltage) / 1000;
    }
    if ('raspberry_pi_current' in obj || 'output_current' in obj) {
      tmp.current = (obj.raspberry_pi_current || obj.output_current) / 1000;
      tmp.power = tmp.voltage * tmp.current;
    }
    return tmp;
  })
  let chartData = newData.map(({ source, ...rest }) => rest);
  return (
    <Card
      color="raspberryPiPower"
      title="Raspberry Pi Power"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.raspberryPiPower.main}
      chart={<Chart detail={detail} data={chartData} min={0} max={27} />}
      icon={<RPiIconWithLighting />}
      config={props.peripherals.includes("output_switch") &&
        <div className='cardConfig'>
          <PowerMenu
            outputState={props.data.length > 0 ? props.data[props.data.length - 1].output_state : SWITCH_STATE.OFF}
            showAlert={props.showAlert}
            sendData={props.sendData}
          />
        </div >}
    />
  )
}

const PowerMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  let shuttingDown = false;
  let enable = false;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePowerOff = () => {
    props.showAlert(
      "Power off",
      "Do you want to power off the Raspberry Pi? This will cut off the power immediately! And may cause data loss.",
      () => props.sendData("set-output", { switch: SWITCH_COMMAND.POWER_OFF })
    );
  }
  const handleShutdown = () => {
    props.showAlert(
      "Shutdown",
      "Do you want to shutdown the Raspberry Pi? This may take a few minutes",
      () => props.sendData("set-output", { switch: SWITCH_COMMAND.SHUTDOWN })
    )
  }
  const handlePowerOn = () => {
    props.showAlert(
      "Power on",
      "Do you want to power on the Raspberry Pi?",
      () => props.sendData("set-output", { switch: SWITCH_COMMAND.POWER_ON })
    );
  }

  if (props.outputState === SWITCH_STATE.OFF) {
    enable = false;
    shuttingDown = false;
  } else if (props.outputState === SWITCH_STATE.ON) {
    enable = true;
    shuttingDown = false;
  } else if (props.outputState === SWITCH_STATE.SHUTTING_DOWN) {
    enable = true;
    shuttingDown = true;
  }
  return <>
    <Button
      id="basic-button"
      variant="outlined"
      startIcon={<PowerSettingsNewIcon />}
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleMenuClick}
    >
      Power
    </Button>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handlePowerOn} disabled={enable}>
        <ListItemIcon>
          <PowerSettingsNewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Power On</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleShutdown} disabled={!enable || shuttingDown}>
        <ListItemIcon>
          {shuttingDown ?
            <CircularProgress color="inherit" size={20} /> :
            <PowerSettingsNewIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText>Shutdown</ListItemText>
      </MenuItem>
      <MenuItem onClick={handlePowerOff} disabled={!enable}>
        <ListItemIcon>
          <PowerOffIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Power Off</ListItemText>
      </MenuItem>
    </Menu>
  </>
}

const RPiIconWithLighting = () => {
  const theme = useTheme();
  return <Box>
    <Box sx={{ display: "flex" }}>
      <svg xmlns="http://www.w3.org/2000/svg" height="2.8rem" viewBox="0 0 407 512" fill={theme.palette.iconFg.main}><path d="M372 232.5l-3.7-6.5c.1-46.4-21.4-65.3-46.5-79.7 7.6-2 15.4-3.6 17.6-13.2 13.1-3.3 15.8-9.4 17.1-15.8 3.4-2.3 14.8-8.7 13.6-19.7 6.4-4.4 10-10.1 8.1-18.1 6.9-7.5 8.7-13.7 5.8-19.4 8.3-10.3 4.6-15.6 1.1-20.9 6.2-11.2 .7-23.2-16.6-21.2-6.9-10.1-21.9-7.8-24.2-7.8-2.6-3.2-6-6-16.5-4.7-6.8-6.1-14.4-5-22.3-2.1-9.3-7.3-15.5-1.4-22.6 .8C271.6 .6 269 5.5 263.5 7.6c-12.3-2.6-16.1 3-22 8.9l-6.9-.1c-18.6 10.8-27.8 32.8-31.1 44.1-3.3-11.3-12.5-33.3-31.1-44.1l-6.9 .1c-5.9-5.9-9.7-11.5-22-8.9-5.6-2-8.1-7-19.4-3.4-4.6-1.4-8.9-4.4-13.9-4.3-2.6 .1-5.5 1-8.7 3.5-7.9-3-15.5-4-22.3 2.1-10.5-1.3-14 1.4-16.5 4.7-2.3 0-17.3-2.3-24.2 7.8C21.2 16 15.8 28 22 39.2c-3.5 5.4-7.2 10.7 1.1 20.9-2.9 5.7-1.1 11.9 5.8 19.4-1.8 8 1.8 13.7 8.1 18.1-1.2 11 10.2 17.4 13.6 19.7 1.3 6.4 4 12.4 17.1 15.8 2.2 9.5 10 11.2 17.6 13.2-25.1 14.4-46.6 33.3-46.5 79.7l-3.7 6.5c-28.8 17.2-54.7 72.7-14.2 117.7 2.6 14.1 7.1 24.2 11 35.4 5.9 45.2 44.5 66.3 54.6 68.8 14.9 11.2 30.8 21.8 52.2 29.2C159 504.2 181 512 203 512h1c22.1 0 44-7.8 64.2-28.4 21.5-7.4 37.3-18 52.2-29.2 10.2-2.5 48.7-23.6 54.6-68.8 3.9-11.2 8.4-21.3 11-35.4 40.6-45.1 14.7-100.5-14-117.7zm-22.2-8c-1.5 18.7-98.9-65.1-82.1-67.9 45.7-7.5 83.6 19.2 82.1 67.9zm-43 93.1c-24.5 15.8-59.8 5.6-78.8-22.8s-14.6-64.2 9.9-80c24.5-15.8 59.8-5.6 78.8 22.8s14.6 64.2-9.9 80zM238.9 29.3c.8 4.2 1.8 6.8 2.9 7.6 5.4-5.8 9.8-11.7 16.8-17.3 0 3.3-1.7 6.8 2.5 9.4 3.7-5 8.8-9.5 15.5-13.3-3.2 5.6-.6 7.3 1.2 9.6 5.1-4.4 10-8.8 19.4-12.3-2.6 3.1-6.2 6.2-2.4 9.8 5.3-3.3 10.6-6.6 23.1-8.9-2.8 3.1-8.7 6.3-5.1 9.4 6.6-2.5 14-4.4 22.1-5.4-3.9 3.2-7.1 6.3-3.9 8.8 7.1-2.2 16.9-5.1 26.4-2.6l-6 6.1c-.7 .8 14.1 .6 23.9 .8-3.6 5-7.2 9.7-9.3 18.2 1 1 5.8 .4 10.4 0-4.7 9.9-12.8 12.3-14.7 16.6 2.9 2.2 6.8 1.6 11.2 .1-3.4 6.9-10.4 11.7-16 17.3 1.4 1 3.9 1.6 9.7 .9-5.2 5.5-11.4 10.5-18.8 15 1.3 1.5 5.8 1.5 10 1.6-6.7 6.5-15.3 9.9-23.4 14.2 4 2.7 6.9 2.1 10 2.1-5.7 4.7-15.4 7.1-24.4 10 1.7 2.7 3.4 3.4 7.1 4.1-9.5 5.3-23.2 2.9-27 5.6 .9 2.7 3.6 4.4 6.7 5.8-15.4 .9-57.3-.6-65.4-32.3 15.7-17.3 44.4-37.5 93.7-62.6-38.4 12.8-73 30-102 53.5-34.3-15.9-10.8-55.9 5.8-71.8zm-34.4 114.6c24.2-.3 54.1 17.8 54 34.7-.1 15-21 27.1-53.8 26.9-32.1-.4-53.7-15.2-53.6-29.8 0-11.9 26.2-32.5 53.4-31.8zm-123-12.8c3.7-.7 5.4-1.5 7.1-4.1-9-2.8-18.7-5.3-24.4-10 3.1 0 6 .7 10-2.1-8.1-4.3-16.7-7.7-23.4-14.2 4.2-.1 8.7 0 10-1.6-7.4-4.5-13.6-9.5-18.8-15 5.8 .7 8.3 .1 9.7-.9-5.6-5.6-12.7-10.4-16-17.3 4.3 1.5 8.3 2 11.2-.1-1.9-4.2-10-6.7-14.7-16.6 4.6 .4 9.4 1 10.4 0-2.1-8.5-5.8-13.3-9.3-18.2 9.8-.1 24.6 0 23.9-.8l-6-6.1c9.5-2.5 19.3 .4 26.4 2.6 3.2-2.5-.1-5.6-3.9-8.8 8.1 1.1 15.4 2.9 22.1 5.4 3.5-3.1-2.3-6.3-5.1-9.4 12.5 2.3 17.8 5.6 23.1 8.9 3.8-3.6 .2-6.7-2.4-9.8 9.4 3.4 14.3 7.9 19.4 12.3 1.7-2.3 4.4-4 1.2-9.6 6.7 3.8 11.8 8.3 15.5 13.3 4.1-2.6 2.5-6.2 2.5-9.4 7 5.6 11.4 11.5 16.8 17.3 1.1-.8 2-3.4 2.9-7.6 16.6 15.9 40.1 55.9 6 71.8-29-23.5-63.6-40.7-102-53.5 49.3 25 78 45.3 93.7 62.6-8 31.8-50 33.2-65.4 32.3 3.1-1.4 5.8-3.2 6.7-5.8-4-2.8-17.6-.4-27.2-5.6zm60.1 24.1c16.8 2.8-80.6 86.5-82.1 67.9-1.5-48.7 36.5-75.5 82.1-67.9zM38.2 342c-23.7-18.8-31.3-73.7 12.6-98.3 26.5-7 9 107.8-12.6 98.3zm91 98.2c-13.3 7.9-45.8 4.7-68.8-27.9-15.5-27.4-13.5-55.2-2.6-63.4 16.3-9.8 41.5 3.4 60.9 25.6 16.9 20 24.6 55.3 10.5 65.7zm-26.4-119.7c-24.5-15.8-28.9-51.6-9.9-80s54.3-38.6 78.8-22.8 28.9 51.6 9.9 80c-19.1 28.4-54.4 38.6-78.8 22.8zM205 496c-29.4 1.2-58.2-23.7-57.8-32.3-.4-12.7 35.8-22.6 59.3-22 23.7-1 55.6 7.5 55.7 18.9 .5 11-28.8 35.9-57.2 35.4zm58.9-124.9c.2 29.7-26.2 53.8-58.8 54-32.6 .2-59.2-23.8-59.4-53.4v-.6c-.2-29.7 26.2-53.8 58.8-54 32.6-.2 59.2 23.8 59.4 53.4v.6zm82.2 42.7c-25.3 34.6-59.6 35.9-72.3 26.3-13.3-12.4-3.2-50.9 15.1-72 20.9-23.3 43.3-38.5 58.9-26.6 10.5 10.3 16.7 49.1-1.7 72.3zm22.9-73.2c-21.5 9.4-39-105.3-12.6-98.3 43.9 24.7 36.3 79.6 12.6 98.3z" /></svg>
      <Box
        sx={{
          position: "absolute",
          bottom: "27%",
          right: "30%",
          borderRadius: "50%",
          bgcolor: theme.palette.raspberryPiPower.main,
          border: `2px solid ${theme.palette.iconFg.main}`,
          width: "20px",
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="0.8rem" viewBox="0 0 448 512" fill={theme.palette.iconFg.main}><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z" /></svg>
      </Box>
    </Box>
  </Box >
}


export default RaspberryPiPowerCard;