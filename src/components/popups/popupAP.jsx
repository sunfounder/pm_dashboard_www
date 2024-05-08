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

const PopupAP = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    let data = await props.request("get-ap-config", "GET",);
    setData(data);
  }, [props])

  const handleSave = async () => {
    console.log(props)
    setLoading(true);
    const sendData = {
      ap_ssid: data.ap_ssid,
      ap_password: data.ap_psk,
    }
    let result = await props.sendData("set-ap-config", sendData);
    if (result === "OK") {
      props.showSnackBar("success", "Save Successfully");
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  useEffect(() => {
    getData();
    return () => {
      setLoading(false);
    }
  }, [getData])

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
            value={props.configData.ap.ap_ssid}
            onChange={(event) => props.onChange('ap', 'ap_ssid', event.target.value)}
          />}
        {props.peripherals.includes("ap_psk") &&
          <SettingItemPassword
            title="AP Password"
            secondary="Password to login to WIFI broker"
            value={props.configData.ap.ap_psk}
            onChange={(event) => props.onChange('ap', 'ap_psk', event.target.value)}
          />}
      </List>
    </PopupFrame>
  );
};

export default PopupAP;