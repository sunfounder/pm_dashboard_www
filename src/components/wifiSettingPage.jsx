import React, { useState, useEffect } from 'react';
import "./settingPage.css";
import {
  Paper,
  CardHeader,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Modal,
  Button,
  Stack,
  InputAdornment,
  Box,
  TextField,
  Switch,
  Input,
  IconButton,
  Autocomplete,
  CircularProgress,
  Typography
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close,
} from '@mui/icons-material';
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import SignalWifi2BarIcon from '@mui/icons-material/SignalWifi2Bar';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import SignalWifi1BarLockIcon from '@mui/icons-material/SignalWifi1BarLock';
import SignalWifi2BarLockIcon from '@mui/icons-material/SignalWifi2BarLock';
import SignalWifi3BarLockIcon from '@mui/icons-material/SignalWifi3BarLock';
import SignalWifi4BarLockIcon from '@mui/icons-material/SignalWifi4BarLock';


const WIFI_STATUS = {
  IDLE_STATUS: 0,
  NO_SSID_AVAIL: 1,
  SCAN_COMPLETED: 2,
  CONNECTED: 3,
  CONNECT_FAILED: 4,
  CONNECTION_LOST: 5,
  DISCONNECTED: 6,
}

const TIMEOUT = 10; // 秒

const WifiSettingPage = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeoutCounter, setTimeoutCounter] = useState(0);

  // console.log(props)
  useEffect(() => {
    getWifSetting();
    return () => {
      setLoading(false);
    }
  }, [props.open])

  const getWifSetting = async () => {
    let data = await props.request("get-wifi-config", "GET",);
    console.log(data)
    setData(data);
  }

  const checkConnection = async () => {
    let responseData = await props.request("get-sta-status", "GET",);
    if (responseData.data === WIFI_STATUS.CONNECTED) {
      props.showSnackBar("success", "Connection Successfully");
      setLoading(false);
    } else if (responseData.data === WIFI_STATUS.NO_SSID_AVAIL) {
      props.showSnackBar("error", "No SSID available");
      setLoading(false);
    } else if (responseData.data === WIFI_STATUS.CONNECT_FAILED) {
      props.showSnackBar("error", "Connection Failed");
      setLoading(false);
    } else {
      if (timeoutCounter >= TIMEOUT) {
        props.showSnackBar("error", "Connection Timeout");
        setLoading(false);
      } else {
        setTimeoutCounter(timeoutCounter + 1);
        setTimeout(checkConnection, 1000);
        props.onChange('wifi', 'sta_psk', "");
      }
    }
  }

  const handleSave = async () => {
    setLoading(true);
    const sendData = {
      sta_ssid: props.configData.wifi.sta_ssid,
      sta_psk: props.configData.wifi.sta_psk || "",
      sta_switch: props.configData.wifi.sta_switch,
    }
    console.log(sendData);
    await props.sendData("set-wifi-config", sendData);
    setTimeoutCounter(0);
    setTimeout(checkConnection, 1000);
  }


  return (
    <Modal
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper className='setting'
        elevation={3}
        sx={{
          width: '40vw',
          borderRadius: "10px",
        }}
      >
        <CardHeader title="Wi-Fi" action={
          <IconButton onClick={props.onCancel}>
            <Close />
          </IconButton>
        } />
        <Box sx={{ overflow: 'auto', height: 'auto', overflowX: "hidden" }}>
          {/* WIFI设置 */}
          {
            <List >
              {
                props.peripherals.includes("sta_switch") &&
                <SettingSwitchItem
                  title="STA mode"
                  onChange={props.onStaMode}
                  value={props.configData.wifi.sta_switch}
                />
              }
              {
                props.peripherals.includes("sta_ssid_scan") &&
                <SsidList
                  title="STA SSID"
                  value={props.configData.wifi.sta_ssid}
                  request={props.request}
                  onChange={props.onChange}
                />
              }
              {
                props.peripherals.includes("sta_psk") &&
                <SettingPasswordItem
                  title="STA Password"
                  secondary="Password to login to WIFI broker"
                  value={props.configData.wifi.sta_psk}
                  onChange={(event) => props.onChange('wifi', 'sta_psk', event.target.value)}
                />
              }

            </List>
          }
        </Box>
        <CardActions>
          <Stack
            direction="row"
            justifyContent="right"
            width={"100%"}
            spacing={12}
          >
            <Button
              onClick={handleSave}
              justifyContent="center"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Save"}
            </Button>

          </Stack>
        </CardActions>
      </Paper >
    </Modal >
  );
};

const SsidList = (props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [ssidList, setSsidList] = useState([]);
  const [timerId, setTimerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWiFiStrengthIcon = (rssi, secure) => {
    if (rssi >= -60) {
      if (secure) return <SignalWifi4BarLockIcon />;
      else return <SignalWifi4BarIcon />;
    } else if (rssi >= -80) {
      if (secure) return <SignalWifi3BarLockIcon />;
      else return <SignalWifi3BarIcon />;
    } else if (rssi >= -90) {
      if (secure) return <SignalWifi2BarLockIcon />;
      else return <SignalWifi2BarIcon />;
    } else {
      if (secure) return <SignalWifi1BarLockIcon />;
      else return <SignalWifi1BarIcon />;
    }
  }

  const startWiFiScan = async (rssi) => {
    let status = await props.request("start-wifi-scan", "GET",);
    console.log("status", status);
    setLoading(true);
    setTimerId(setTimeout(getSsidList, 1000));
  }

  const getSsidList = async () => {
    let ssidList = await props.request("get-wifi-scan", "GET",);
    console.log("ssidList", ssidList);
    if (typeof ssidList === "object") {
      setSsidList(ssidList);
      let options = ssidList.map((ssid) => ssid.ssid);
      setOptions(options);
      setLoading(false);
      stopGetSsidList();
    } else if (ssidList === -2) {
      setLoading(false);
      stopGetSsidList();
    } else {
      setTimerId(setTimeout(getSsidList, 1000));
    }
  }

  const stopGetSsidList = () => {
    setLoading(false);
    setTimerId(clearTimeout(timerId));
  }

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Autocomplete
        id="asynchronous-demo"
        sx={{ width: "60%" }}
        open={open}
        value={props.value}
        onOpen={() => {
          setOpen(true);
          startWiFiScan();
        }}
        onClose={() => {
          setOpen(false);
          stopGetSsidList();
        }}
        onChange={(event, newValue) => {
          props.onChange('wifi', 'sta_ssid', newValue);
        }}
        options={options}
        loading={loading}
        renderOption={(props, ssid) => {
          let ssidData = ssidList.find((item) => item.ssid === ssid);
          return (<Box component="li" sx={{ display: "flex", alignItems: 'space-between', '& > img': { flexShrink: 0 } }} {...props}>
            {getWiFiStrengthIcon(ssidData.rssi, ssidData.secure)}
            <Typography sx={{ flexGrow: 1, padding: "0 8px" }}>{ssidData.ssid}</Typography>
          </Box>)
        }}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </SettingItem>
  );
}

const SettingTextItem = (props) => {
  let inputProps = null;
  if (props.start) {
    inputProps = {
      startAdornment: <InputAdornment position="start">{props.start}</InputAdornment>,
    }
  } else if (props.end) {
    inputProps = {
      endAdornment: <InputAdornment position="end">{props.end}</InputAdornment>,
    }
  }
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
  ];
  const defaultProps = {
    options: top100Films,
    getOptionLabel: (option) => option.title,
  };

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Stack spacing={1} sx={{ width: "30%" }}>
        <Autocomplete
          {...defaultProps}
          id="disable-close-on-select"
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField {...params} variant="standard" />
          )}
        />

      </Stack>

    </SettingItem>
  )
}

const SettingSwitchItem = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Switch onChange={props.onChange} checked={props.value} />
    </SettingItem>
  )
}

const SettingItem = (props) => {
  return (<>
    <ListItem>
      <ListItemText primary={props.title} secondary={props.subtitle} />
      {props.children}
    </ListItem>
  </>
  )
}

const SettingPasswordItem = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Input
        sx={{ width: '50%' }}
        id="standard-adornment-password"
        type={showPassword ? 'text' : 'password'}
        onChange={props.onChange}
        value={props.value}
        autoComplete={props.autoComplete || "password"}
        endAdornment={
          <InputAdornment position="end" >
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleShowPassword}
              onMouseDown={handleShowPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </SettingItem>
  )
}
export default WifiSettingPage;