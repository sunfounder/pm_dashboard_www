import React, { useState, useEffect } from 'react';
import PopupSettings from './popups/popupSettings.jsx';
import PopupOTA from './popups/popupOTA.jsx';
import PopupWiFi from './popups/popupWiFi.jsx';
import PopupAP from './popups/popupAP.jsx';
import Snackbars from './snackbar.jsx';
import Alert from './alert';
import { Box } from '@mui/material';
import PersistentDrawerLeft from './persistentDrawerLeft.jsx';

const ip = window.location.hostname;
// const HOST = `http://${ip}:34001/api/v1.0/`;
// const HOST = `http://192.168.100.146:34001/api/v1.0/`;
// const HOST = `http://pironman-u1-002.local:34001/api/v1.0/`;
const HOST = `http://192.168.4.1:34001/api/v1.0/`;

const DEFAULT_PERIPHERALS = [
  'output_switch',
  'ota_manual',
  'time',
]

const Home = (props) => {
  const [deviceName, setDeviceName] = useState("");
  const [peripherals, setPeripherals] = useState(DEFAULT_PERIPHERALS);
  const [temperatureUnit, setTemperatureUnit] = useState("C");
  //设置页面的显示状态
  const [settingPageDisplay, setSettingPageDisplay] = useState(false);
  const [PopupOTADisplay, setPopupOTADisplay] = useState(false);
  const [wifiSettingPageDisplay, setPopupWiFiDisplay] = useState(false);
  const [apSettingPageDisplay, setPopupAPDisplay] = useState(false);
  //全局提示框显示内容
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarShow, setSnackbarShow] = useState(false);
  //警告框显示
  const [alertShow, setAlertShow] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [alertConfirmCallback, setAlertConfirmCallback] = useState(null);
  const [alertCancelCallback, setAlertCancelCallback] = useState(null);
  //全局提示框显示状态
  const [tabIndex, setTabIndex] = useState(parseInt(window.localStorage.getItem("pm-dashboard-tabIndex")) || 0);

  const request = async (url, method, payload) => {
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
      let result;
      try {
        result = await response.json();
      } catch (error) {
        console.error(url, error);
        showSnackBar("error", `Request Error: ${error}`);
        return;
      }
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
  }

  const getDeviceInfo = async () => {
    let deviceInfo = await request("get-device-info", "GET");
    console.log("deviceInfo", deviceInfo);
    if (deviceInfo) {
      setPeripherals(deviceInfo.peripherals);
      setDeviceName(deviceInfo.name);
    }
  }

  useEffect(() => {
    getDeviceInfo();
  }, [])

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

  const sendData = async (path, payload, ignoreError) => {
    try {
      const response = await fetch(HOST + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (ignoreError) {
        return true;
      }
      // 确保请求成功
      if (!response.ok) {
        showSnackBar("error", `HTTP error! Status: : ${response.status}`);
        return;
      }
      let result;
      result = await response.json();
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
      showSnackBar("error", `Error: ${error}`);
    }
  }

  const handleAlertClose = () => {
    setAlertShow(false);
  }

  const handleAlertCancel = async () => {
    await alertCancelCallback();
    setAlertShow(false);
  }

  const handleAlertConfirm = async () => {
    await alertConfirmCallback();
    setAlertShow(false);
  }

  const showAlert = (title, content, onConfirm, onCancel) => {
    if (title !== undefined) {
      setAlertTitle(title);
    }
    if (content !== undefined) {
      setAlertContent(content);
    }
    if (onConfirm !== undefined) {
      setAlertConfirmCallback(() => onConfirm);
    }
    if (onCancel !== undefined) {
      setAlertCancelCallback(() => onCancel);
    }
    setAlertShow(true);
  }

  const handleTemperatureUnitChanged = (temperatureUnit) => {
    setTemperatureUnit(temperatureUnit);
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
      <PersistentDrawerLeft
        {...commonProps}
        temperatureUnit={temperatureUnit}
        sendData={sendData}
        showAlert={showAlert}
        onPopupWiFi={handlePopupWiFi}
        onPopupAP={handlePopupAP}
        onPopupOTA={handlePopupOTA}
      />
      <PopupSettings
        open={settingPageDisplay}
        request={request}
        onCancel={handleCancel}
        onModeChange={props.onModeChange}
        onTemperatureUnitChanged={handleTemperatureUnitChanged}
        peripherals={peripherals}
        commonProps={commonProps}
        showSnackBar={showSnackBar}
        sendData={sendData}
      />
      <PopupOTA
        open={PopupOTADisplay}
        onCancel={handlePopupOTA}
        request={request}
        peripherals={peripherals}
        showSnackBar={showSnackBar}
        showAlert={showAlert}
      />
      <PopupWiFi
        open={wifiSettingPageDisplay}
        onCancel={handlePopupWiFi}
        peripherals={peripherals}
        request={request}
        sendData={sendData}
        showSnackBar={showSnackBar}
        showAlert={showAlert}
      />
      <PopupAP
        open={apSettingPageDisplay}
        onCancel={handlePopupAP}
        request={request}
        peripherals={peripherals}
        sendData={sendData}
        showSnackBar={showSnackBar}
        showAlert={showAlert}
      />
      <Snackbars
        open={snackbarShow}
        text={snackbarText}
        severity={snackbarSeverity}
        handleClose={handleSnackbarClose}
      />
      <Alert
        open={alertShow}
        title={alertTitle}
        content={alertContent}
        onClose={handleAlertClose}
        onCancel={alertCancelCallback ? handleAlertCancel : undefined}
        onConfirm={alertConfirmCallback ? handleAlertConfirm : undefined}
      />
    </Box >
  );
};
export default Home;