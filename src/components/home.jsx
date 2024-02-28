import React, { useState, useEffect, useCallback } from 'react';
import SettingPage from './settingPage.jsx';
import Snackbars from './snackbar.jsx';
import { Box } from '@mui/material';
import DashboardPanel from './panels/dashboard.jsx';
import HistoryPanel from './panels/history.jsx';
import LogPanel from './panels/log.jsx';

import "./home.css";

const ip = window.location.hostname;
// const HOST = `http://${ip}:34001/api/v1.0/`;
const HOST = `http://192.168.100.176:34001/api/v1.0/`;
// const HOST = `http://homeassistant.local:34001/api/v1.0/`;

const defaultConfigData = {
  "auto": {
    "reflash_interval": 1, //刷新间隔
    "retry_interval": 3, //刷新
    "fan_mode": "auto",
    "fan_state": true,
    "fan_speed": 65,
    "temperature_unit": "C",
    "rgb_switch": true,
    "rgb_style": 'breath',  // 'breath', 'leap', 'flow', 'raise_up', 'colorful'
    "rgb_color": "#0a1aff",
    "rgb_speed": 50, //速度
    "rgb_pwm_frequency": 1000, //频率
    "rgb_pin": 10,  // 10,12,21
    "shutdown_battery_pct": 100
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
}

const PRODUCT = [
  {
    'name': 'Pironman U1',
    'id': 'pironman_u1',
    "address": 0x00,
    "peripherals": [
      'battery',
      'usb_in',
      'output',
      'fan',
      'power_source_sensor',
      'ir',
    ],
  },
  {
    'name': 'Pironman 4',
    'id': 'pironman_4',
    "address": 0x01,
    "peripherals": [
      'usb_in',
      'fan',
      'oled',
      'ws2812', // RGB
      'ir',
    ],
  }
]

const Home = (props) => {
  const [deviceName, setDeviceName] = useState("");
  const [peripherals, setPeripherals] = useState([]);
  //设置页面的显示状态
  const [settingPageDisplay, setSettingPageDisplay] = useState(false);
  const [configData, setConfigData] = useState(defaultConfigData);
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
        const data = result.data;
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
    console.log("getInitData, configData", _configData);
    let device_info = await request("get-device-info", "GET");
    console.log("getInitData, device_info", device_info);
    if (_configData) {
      setPeripherals(device_info.peripherals);
      setDeviceName(device_info.name);
    }
    if (_configData) {
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
    // setBasicDialogShow(true);
    console.log("set-config-data", configData);
    // 判断是否发送设置数据
    let responseData = await sendData("set-config", configData);
    console.log(responseData)
    if (responseData.status) {
      showSnackBar("success", "Save Successfully");
      // setSettingPageDisplay(false);
    }
  }

  const sendData = async (path, data) => {
    let payload = { data: data };
    console.log("sendData", payload)
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
      console.log("服务器返回的结果：", responseData);

      return responseData;
    } catch (error) {
      console.error("发生错误：", error);
    }
  }

  const handleChangeConfig = (field, name, value) => {
    let newData = { ...configData };
    newData[field][name] = value;
    setConfigData(newData);
  };

  const commonProps = {
    deviceName: deviceName,
    peripherals: peripherals,
    request: request,
    tabIndex: tabIndex,
    onTabChange: handleTabChange,
    onSettingPage: handleSettingPage,
    showSnackBar: showSnackBar,
  }

  return (
    <Box id="home" sx={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
    }} >
      {tabIndex === 0 && <DashboardPanel {...commonProps} temperatureUnit={configData.auto.temerature_unit} />}
      {tabIndex === 1 && <HistoryPanel {...commonProps} />}
      {tabIndex === 2 && <LogPanel {...commonProps} />}
      <SettingPage
        open={settingPageDisplay}
        onCancel={handleCancel}
        onSave={handleSaveConfig}
        onChange={handleChangeConfig}
        onModeChange={props.onModeChange}
        configData={configData}
        peripherals={peripherals}
        getRequest={request}
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