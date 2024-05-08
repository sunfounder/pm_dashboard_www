import React, { useState, useEffect, useCallback } from 'react';
import PopupSettings from './popups/popupSettings.jsx';
import PopupOTA from './popups/popupOTA.jsx';
import PopupWiFi from './popups/popupWiFi.jsx';
import PopupAP from './popups/popupAP.jsx';
import Snackbars from './snackbar.jsx';
import { Box } from '@mui/material';
import PersistentDrawerLeft from './persistentDrawerLeft.jsx';
import "./home.css";

const ip = window.location.hostname;
// const HOST = `http://${ip}:34001/api/v1.0/`;
// const HOST = `http://192.168.100.146:34001/api/v1.0/`;
// const HOST = `http://pironman-u1-002.local:34001/api/v1.0/`;
const HOST = `http://192.168.4.1:34001/api/v1.0/`;

const defaultConfigData = {
  "auto": {
    "reflash_interval": 1, //刷新间隔
    "retry_interval": 3, //刷新
    "fan_mode": "auto",
    "fan_state": true,
    "fan_speed": 65,
    "rgb_switch": true,
    "rgb_style": 'breath',  // 'breath', 'leap', 'flow', 'raise_up', 'colorful'
    "rgb_color": "#0a1aff",
    "rgb_speed": 50, //速度
    "rgb_pwm_frequency": 1000, //频率
    "rgb_pin": 10,  // 10,12,21
  },
  "mqtt": {
    "host": "core-mosquitto",
    "port": 1883,
    "username": "mqtt",
    "password": "mqtt"
  },
  "dashboard": {
    "ssl": false,
    "ssl_ca_cert": "",
    "ssl_cert": ""
  },
  "wifi": {
    "sta_switch": false,
    "sta_ssid": "",
    "sta_psk": "12345678",
  },
  "ap": {
    "ap_ssid": "",
    "ap_psk": "12345678",
  },
  "mqtt": {
    "host": "core-mosquitto",
    "port": 1883,
    "username": "mqtt",
    "password": "mqtt"
  },
  "system": {
    "temperature_unit": "C",
    "shutdown_percentage": 100,  //关机策略
    "power_off_percentage": 100,  //电池保护策略
    "timestamp": "16552455",
    "timezone": "UTC-08:00",
    "auto_time_enable": false,
    "ntp_server": "",
    "mac_address": "",
    "ip_address": "",
    "sd_card_usage": 0,
    "sd_card_total": 0,
  }
}

const Home = (props) => {
  const [deviceName, setDeviceName] = useState("");
  const [peripherals, setPeripherals] = useState([
    "storage",
    "cpu",
    "network",
    "memory",
    "history",
    "log",
    "input_voltage",
    "input_current",
    "output_switch",
    "output_voltage",
    "output_current",
    "battery_voltage",
    "battery_current",
    "battery_capacity",
    "battery_percentage",
    "power_source",
    "is_input_plugged_in",
    "is_battery_plugged_in",
    "is_charging",
    "spc_fan_power",
    "pwm_fan_speed",
    "gpio_fan_state",
    "shutdown_percentage",
    "power_off_percentage",
    "timezone",
    "auto_time_enable",
    "time",
    "sta_switch",
    "sta_ssid_scan",
    "sta_ssid",
    "sta_psk",
    "ap_ssid",
    "ap_psk",
    "ota_auto",
    "ota_manual",
    "mac_address",
    "ip_address",
    "sd_card_usage",
    "download_history_file",
  ]);
  const [configData, setConfigData] = useState(defaultConfigData);
  const [newConfigData, setNewConfigData] = useState({});
  //设置页面的显示状态
  const [settingPageDisplay, setSettingPageDisplay] = useState(false);
  const [PopupOTADisplay, setPopupOTADisplay] = useState(false);
  const [wifiSettingPageDisplay, setPopupWiFiDisplay] = useState(false);
  const [apSettingPageDisplay, setPopupAPDisplay] = useState(false);
  //全局提示框显示内容
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  //全局提示框显示状态
  const [snackbarShow, setSnackbarShow] = useState(false);
  const [tabIndex, setTabIndex] = useState(parseInt(window.localStorage.getItem("pm-dashboard-tabIndex")) || 0);

  const request = useCallback(async (url, method, payload) => {
    try {
      const requestOptions = {
        method: method,
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
        },
        // 将 payload 转换为 JSON 字符串，并将其添加到请求体中
        body: method === 'POST' ? JSON.stringify(payload) : undefined,
      };

      if (method === 'GET' && payload !== undefined) {
        // 如果是 GET 请求，将 payload 转换为 URL 参数字符串，并附加到 URL 上
        const params = new URLSearchParams(payload);
        url += `?${params}`;
      }
      const response = await fetch(HOST + url, requestOptions);

      if (!response.ok) {
        console.error(`Request failed with status ${response.status}`);
        showSnackBar("error", `Request Error: ${response.status}`);
        return false;
      }

      const result = await response.json();
      const status = result.status;

      if (status) {
        let data = result.data;
        if (!data) {
          data = result;
        }
        return data;
      } else {
        console.error(`Error: ${result.error}`);
        showSnackBar("error", `Error: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      showSnackBar("error", `Request Error: ${error}`);
      return false;
    }
  }, []);

  const getInitData = useCallback(async () => {
    let _configData = await request("get-config", "GET");
    let device_info = await request("get-device-info", "GET");
    let currentWiFiSet = await request("get-ap-config", "GET",);
    console.log("_configData", _configData);
    console.log("device_info", device_info);
    if (device_info) {
      setPeripherals(device_info.peripherals);
      setDeviceName(device_info.name);
    }
    if (_configData) {
      _configData.ap = currentWiFiSet
      setConfigData(_configData);
    }
  }, [request])

  useEffect(() => {
    getInitData();
  }, [getInitData]);

  const handleTabChange = (event, newValue) => {
    window.localStorage.setItem("pm-dashboard-tabIndex", newValue);
    setTabIndex(newValue);
  }

  const handleSettingPage = () => {
    setSettingPageDisplay(!settingPageDisplay);
  }

  const handlePopupWiFi = () => {
    setPopupWiFiDisplay(!wifiSettingPageDisplay);
  }

  const handlePopupAP = () => {
    setPopupAPDisplay(!apSettingPageDisplay);
  }

  const handlePopupOTA = () => {
    setPopupOTADisplay(!PopupOTADisplay);
  }

  const showSnackBar = (severity, text) => {
    setSnackbarText(text);
    setSnackbarSeverity(severity);
    setSnackbarShow(true);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarShow(false);
    setSnackbarText("");
  }

  const handleCancel = () => {
    setSettingPageDisplay(false);
  }

  const handleSaveConfig = async () => {
    console.log("newConfigData", newConfigData);

    // 判断是否发送设置数据
    let responseData = await sendData("set-config", newConfigData);
    if (responseData.status) {
      showSnackBar("success", "Save Successfully");
      // setSettingPageDisplay(false);
      let tmp = { ...configData };
      for (let field in newConfigData) {
        for (let key in newConfigData[field]) {
          tmp[field][key] = newConfigData[field][key];
        }
      }
      setConfigData(tmp);
      setNewConfigData({});
    }
  }

  const sendData = async (path, payload) => {
    try {
      const response = await fetch(HOST + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 确保请求成功
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();

      return responseData;
    } catch (error) {
      console.error("Error", error);
    }
  }

  const handleChangeConfig = (field, name, value) => {
    console.log("handleChangeConfig field", field, "name", name, "value", value);
    // 密码最少8位数
    if (name === "sta_password" || name === "ap_password") {
      if (value.length < 8) {
        showSnackBar("error", "Password must be at least 8 characters long");
      }
    }
    let newData = { ...newConfigData };
    if (!Object.keys(newData).includes(field)) {
      newData[field] = {};
    }
    newData[field][name] = value;
    setNewConfigData(newData);
  };

  const handleStaMode = (e) => {
    let newData = { ...configData };
    newData.wifi.sta_switch = e.target.checked;
    setConfigData(newData)
  }

  const commonProps = {
    deviceName: deviceName,
    peripherals: peripherals,
    request: request,
    tabIndex: tabIndex,
    onTabChange: handleTabChange,
    onSettingPage: handleSettingPage,
    showSnackBar: showSnackBar,
    sendData: sendData,
  }

  return (
    <Box id="home" sx={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
    }} >
      {/* {tabIndex === 0 && <DashboardPanel {...commonProps} temperatureUnit={configData.auto.temperature_unit}  />}
      {tabIndex === 1 && <HistoryPanel {...commonProps} temperatureUnit={configData.auto.temperature_unit}  />}
      {tabIndex === 2 && <LogPanel {...commonProps}  />} */}
      {/* <PersistentDrawerLeft commonProps={commonProps} temperatureUnit={configData.auto.temperature_unit}  /> */}
      <PersistentDrawerLeft
        {...commonProps}
        // commonProps={commonProps}
        configData={configData}
        temperatureUnit={configData.temperature_unit ? configData.temperature_unit : "C"}
        onChange={handleChangeConfig}
        sendData={sendData}
        onSave={handleSaveConfig}
        onPopupWiFi={handlePopupWiFi}
        onPopupAP={handlePopupAP}
        onPopupOTA={handlePopupOTA}
      />
      <PopupSettings
        open={settingPageDisplay}
        onCancel={handleCancel}
        onSave={handleSaveConfig}
        onChange={handleChangeConfig}
        onModeChange={props.onModeChange}
        configData={configData}
        peripherals={peripherals}
        commonProps={commonProps}
      />
      <PopupOTA
        open={PopupOTADisplay}
        onCancel={handlePopupOTA}
        request={request}
        peripherals={peripherals}
      />
      <PopupWiFi
        open={wifiSettingPageDisplay}
        onCancel={handlePopupWiFi}
        configData={configData}
        peripherals={peripherals}
        request={request}
        onStaMode={handleStaMode}
        onChange={handleChangeConfig}
        sendData={sendData}
        onSave={handleSaveConfig}
      />
      <PopupAP
        open={apSettingPageDisplay}
        onCancel={handlePopupAP}
        request={request}
        configData={configData}
        peripherals={peripherals}
        onChange={handleChangeConfig}
        sendData={sendData}
        onSave={handleSaveConfig}
      />
      <Snackbars
        open={snackbarShow}
        text={snackbarText}
        severity={snackbarSeverity}
        handleClose={handleSnackbarClose}
      />
    </Box >
  );
};
export default Home;