import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  SettingItemToggleButton,
  SettingItemSlider,
  SettingItemSwitch,
  SettingItem,
  SettingItemTime,
  SettingItemTimezone,
  SettingItemText,
  SettingItemSDCardUsage,
  SettingItemNumber,
  SettingItemMenu,
  SettingItemButton,
  SettingItemColorPicker,
  SettingItemList,
} from "./settingItems.jsx";
import PopupFrame from './popupFrame.jsx';
import SectionFrame from "./sectionFrame.jsx";
import PopupPowerFailureSimulation from "./popupPowerFailureSimulation.jsx";
import DataGridPro from "./dataGridPro.jsx"
import PopupEmail from "./popupEmail.jsx";
import PopupBuzz from "./popupBuzz .jsx";
// const GPIO_FAN_MODES = ['Always On', 'Performance', 'Balanced', 'Quiet', 'OFF'];
const GPIO_FAN_MODES = [
  { value: 4, label: 'Quiet' },
  { value: 3, label: 'Balanced' },
  { value: 2, label: 'Cool' },
  { value: 1, label: 'Performance' },
  { value: 0, label: 'Always On' },
]


const SectionSystem = (props) => {
  let oledPages = props.peripherals.filter(item => item.startsWith("oled_page")).map(item => item.replace("oled_page_", ""))
  const descriptions = {
    mix: {
      id: "mix",
      title: "System Mix",
      description: "Displays CPU usage, CPU temperature, and IP address"
    },
    performance: {
      id: "performance",
      title: "Performance Metrics",
      description: "Displays CPU usage, CPU temperature, RAM usage, and fan speed"
    },
    rpi_power: {
      id: "rpi_power",
      title: "Raspberry Pi Power",
      description: "Displays power details of Raspberry Pi: voltage, current, and power"
    },
    input: {
      id: "input",
      title: "Input Power",
      description: "Displays input power details: voltage, current, and power"
    },
    battery: {
      id: "battery",
      title: "Battery Status",
      description: "Displays battery details: voltage, current, power, and charging state"
    },
    disk: {
      id: "disk",
      title: "Disk Usage",
      description: "Displays disk usage for all disks"
    },
    ips: {
      id: "ips",
      title: "IP Addresses",
      description: "Displays IP addresses for all physical interfaces (IP-only display)"
    }
  };

  const ipData = {};
  const macData = {};
  Object.keys(props.latestData).forEach(key => {
    if (key.startsWith('ip_')) {
      // 删除 'ip_' 前缀并存入 ipData
      ipData[key.replace('ip_', '')] = props.latestData[key];
    } else if (key.startsWith('mac_')) {
      // 删除 'mac_' 前缀并存入 macData
      macData[key.replace('mac_', '')] = props.latestData[key];
    }
  });

  // 映射成对应的标题和描述
  oledPages = oledPages.map(page => ({
    id: descriptions[page].id,
    title: descriptions[page].title,
    description: descriptions[page].description
  }));
  // console.log("SectionSystem", props);
  // const [colorDiskPopup, setColorDiskPopup] = useState(false);
  // const [colorDisk, setColorDisk] = useState("000000");
  const [gpioFanModeIndex, setGpioFanModeIndex] = useState(4 - props.config.gpio_fan_mode);
  const [popupStatus, setPopupStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [oledDiskList, setOledDiskList] = useState([
    { value: "total", label: "Total" },
  ]);
  const [oledNetworkInterfaceList, setOledNetworkInterfaceList] = useState([
    { value: "all", label: "All" },
  ])
  const [batteryTestPopup, setBatteryTestPopup] = useState(false);
  const [batteryTestStatus, setBatteryTestStatus] = useState(false);
  // const [rgbMatrixListShow, setRgbMatrixListShow] = useState(false);
  const [OLEDLayouPopup, setOLEDLayouPopup] = useState(false);
  const [sendOLEDPages, setSendOLEDPages] = useState([]);
  const [currentOLEDPage, setCurrentOLEDPage] = useState([]);

  const handleOLEDLayoutPopup = () => {
    setOLEDLayouPopup(!OLEDLayouPopup);
  }
  // const handleColorDiskPopup = (color) => {
  //   setColorDiskPopup(!colorDiskPopup);
  //   setColorDisk(color ? color : "#0a1aff");
  // }

  // const handRgbMatrixList = () => {
  //   setRgbMatrixListShow(!rgbMatrixListShow);
  // }

  const handlePopup = () => {
    setPopupStatus(!popupStatus);
  }

  const handleClearHistory = async () => {
    setPopupStatus(!popupStatus);
    let result = await props.sendData('clear-history');
    if (result === "OK") {
      console.log("History cleared");
      props.showSnackBar("success", "History data has been cleared successfully.");
    }
  }

  const handleBatteryTestPopup = async () => {
    setBatteryTestPopup(!batteryTestPopup);
    setBatteryTestStatus(false);
  }

  const handleBatteryTestStatus = (data) => {
    console.log("开始测试", batteryTestStatus, data);
    setBatteryTestStatus(data);
  }

  const getOledDiiskList = async () => {
    const result = await props.request('get-disk-list');
    if (result) {
      const newDiskList = result.map(disk => ({
        value: disk,
        label: disk
      }));
      setOledDiskList([...oledDiskList, ...newDiskList]);
    }
  }

  const getOledNetworkInterfaceList = async () => {
    const result = await props.request('get-network-interface-list');
    if (result) {
      const newNetworkInterfaceList = result.map(networkInterface => ({
        value: networkInterface,
        label: networkInterface
      }))
      setOledNetworkInterfaceList([...oledNetworkInterfaceList, ...newNetworkInterfaceList]);
    }
  }

  const handleToggleOLEDEnabled = async (event) => {
    let result = await props.sendData('set-oled-enable', { 'enable': event });
    if (result === "OK") {
      props.onChange('system', 'oled_enable', event);
    }
  }

  const handleOLEDRotation = async (event) => {
    let result = await props.sendData('set-oled-rotation', { 'rotation': Number(event) });
    if (result === "OK") {
      props.onChange('system', 'oled_rotation', Number(event));
    }
  }

  const handleDrag = (data) => {
    console.log("handleDrag", data);
    setCurrentOLEDPage(data);
  }

  const handleDragSave = async () => {
    // if (sendOLEDPages.length === 0) {
    if (currentOLEDPage.length === 0) {
      props.showAlert(
        "Error",
        "Please select at least one page",
        () => () => console.log("取消"), null
      );
      return;
    }
    // let result = await props.sendData('set-oled-pages', { 'pages': sendOLEDPages });
    let result = await props.sendData('set-oled-pages', { 'pages': currentOLEDPage });
    if (result === "OK") {
      setSendOLEDPages(currentOLEDPage);
      props.showSnackBar("success", "Pages saved successfully.");
      handleOLEDLayoutPopup();
    }
  }

  const handleTemperatureUnit = async (event) => {
    let result = await props.sendData('set-temperature-unit', { 'unit': event });
    if (result === "OK") {
      props.onTemperatureUnitChanged(event);
      props.onChange('system', 'temperature_unit', event);
    }
  }

  const handleToggleRGBEnabled = async (event) => {
    let result = await props.sendData('set-rgb-enable', { 'enable': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_enable', event);
    }
  }

  // const handleColorChange = (newColor) => {
  //   console.log("newColor", newColor);
  //   let color = newColor.replace("#", "");
  //   handleRgbColor(color);
  // }

  const handleRgbColor = async (event) => {
    if (event.length !== 6) {
      console.log("Invalid color");
    } else {
      const color = "#" + event;
      let result = await props.sendData('set-rgb-color', { 'color': color });
      if (result === "OK") {
        props.onChange('system', 'rgb_color', color);
      }
    }
  }

  const handleRgbBrightness = async (event) => {
    let result = await props.sendData('set-rgb-brightness', { 'brightness': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_brightness', event);
    }
  }

  const handleRgbSpeed = async (event) => {
    let result = await props.sendData('set-rgb-speed', { 'speed': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_speed', event);
    }
  }

  const handleRGBAnimation = async (event) => {
    let result = await props.sendData('set-rgb-style', { 'style': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_style', event);
    }
  }

  const handleToggleRGBMatrix = async (event) => {
    let result = await props.sendData('set-rgb-matrix-enable', { 'enable': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_matrix_enable', event);
    }
  }

  const handleRGBMatrixStyle = async (event) => {
    let result = await props.sendData('set-rgb-matrix-style', { 'style': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_matrix_style', event);
    }
  }

  const handleRGBMatrixColor = async (event) => {
    if (event.length !== 6) {
      console.log("Invalid color");
    } else {
      const color = "#" + event;
      let result = await props.sendData('set-rgb-matrix-color', { 'color': color });
      if (result === "OK") {
        props.onChange('system', 'rgb_matrix_color', color);
      }
    }
  }

  const handleRGBMatrixReset = async (event) => {
    if (event.length !== 6) {
      console.log("Invalid color");
    } else {
      const color = "#" + event;
      let result = await props.sendData('set-rgb-matrix-color2', { 'color': color });
      if (result === "OK") {
        props.onChange('system', 'rgb_matrix_color2', color);
      }
    }
  }

  const handleRGBMatrixSpeed = async (event) => {
    let result = await props.sendData('set-rgb-matrix-speed', { 'speed': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_matrix_speed', event);
    }
  }

  const handleRGBMatrixBrightness = async (event) => {
    let result = await props.sendData('set-rgb-matrix-brightness', { 'brightness': event });
    if (result === "OK") {
      props.onChange('system', 'rgb_matrix_brightness', event);
    }
  }

  const handleShutdownPercentageCommitted = async (shutdownPercentage) => {
    let result = await props.sendData('set-shutdown-percentage', { 'shutdown-percentage': shutdownPercentage });
    if (result === "OK") {
      props.onChange('system', 'shutdown_percentage', shutdownPercentage);
    }
  }

  const handleFanModeCommitted = async (fanPower) => {
    let result = await props.sendData('set-fan-power', { 'fan_mode': fanPower });
    if (result === "OK") {
      props.onChange('system', 'fan_power', fanPower);
      return true;
    } else {
      return false;
    }
  }

  const handleGPIOFanModeCommitted = async (index) => {
    let value = GPIO_FAN_MODES[index].value;
    let result = await props.sendData('set-fan-mode', { 'fan_mode': value });
    if (result === "OK") {
      props.onChange('system', 'gpio_fan_mode', value);
      setGpioFanModeIndex(index);
    }
  }

  const handleFanLEDModeCommitted = async (value) => {
    let result = await props.sendData('set-fan-led', { 'led': value });
    if (result === "OK") {
      props.onChange('system', 'gpio_fan_led', value);
    }
  }

  const handleTimeAccepted = async (time) => {
    let result = await props.sendData('set-timestamp', { 'timestamp': time });
    if (result === "OK") {
      props.onChange('system', 'time', time);
    }
  }
  const handleTimezoneChange = async (timezone) => {
    let result = await props.sendData('set-timezone', { 'timezone': timezone });
    if (result === "OK") {
      props.onChange('system', 'timezone', timezone);
    }
  }
  const handleAutoTimeSwitchChange = async (enable) => {
    let result = await props.sendData('set-auto-time', { 'enable': enable });
    if (result === "OK") {
      props.onChange('system', 'auto_time_switch', enable);
    }
  }
  const handleNTPServerChange = async (ntpServer) => {
    let result = await props.sendData('set-ntp-server', { 'ntp_server': ntpServer });
    if (result === "OK") {
      props.onChange('system', 'ntp_server', ntpServer);
    }
  }
  const handleSDDataIntervalBlur = async (event) => {
    let value = event.target.value;
    // 限制输入的类型
    if (isNaN(value) || !Number.isInteger(parseFloat(value))) return;
    if (value < 1 || value > 3600) return;
    let result = await props.sendData('set-sd-data-interval', { 'interval': value });
    if (result === "OK") {
      props.onChange('system', 'sd_card_data_interval', value);
    }
  }

  const handleOLEDSleepTimeoutBlur = async (event) => {
    let value = Number(event.target.value);
    // 限制输入的类型
    if (isNaN(value) || !Number.isInteger(parseFloat(value))) return;
    if (value < 1 || value > 3600) return;
    let result = await props.sendData('set-oled-sleep-timeout', { 'timeout': parseInt(value) });
    if (result === "OK") {
      props.onChange('system', 'oled_sleep_timeout', parseInt(value));
    }
  }

  const handleSDDataRetainSend = async (value) => {
    let result = await props.sendData('set-sd-data-retain', { 'retain': value });
    if (result === "OK") {
      props.onChange('system', 'sd_card_data_retain', value);
    }
  }
  const handleSDDataRetainBlur = (event) => {
    let value = event.target.value;
    const data = props.config.sd_card_data_retain;
    if (isNaN(value) || !Number.isInteger(parseFloat(value))) return;
    // 最大不能超过1000
    if (value < 1 || value > 1000) return;
    if (value < data) {
      props.showAlert(
        "Attention",
        "The historical data retention period has been reduced. This means that we will be deleting data older than the new retention period. Please ensure that you have backed up any important data before the changes take effect.",
        () => handleSDDataRetainSend(value), () => console.log("取消")
      );
    } else {
      handleSDDataRetainSend(value);
    }
  }
  const getCurrentTime = async () => {
    const newCurrentTime = await props.request("get-timestamp");
    if (newCurrentTime && newCurrentTime !== currentTime) {
      setCurrentTime(newCurrentTime);
    }
  }

  const handleDebugLevel = async (event) => {
    let result = await props.sendData('set-debug-level', { 'level': event });
    if (result === "OK") {
      props.onChange('system', 'debug_level', event);
    }
  }

  const handleDatabaseRetention = async (event) => {
    const days = event.target.value;
    let result = await props.sendData('set-database-retention-days', { 'days': days });
    if (result === "OK") {
      props.onChange('system', 'database_retention_days', days);
    }
  }

  useEffect(() => {
    if (props.peripherals.includes("time")) {
      getCurrentTime();
      const interval = setInterval(() => {
        getCurrentTime();
      }, 5000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, props.config.timezone, props.config.auto_time_switch, props.config.ntpServer, props.peripherals]);

  useEffect(() => {
    getOledDiiskList();
    getOledNetworkInterfaceList();
  }, []);

  useEffect(() => {
    setSendOLEDPages(props.config.oled_pages);
    setCurrentOLEDPage(props.config.oled_pages);
  }, [props.config.oled_pages]);

  useEffect(() => {
    setGpioFanModeIndex(4 - props.config.gpio_fan_mode);
  }, [props.config.gpio_fan_mode]);

  return (
    <>
      <SectionFrame title="System">
        {/* 温度单位 */}
        {props.peripherals.includes("temperature_unit") &&
          <SettingItemToggleButton
            title="Temperature Unit"
            subtitle="Set prefer temperature unit"
            onChange={(event) => handleTemperatureUnit(event.target.value)}
            value={props.config.temperature_unit}
            options={[
              { value: 'C', name: 'Celius' },
              { value: 'F', name: 'Fahrenheit' },
            ]}
          />
        }
        {/* oled */}
        {
          props.peripherals.includes("oled") &&
          <SettingItemList
            primary="OLED"
            children={
              <>
                {/* oled开关 */}
                <SettingItemSwitch
                  title="OLED Enable"
                  subtitle="Whether to enable OLED"
                  onChange={(event) => handleToggleOLEDEnabled(event)}
                  value={props.config.oled_enable} />
                {/* oled 显示方向 */}
                <SettingItemToggleButton
                  title="OLED Rotation"
                  subtitle="Set OLED rotation"
                  onChange={(event) => handleOLEDRotation(event.target.value)}
                  value={props.config.oled_rotation}
                  options={[
                    { value: 0, name: '0°' },
                    { value: 180, name: '180°' },
                  ]}
                />
                {/* oled 休眠时长 */}
                {
                  props.peripherals.includes("oled_sleep") &&
                  <SettingItemNumber
                    width="30%"
                    title="OLED Sleep Timeout"
                    subtitle="Set OLED sleep timeout"
                    value={props.config ? props.config.oled_sleep_timeout : ""}
                    // disabled={props.config.oled_sleep_timeout === 0}
                    min={1}
                    max={600}
                    end="S"
                    onBlur={handleOLEDSleepTimeoutBlur}
                  />
                }
                {/* oled 布局 */}
                <SettingItemButton
                  title="OLED Pages"
                  subtitle="Set OLED pages"
                  onClick={handleOLEDLayoutPopup}
                />
                <Divider />
              </>
            }
          />
        }
        {/* RGB */}
        {
          props.peripherals.includes("ws2812") &&
          <>
            {/* RGB 开关 */}
            <SettingItemSwitch
              title="RGB Enable"
              subtitle="Whether to enable RGB"
              // onChange={(event) => props.onChange('rgb_enable', event)}
              onChange={(event) => handleToggleRGBEnabled(event)}
              value={props.config.rgb_enable} />
            {/* RGB 颜色 */}
            <SettingItemColorPicker
              title="RGB Color"
              subtitle="Set RGB color"
              color={props.config.rgb_color}
              value={props.config.rgb_color.replace("#", "")}
              onRgbColor={handleRgbColor}
            />
            {/* RGB 亮度 */}
            <SettingItemSlider
              title="RGB Brightness"
              subtitle="Set RGB brightness."
              valueFormat={(value) => `${value}%`}
              // onChange={(event) => props.onChange('rgb_brightness', event)}
              onCommitted={(event) => handleRgbBrightness(event)}
              value={props.config.rgb_brightness}
              sx={{ marginTop: 2, }}
              min={0}
              max={100}
              upperLabel
            />
            {/* RGB 模式*/}
            <SettingItemMenu
              title="RGB Style"
              subtitle="Set RGB animation style"
              // onChange={(event) => props.onChange('system', 'rgb_style', event.target.value)}
              onChange={(event) => handleRGBAnimation(event.target.value)}
              value={props.config.rgb_style}
              options={[
                { value: "", label: "None" },
                { value: "solid", label: "Solid" },
                { value: "breathing", label: "Breathing" },
                { value: "flow", label: "Flow" },
                { value: "flow_reverse", label: "Flow Reverse" },
                { value: "rainbow", label: "Rainbow" },
                { value: "rainbow_reverse", label: "Rainbow Reverse" },
                { value: "hue_cycle", label: "Hue Cycle" },
              ]}
            />
            {/* RGB 速度 */}
            <SettingItemSlider
              title="RGB Speed"
              subtitle="Set RGB animation speed"
              valueFormat={(value) => `${value}%`}
              // onChange={(event) => props.onChange('rgb_speed', event)}
              onCommitted={(event) => handleRgbSpeed(event)}
              value={props.config.rgb_speed}
              sx={{ marginTop: 2, }}
              min={0}
              max={100}
              upperLabel
            />
          </>
        }
        {/* RGB点阵 */}
        {
          props.peripherals.includes("rgb_matrix") &&
          <SettingItemList
            primary="RGB Matrix"
            children={
              <>
                {/* RGB点阵开关 */}
                <SettingItemSwitch
                  title="RGB Enabled"
                  subtitle="Enable or disable the RGB Matrix"
                  onChange={(event) => handleToggleRGBMatrix(event)}
                  value={props.config.rgb_matrix_enable} />
                {/*RGB点阵 样式 */}
                <SettingItemMenu
                  title="Animation Style"
                  subtitle="Choose the animation style for the RGB Matrix"
                  onChange={(event) => handleRGBMatrixStyle(event.target.value)}
                  value={props.config.rgb_matrix_style}
                  options={[
                    { value: "solid", label: "Solid" },
                    { value: "breathing", label: "Breathing" },
                    { value: "rainbow", label: "Rainbow" },
                    { value: "rainbow_reverse", label: "Rainbow reverse" },
                    { value: "spin", label: "Spin" },
                    { value: "dual_spin", label: "Dual spin" },
                    { value: "rainbow_spin", label: "Rainbow spin" },
                    { value: "shift_spin", label: "Shift spin" },
                  ]}
                />
                {/* GB点阵 颜色 */}
                {
                  props.config.rgb_matrix_style !== "rainbow" &&
                  props.config.rgb_matrix_style !== "rainbow_reverse" &&
                  props.config.rgb_matrix_style !== "rainbow_spin" &&
                  props.config.rgb_matrix_style !== "shift_spin" &&
                  <SettingItemColorPicker
                    title="Primary Color"
                    subtitle="Select the primary color for the animation"
                    color={props.config.rgb_matrix_color}
                    value={props.config.rgb_matrix_color.replace("#", "")}
                    onRgbColor={handleRGBMatrixColor}
                  />
                }
                {/* GB点阵 颜色2 */}
                {
                  props.config.rgb_matrix_style === "dual_spin" &&
                  props.config.rgb_matrix_style !== "rainbow" &&
                  props.config.rgb_matrix_style !== "rainbow_reverse" &&
                  props.config.rgb_matrix_style !== "rainbow_spin" &&
                  props.config.rgb_matrix_style !== "shift_spin" &&
                  <SettingItemColorPicker
                    title="Secondary Color"
                    subtitle="Select the secondary color for the animation."
                    color={props.config.rgb_matrix_color2}
                    value={props.config.rgb_matrix_color2.replace("#", "")}
                    onRgbColor={handleRGBMatrixReset}
                  />
                }
                {/* RGB点阵速度 */}
                {
                  props.config.rgb_matrix_style !== "solid" &&
                  <SettingItemSlider
                    title="Animation Speed"
                    subtitle="Adjust the speed of the animation"
                    valueFormat={(value) => `${value}%`}
                    onCommitted={(event) => handleRGBMatrixSpeed(event)}
                    value={props.config.rgb_matrix_speed}
                    sx={{ marginTop: 2, }}
                    min={0}
                    max={100}
                    upperLabel
                  />
                }
                {/* RGB点阵亮度 */}
                {
                  props.config.rgb_matrix_style !== "breathing" &&
                  <SettingItemSlider
                    title="Brightness"
                    subtitle="Set the brightness level of the RGB Matrix"
                    valueFormat={(value) => `${value}%`}
                    onCommitted={(event) => handleRGBMatrixBrightness(event)}
                    value={props.config.rgb_matrix_brightness}
                    sx={{ marginTop: 2, }}
                    min={0}
                    max={100}
                    upperLabel
                  />
                }
                <Divider />
              </>
            }
          />
        }
        {/* 风扇 led */}
        {
          props.peripherals.includes("gpio_fan_led") &&
          <SettingItemToggleButton
            title="Fan LED"
            subtitle="Set Fan LED"
            onChange={(event) => handleFanLEDModeCommitted(event.target.value)}
            value={props.config.gpio_fan_led}
            options={[
              { value: 'on', name: 'on' },
              { value: 'off', name: 'off' },
              { value: 'follow', name: 'follow' },
            ]}
          />
        }
        {/* 风扇模式 */}
        {(props.peripherals.includes("spc_fan_power")) &&
          <SettingItemSlider
            title="Fan Power"
            subtitle="Set Fan Power"
            valueFormat={(value) => `${value}%`}
            onCommitted={handleFanModeCommitted}
            value={props.config.fan_power}
            sx={{ marginBottom: 0 }}
            step={25}
            min={0}
            max={100}
            marks
            upperLabel
          />}
        {
          // gpio风扇
          props.peripherals.includes("gpio_fan_mode") &&
          <SettingItemSlider
            title="GPIO Fan Mode"
            subtitle="Set GPIO fan mode"
            valueFormat={(index) => GPIO_FAN_MODES[index].label}
            value={gpioFanModeIndex}
            defaultValue={4 - props.config.gpio_fan_mode}
            onCommitted={handleGPIOFanModeCommitted}
            sx={{ marginBottom: 0 }}
            min={0}
            max={4}
            step={1}
            marks
            upperLabel
          />
        }
        {/* 当前时间 */}
        {props.peripherals.includes("time") &&
          <SettingItemTime
            title="Time"
            subtitle=""
            value={currentTime}
            editable={!props.peripherals.includes("auto_time_enable") || !props.config.auto_time_switch}
            request={props.request}
            onAccept={handleTimeAccepted}
          />}
        {/* 时区选择 */}
        {props.peripherals.includes("timezone") &&
          <SettingItemTimezone
            title="Timezone"
            subtitle=""
            value={props.config.timezone}
            onChange={handleTimezoneChange}
          />}
        {/* 自动设置时间 */}
        {props.peripherals.includes("auto_time_enable") &&
          <SettingItemSwitch
            title="Auto Time Setting"
            value={props.config.auto_time_switch}
            onChange={handleAutoTimeSwitchChange}
          />}
        {/* NTP 服务器 */}
        {props.peripherals.includes("auto_time_enable") &&
          <SettingItemText
            title="NTP Server"
            subtitle=""
            disabled={!props.config.auto_time_switch}
            value={props.config.ntp_server}
            submitable={true}
            onSubmit={handleNTPServerChange}
          />}
        {/* SD 卡占用 */}
        {props.peripherals.includes("sd_card_usage") &&
          <>
            <SettingItemSDCardUsage
              title="Micro SD card usage"
              subtitle=""
              used={props.config.sd_card_used}
              total={props.config.sd_card_total}
            />
            <SettingItemNumber
              width="30%"
              title="SD Data Interval"
              subtitle="Set SD data interval in seconds"
              value={props.config ? props.config.sd_card_data_interval : ""}
              disabled={props.config.sd_card_total === 0}
              min={1}
              max={3600}
              end="S"
              onBlur={handleSDDataIntervalBlur}
            />
            <SettingItemNumber
              width="30%"
              title="SD Data Retain"
              subtitle="Set SD data retain days"
              value={props.config ? props.config.sd_card_data_retain : ""}
              disabled={props.config.sd_card_total === 0}
              min={1}
              max={1000}
              end="Days"
              onBlur={handleSDDataRetainBlur}
            />
          </>
        }
        {/* 邮件设置 */}
        {
          props.peripherals.includes("send_email") &&
          < PopupEmail
            config={props.config}
            sendData={props.sendData}
            onChange={props.onChange}
            showSnackBar={props.showSnackBar}
          />
        }
        {
          <PopupBuzz
            config={props.config}
            sendData={props.sendData}
            onChange={props.onChange}
          />
        }
        {/* 关机百分比 */}
        {props.peripherals.includes("shutdown_percentage") &&
          <SettingItemSlider
            title="Shutdown Strategy"
            subtitle="Shutdown, if no input and battery percentage falls below this."
            valueFormat={(value) => `${value}%`}
            onCommitted={handleShutdownPercentageCommitted}
            value={props.config.shutdown_percentage}
            sx={{ marginTop: 2, }}
            min={10}
            max={100}
            upperLabel
          />}

        {/* 电池测试 */}
        {
          props.peripherals.includes("power-failure-simulation") &&
          <SettingItemButton
            title="Power Failure Simulation"
            subtitle="Simulate a 1-minute power failure and get a UPS performance report."
            onClick={handleBatteryTestPopup}
          />
        }
        {/* 重启设备 */}
        {
          props.peripherals.includes("restart") &&
          <>
            <SettingItemButton
              title="Restart Device"
              subtitle="Simulate a 1-minute power failure and get a UPS performance report."
              onClick={() => {
                props.restartPrompt(
                  'Restart Device',
                  'Do you want to restart device?',
                  props.onCancel
                );
              }}
            />
          </>
        }

        {/* Debug level */}
        {
          props.peripherals.includes("debug_level") &&
          <>
            <Divider />
            <SettingItemMenu
              title="Debug level"
              subtitle="Debug level"
              onChange={(event) => handleDebugLevel(event.target.value)}
              value={props.config.debug_level}
              options={[
                { value: "DEBUG", label: "DEBUG" },
                { value: "INFO", label: "INFO" },
                { value: "WARNING", label: "WARNING" },
                { value: "ERROR", label: "ERROR" },
                { value: "CRITICAL", label: "CRITICAL" },
              ]}
            />
          </>
        }
        {/* Mac地址 */}
        {props.peripherals.includes("mac_address") &&
          <SettingItem
            title="Mac Address"
            // subtitle={props.config.mac_address}
            children={
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                {Object.keys(macData).map((key) => (
                  <Typography key={key}>
                    {key}: {macData[key]}
                  </Typography>
                ))}
              </Box>
            }
          />}
        {/* IP地址 */}
        {props.peripherals.includes("ip_address") &&
          <SettingItem
            title="IP Address"
            // subtitle={props.config.ip_address}
            children={
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                {Object.keys(ipData).map((key) => (
                  <Typography key={key}>
                    {key}: {ipData[key]}
                  </Typography>
                ))}
              </Box>
            }
          />}
        {/* 数据库保留时间 */}
        {
          props.peripherals.includes("history") &&
          <SettingItemText
            title="History Retention"
            subtitle="Set the duration to keep history data"
            type="number"
            end="days"
            width="30%"
            value={props.config.database_retention_days}
            onBlur={handleDatabaseRetention}
          />
        }

        {/* 清除所有数据 */}
        {
          props.peripherals.includes("history") &&
          <>
            <SettingItemButton
              title="Clear All Data"
              subtitle="Clear all history data"
              onClick={handlePopup}
            />
          </>
        }
        {/* 重启服务 */}
        {
          props.peripherals.includes("restart_service") &&
          <>
            <SettingItemButton
              title="Restart service"
              subtitle="Restart service"
              onClick={() => {
                props.restartService(
                  'Restart service',
                  'Do you want to restart service?',
                  props.onCancel
                );
              }}
            />
          </>
        }
      </SectionFrame>
      <PopupFrame title="Warning" onClose={handlePopup} open={popupStatus} width="30rem" >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ margin: "0 1rem 1rem 1rem" }}> Are you sure to clear history data? All histories data will be lost. And this action cannot be undone.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginBottom: "0.5rem" }}>
          <Button variant="contained" color="error" sx={{ width: "28rem" }} onClick={handleClearHistory}>CLEAR ALL HISTORY DATA</Button>
        </Box>
      </PopupFrame>
      {/* 电池 */}
      <PopupPowerFailureSimulation
        request={props.request}
        batteryTestPopup={batteryTestPopup}
        batteryTestStatus={batteryTestStatus}
        sendData={props.sendData}
        handleBatteryTestPopup={handleBatteryTestPopup}
        onBatteryTestStatus={handleBatteryTestStatus}
      />
      {/* OLED弹窗 */}
      <PopupFrame
        title="OLED Layout"
        onClose={handleOLEDLayoutPopup}
        onConfirm={handleDragSave}
        open={OLEDLayouPopup}
        width="30rem"
        button={true}
        cancelText="Cancel"
        confirmText="Save"
      >
        <DataGridPro
          data={oledPages}
          setOLEDPages={sendOLEDPages}
          onDrag={handleDrag}
        />
      </PopupFrame>
    </>
  )
}

export default SectionSystem