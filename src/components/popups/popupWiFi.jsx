import React, { useState, useEffect, useRef } from 'react';
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

const DEFAULT_CONFIG = {
  "sta_switch": false,
  "sta_ssid": "",
  "sta_psk": "",
};

const TIMEOUT = 10; // 秒

const PopupWiFi = (props) => {
  const [data, setData] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [timeoutCounter, setTimeoutCounter] = useState(0);
  // 检查连接状态的标志，取反一次就会触发一次检查
  const [error, setError] = useState('Password must be at least 8 characters long');

  const timeoutCounterRef = useRef(timeoutCounter);

  const getData = async () => {
    let data = await props.request("get-wifi-config", "GET");
    setData(data);
  }

  const handleSwitchChange = (event) => {
    setData({ ...data, "sta_switch": event.target.checked });
  }

  const handlePasswordChange = (event) => {
    if (event.target.value.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError('');
    }
    setData({ ...data, "sta_psk": event.target.value });
  }

  const handleSSIDChange = (ssid) => {
    setData({ ...data, "sta_ssid": ssid });
  }

  const checkConnection = async () => {
    let status = await props.request("get-wifi-status", "GET",);
    if (status === WIFI_STATUS.CONNECTED) {
      props.showSnackBar("success", "Connection Successfully");
      setLoading(false);
    } else if (status === WIFI_STATUS.NO_SSID_AVAIL) {
      props.showSnackBar("error", "No SSID available");
      setLoading(false);
    } else if (status === WIFI_STATUS.CONNECT_FAILED) {
      props.showSnackBar("error", "Connection Failed");
      setLoading(false);
    } else {
      if (timeoutCounterRef.current >= TIMEOUT) {
        props.showSnackBar("error", "Connection Timeout");
        setLoading(false);
      } else {
        setTimeoutCounter(timeoutCounter => timeoutCounter + 1);
        // 延时1秒后再次检查连接状态
        setTimeout(checkConnection, 1000);
      }
    }
  }

  const handleSave = async () => {
    if (error !== '') {
      props.showSnackBar("error", error);
      return;
    }
    setLoading(true);
    console.log(data);
    const result = await props.sendData("set-wifi-config", data);
    if (result === 'OK') {
      if (data.sta_switch) {
        setTimeoutCounter(0);
        setTimeout(checkConnection, 1000);
      } else {
        props.showSnackBar("success", "Saved Successfully");
        setLoading(false);
      }
    }
  }

  const handleCancel = () => {
    setData({ ...data, "sta_psk": "" });
    props.onCancel();
  }

  useEffect(() => {
    getData();
  }, [props.open])

  useEffect(() => {
    timeoutCounterRef.current = timeoutCounter;
  }, [timeoutCounter]);

  return (
    <PopupFrame
      title="WIFI Setting"
      open={props.open}
      onClose={handleCancel}
      actions={
        <Button
          onClick={handleSave}
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
            onChange={handleSwitchChange}
            value={data.sta_switch}
          />}
        {props.peripherals.includes("sta_ssid_scan") &&
          <SettingItemSSIDList
            title="STA SSID"
            disabled={!data.sta_switch}
            value={data.sta_ssid}
            request={props.request}
            onChange={handleSSIDChange}
          />}
        {props.peripherals.includes("sta_psk") &&
          <SettingItemPassword
            title="STA Password"
            disabled={!data.sta_switch}
            secondary="Password to login to WIFI broker"
            value={data.sta_psk}
            onChange={handlePasswordChange}
          />}
      </List>
    </PopupFrame >
  );
};

export default PopupWiFi;