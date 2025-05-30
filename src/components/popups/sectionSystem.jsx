import React, { useState, useEffect } from 'react';
import {
  ListItem,
  Button,
  Box,
  Typography,
  IconButton,
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
  SettingItemButton
} from "./settingItems.jsx";
import PopupFrame from './popupFrame.jsx';
import SectionFrame from "./sectionFrame.jsx";
import PopupPowerFailureSimulation from "./popupPowerFailureSimulation.jsx";
import ColorWheel from "./colorWheel.jsx";
import { Circle } from '@mui/icons-material';
// const GPIO_FAN_MODES = ['Always On', 'Performance', 'Balanced', 'Quiet', 'OFF'];
const GPIO_FAN_MODES = [
  { value: 4, label: 'Quiet' },
  { value: 3, label: 'Balanced' },
  { value: 2, label: 'Cool' },
  { value: 1, label: 'Performance' },
  { value: 0, label: 'Always On' },
]

const SectionSystem = (props) => {
  const [colorDiskPopup, setColorDiskPopup] = useState(false);
  const [gpioFanModeIndex, setGpioFanModeIndex] = useState(4 - props.config.gpio_fan_mode);
  const [popupStatus, setPopupStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [oledDiskList, setOledDiskList] = useState([
    { value: "total", label: "Total" },
  ]);
  const [oledNetworkInterfaceList, setOledNetworkInterfaceList] = useState([
    { value: "all", label: "All" },
  ])
  const [batteryTest, setBatteryTest] = useState(false);

  const handleColorDiskPopup = () => {
    setColorDiskPopup(!colorDiskPopup);
  }

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
    setBatteryTest(!batteryTest);
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

  const handleOledDiskList = async (event) => {
    let result = await props.sendData('set-oled-disk', { 'disk': event });
    if (result === "OK") {
      props.onChange('system', 'oled_disk', event);
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

  const handleOledNetworkInterfaceList = async (event) => {
    let result = await props.sendData('set-oled-network-interface', { 'interface': event });
    if (result === "OK") {
      props.onChange('system', 'oled_network_interface', event);
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

  const handleColorChange = (newColor) => {
    let color = newColor.replace("#", "");
    handleRgbColor(color);
  }

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
          <>
            {/* oled开关 */}
            <SettingItemSwitch
              title="OLED Enable"
              subtitle="Whether to enable OLED"
              onChange={(event) => handleToggleOLEDEnabled(event)}
              value={props.config.oled_enable} />
            {/* Disk 磁盘选项 */}
            <SettingItemMenu
              title="OLED Disk"
              subtitle="Set OLED disk"
              onChange={(event) => handleOledDiskList(event.target.value)}
              value={props.config.oled_disk}
              options={oledDiskList}
            />
            {/*OLED显示网络接口 */}
            <SettingItemMenu
              title="OLED Network Interface"
              subtitle="Set Network Interface"
              onChange={(event) => handleOledNetworkInterfaceList(event.target.value)}
              value={props.config.oled_network_interface}
              options={oledNetworkInterfaceList}
            />
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
          </>
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
            <SettingItemText
              title="RGB Color"
              subtitle="Set RGB color"
              value={props.config.rgb_color.replace("#", "")}
              // onChange={(event) => props.onChange('rgb_color', event)}
              onBlur={(event) => handleRgbColor(event.target.value)}
              start="#"
              children={
                <IconButton aria-label="color-picker" onClick={handleColorDiskPopup}>
                  <Circle sx={{ color: props.config.rgb_color?.startsWith('#') ? props.config.rgb_color : `#${props.config.rgb_color}` }} />
                </IconButton>
              }
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
        {/* 关机百分比 */}
        {props.peripherals.includes("shutdown_percentage") &&
          <SettingItemSlider
            title="Shutdown Stratagy"
            subtitle="Shutdown, if no input and battery percentage falls below this."
            valueFormat={(value) => `${value}%`}
            onCommitted={handleShutdownPercentageCommitted}
            value={props.config.shutdown_percentage}
            sx={{ marginTop: 2, }}
            min={10}
            max={100}
            upperLabel
          />}
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
        {/* 清除所有数据 */}
        {
          props.peripherals.includes("clear_history") &&
          <SettingItemButton
            title="Clear All Data"
            subtitle="Clear all history data"
            color="error"
            variant="contained"
            onClick={handlePopup}
            buttonText="Clear"
          />
        }
        {/* Mac地址 */}
        {props.peripherals.includes("mac_address") &&
          <SettingItem
            title="Mac Address"
            subtitle={props.config.mac_address}
          />}
        {/* IP地址 */}
        {props.peripherals.includes("ip_address") &&
          <SettingItem
            title="IP Address"
            subtitle={props.config.ip_address}
          />}
        {/* 电池测试 */}
        {
          props.peripherals.includes("power-failure-simulation") &&
          <SettingItemButton
            title="Power Failure Simulation"
            subtitle="Simulate a 1-minute power failure and get a UPS performance report."
            color="primary"
            variant="contained"
            onClick={handleBatteryTestPopup}
            buttonText="Test"
          />
        }
        {/* 重启设备 */}
        {
          props.peripherals.includes("restart") &&
          <ListItem>
            <Button
              variant='outlined'
              color="error"
              onClick={() => {
                props.restartPrompt(
                  'Restart Device',
                  'Do you want to restart device?',
                  props.onCancel
                );
              }}
              sx={{ width: '100%' }} >
              Restart
            </Button>
          </ListItem>}
      </SectionFrame>
      <PopupFrame title="ColorPicker" onClose={handleColorDiskPopup} open={colorDiskPopup} width="24rem">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: "2rem" }}>
          <ColorWheel onColorChange={handleColorChange} color={props.config.rgb_color}></ColorWheel>
        </Box>
      </PopupFrame>
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
        batteryTest={batteryTest}
        sendData={props.sendData}
        handleBatteryTestPopup={handleBatteryTestPopup}
      />
    </>
  )
}

export default SectionSystem