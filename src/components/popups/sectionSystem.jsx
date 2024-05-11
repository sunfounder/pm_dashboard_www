import React, { useEffect } from 'react';
import {
  ListItem,
  Button,
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
} from "./settingItems.jsx";
import SectionFrame from "./sectionFrame.jsx";

const SectionSystem = (props) => {
  const [currentTime, setCurrentTime] = React.useState(0);

  const handleShutdownPercentageCommitted = async (shutdownPercentage) => {
    let result = await props.sendData('set-shutdown-percentage', { 'shutdown-percentage': shutdownPercentage });
    if (result === "OK") {
      props.onChange('system', 'shutdown_percentage', shutdownPercentage);
      return true;
    } else {
      return false;
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
  const getCurrentTime = async () => {
    const newCurrentTime = await props.request("get-timestamp");
    if (newCurrentTime && newCurrentTime !== currentTime) {
      setCurrentTime(newCurrentTime);
    }
  }
  useEffect(() => {
    getCurrentTime();
    const interval = setInterval(() => {
      getCurrentTime();
    }, 5000);
    return () => clearInterval(interval);
  }, [props.open, props.config.timezone, props.config.auto_time_switch, props.config.ntpServer]);

  return (
    <SectionFrame title="System">
      {/* 温度单位 */}
      {props.peripherals.includes("temperature_unit") &&
        <SettingItemToggleButton
          title="Temperature Unit"
          subtitle="Set prefer temperature unit"
          onChange={(event) => props.onChange('system', 'temperature_unit', event.target.value)}
          value={props.config.temperature_unit}
          options={[
            { value: 'C', name: 'Celius' },
            { value: 'F', name: 'Fahrenheit' },
          ]}
        />}
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
        />}
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
        <SettingItemSDCardUsage
          title="Micro SD card usage"
          subtitle=""
          used={props.config.sd_card_used}
          total={props.config.sd_card_total}
        />}
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
      {/* 重启设备 */}
      {props.peripherals.includes("restart") &&
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
  )
}

export default SectionSystem