import React, { useState, useEffect, useCallback } from 'react';
import {
  List,
  Button,
  CircularProgress,
} from '@mui/material';

import PopupFrame from './popupFrame.jsx';
import {
  SettingItemText,
  SettingItemPassword,
} from './settingItems.jsx';

const DEFAULT_CONFIG = {
  "ap_ssid": "",
  "ap_psk": "",
};

const PopupAP = (props) => {
  const [data, setData] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getData = async () => {
    let data = await props.request("get-ap-config", "GET");
    setData(data);
  }

  const handleSSIDChanged = (event) => {
    setData({ ...data, "ap_ssid": event.target.value })
  }

  const handlePasswordChanged = (event) => {
    const password = event.target.value;
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError('');
    }
    setData({ ...data, "ap_psk": password })
  }

  const handleSave = async () => {
    if (error !== '') {
      props.showSnackBar("error", error);
      return;
    }
    setLoading(true);
    console.log("data", data);
    const payload = {
      ap_ssid: data.ap_ssid,
      ap_psk: data.ap_psk,
    }
    console.log("payload", payload);
    let result = await props.sendData("set-ap-config", payload);
    if (result === "OK") {
      props.showSnackBar("success", "Save Successfully");
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
    return () => {
      setLoading(false);
    }
  }, [props.open])

  return (
    <PopupFrame title="AP Setting" open={props.open} onClose={props.onCancel} actions={
      <Button
        disabled={loading}
        onClick={handleSave}
        justifyContent="center"
      >
        {loading ?
          <CircularProgress size={20} /> :
          "Save"}
      </Button>
    }>
      <List >
        {props.peripherals.includes("ap_ssid") &&
          <SettingItemText
            title="AP SSID"
            value={data.ap_ssid}
            onChange={handleSSIDChanged}
          />}
        {props.peripherals.includes("ap_psk") &&
          <SettingItemPassword
            title="AP Password"
            secondary="Password to login to WIFI broker"
            value={data.ap_psk}
            onChange={handlePasswordChanged}
          />}
      </List>
    </PopupFrame>
  );
};

export default PopupAP;