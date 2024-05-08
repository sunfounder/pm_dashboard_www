import React, { useState, useEffect, useCallback } from 'react';
import {
  List,
  Button,
  CircularProgress,
} from '@mui/material';
import PopupFrame from './popupFrame.jsx';
import {
  SettingItemSwitch,
  SettingItemPassword,
  SettingItemSSIDList,
} from './settingItems.jsx';

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

const PopupWiFi = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeoutCounter, setTimeoutCounter] = useState(0);

  const getWifSetting = useCallback(async () => {
    let data = await props.request("get-wifi-config", "GET",);
    setData(data);
  }, [props]);

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

  useEffect(() => {
    getWifSetting();
    return () => {
      setLoading(false);
    }
  }, [props.open, getWifSetting])

  return (
    <PopupFrame
      title="WIFI Setting"
      open={props.open}
      onClose={props.onCancel}
      actions={
        <Button
          onClick={handleSave}
          justifyContent="center"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      }
    >
      <List>
        {props.peripherals.includes("sta_switch") &&
          <SettingItemSwitch
            title="STA mode"
            onChange={props.onStaMode}
            value={data.sta_switch}
          />}
        {props.peripherals.includes("sta_ssid_scan") &&
          <SettingItemSSIDList
            title="STA SSID"
            value={data.sta_ssid}
            request={props.request}
            onChange={props.onChange}
          />}
        {props.peripherals.includes("sta_psk") &&
          <SettingItemPassword
            title="STA Password"
            secondary="Password to login to WIFI broker"
            value={data.sta_psk}
            onChange={(event) => props.onChange('wifi', 'sta_psk', event.target.value)}
          />}
      </List>
    </PopupFrame >
  );
};

export default PopupWiFi;