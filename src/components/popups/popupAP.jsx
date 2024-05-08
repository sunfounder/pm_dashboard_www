import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  InputAdornment,
  TextField,
  Input,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

import PopupFrame from './popupFrame.jsx';

const PopupAP = (props) => {
  const [hasError, setHasError] = useState({});
  const [currentWiFiSet, setCurrentWiFiSet] = useState({});
  const [loading, setLoading] = useState(false);
  const [connectButton, setConnectButton] = useState(true);
  // console.log(props)x

  useEffect(() => {
    getWifSetting();
    return () => {
      setLoading(false);
      setConnectButton(true);
    }
  }, [props.open])
  const getWifSetting = async () => {
    let currentWiFiSet = await props.request("get-ap-config", "GET",);
    setCurrentWiFiSet(currentWiFiSet);
  }

  const handleSave = async () => {
    console.log(props)
    setConnectButton(false);
    setLoading(true);
    const sendData = {
      ap_ssid: props.configData.ap.ap_ssid,
      ap_password: props.configData.ap.ap_psk,
    }
    let responseData = await props.sendData("set-ap-config", sendData);
    // if (responseData.status) {
    //   showSnackBar("success", "Save Successfully");
    // }
    setTimeout(() => {
      setLoading(false);
      setConnectButton(true);
    }, 3000);
  }

  return (
    <PopupFrame title="AP Setting" open={props.open} onClose={props.onCancel} actions={
      <Button
        disabled={(Object.keys(hasError).length !== 0) || loading}
        onClick={handleSave}
        justifyContent="center"
      >
        {
          loading ?
            <CircularProgress size={20} /> :
            "Save"
        }
      </Button>
    }>
      <List >
        {
          props.peripherals.includes("ap_ssid") &&
          <SettingItemText
            title="AP SSID"
            value={props.configData.ap.ap_ssid}
            onChange={(event) => props.onChange('ap', 'ap_ssid', event.target.value)}
          />
        }
        {
          props.peripherals.includes("ap_psk") &&
          <SettingItemPassword
            title="AP Password"
            secondary="Password to login to WIFI broker"
            value={props.configData.ap.ap_psk}
            onChange={(event) => props.onChange('ap', 'ap_psk', event.target.value)}
          />
        }
      </List>
    </PopupFrame>
  );
};


const SettingItemText = (props) => {
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
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <TextField
        error={props.error || false}
        sx={{ width: "50%" }}
        variant={props.variant || "standard"}
        value={props.value}
        onChange={props.onChange}
        InputProps={inputProps}
        type={props.type || "text"}
        autoComplete={props.autoComplete || "off"}
        name={props.name}
        helperText={props.helperText}
        placeholder={props.placeholder}
      ></TextField>
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

const SettingItemPassword = (props) => {
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

export default PopupAP;