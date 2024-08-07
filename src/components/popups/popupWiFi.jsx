import React, { useState, useEffect } from 'react';
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

const DEFAULT_CONFIG = {
  "sta_switch": false,
  "sta_ssid": "",
  "sta_psk": "",
};

const PopupWiFi = (props) => {
  const [data, setData] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [ip, setIP] = useState('');
  // 检查连接状态的标志，取反一次就会触发一次检查
  const [error, setError] = useState('Password must be at least 8 characters long');


  const getData = async () => {
    let result = await props.request("get-wifi-config", "GET");
    let newData = { ...data };
    if (!result) return;
    for (let key in result) {
      if (newData[key] !== undefined) {
        newData[key] = result[key];
      }
    }
    setData(newData);
    let ip = await props.request("get-wifi-ip", "GET");
    setIP(ip);
  }

  const handleSwitchChange = async (event) => {
    let switchData = { "sta_switch": event };
    // setData({ ...data, "sta_switch": event });
    props.showAlert(
      "Wi-Fi configuration saved",
      event ? "When I switch off the STA mode, I need to reconfigure the network." : "The SAT mode is currently disabled. To access this page, you must use the AP mode.",
      () => {
        setLoading(true);
        sendSwitchData(switchData);
      },
      () => console.log("cancel"),
    );
  }

  const sendSwitchData = async (switchData) => {
    const result = await props.sendData("set-sta-switch", switchData);
    if (result === 'OK') {
      setLoading(false);
      setData({ ...data, "sta_switch": switchData });
      getData();
    } else {
      props.showSnackBar("error", "Failed to change Wi-Fi status");
      setLoading(false);
    }
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

  const handleSSIDListInputChange = (ssid) => {
    setData({ ...data, "sta_ssid": ssid });
  }

  const handleSave = async () => {
    if (error !== '') {
      props.showSnackBar("error", error);
      return;
    }
    setLoading(true);
    const result = await props.sendData("set-wifi-config", data);
    if (result === 'OK') {
      if (data.sta_switch) {
        props.showAlert(
          "Wi-Fi configuration saved",
          "Do you want to restart Wi-Fi to apply the changes? You may need to change to the same Wi-Fi and reflash.",
          () => {
            props.sendData("set-wifi-restart", {}, true)
            setLoading(false);
          }
        );
      } else {
        props.sendData("set-wifi-restart", {}, true);
        props.showSnackBar("success", "Wi-Fi configuration saved");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = setInterval(() => {
      getWifiIp();
    }, 3000);
    return () => clearInterval(interval);
  }, [props.open])

  const getWifiIp = async () => {
    let newIp = await props.request("get-wifi-ip", "GET");
    if (newIp) {
      setIP(newIp);
    }
  }
  return (
    <PopupFrame
      title="WIFI Setting"
      open={props.open}
      onClose={handleCancel}
      actions={
        <>
          {
            data.sta_switch &&
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Save"}
            </Button>
          }
        </>
      }
    >
      <List>
        {props.peripherals.includes("sta_switch") &&
          <SettingItemSwitch
            title="STA mode"
            subtitle={
              data.sta_switch && (
                ip === '' ? "Disconnected" : `Connected: ${ip}`
              )
            }
            onChange={handleSwitchChange}
            value={data.sta_switch}
          />}
        {/* <SettingItem
          title="Wi-Fi mode"
          disabled={!data.sta_switch} */}
        {props.peripherals.includes("sta_ssid_scan") && data.sta_switch &&
          <SettingItemSSIDList
            title="STA SSID"
            disabled={!data.sta_switch}
            value={data.sta_ssid}
            request={props.request}
            onChange={handleSSIDChange}
            onIinputChange={handleSSIDListInputChange}
          />}
        {props.peripherals.includes("sta_psk") && data.sta_switch &&
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