
import {
  List,
  ListSubheader,
  Box,
  Typography,
} from '@mui/material';

import {
  SettingItemToggleButton,
  SettingItemSlider,
  SettingItemSwitch,
  SettingItem,
  SettingItemCurrentTime,
  SettingItemTimezone,
  SettingItemNTPServer,
  SettingItemSDCardUsage,
} from "./settingItems.jsx";
import SectionFrame from "./sectionFrame.jsx";

const SectionSystem = (props) => {
  const handleShutdownPercentageChange = async (event) => {
    let result = await props.sendData('set-shutdown-percentage', { 'shutdown-percentage': event.target.value });
    if (result == "OK") {
      props.onChange('system', 'shutdown_percentage', event.target.value);
    }
  }
  const handlePowerOffPercentageChange = async (event) => {
    let result = await props.sendData('set-poweroff-percentage', { 'power-off-percentage': event.target.value });
    if (result == "OK") {
      props.onChange('system', 'poweroff_percentage', event.target.value);
    }
  }
  const handleTimeChange = async (event) => {
    let result = await props.sendData('set-time', { 'timestamp': event.target.value });
    if (result == "OK") {
      props.onChange('system', 'time', event.target.value);
    }
  }
  const handleTimezoneChange = async (event) => {
    let result = await props.sendData('set-timezone', { 'timezone': event.target.value });
    if (result == "OK") {
      props.onChange('system', 'timezone', event.target.value);
    }
  }
  const handleAutoTimeSwitchChange = async (event) => {
    let result = await props.sendData('set-auto-time', { 'enable': event.target.value });
    if (result == "OK") {
      props.onChange('system', 'auto_time', event.target.value);
    }
  }
  const handleNTPServerChange = async (event) => {
    let result = await props.sendData('set-ntp-server', { 'ntp_server': event.target.value });
    if (result == "OK") {
      props.onChange('system', 'ntp_server', event.target.value);
    }
  }
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
          subtitle="Send shutdown request, if the battery percentage falls below this and no input power."
          valueFormat={(value) => `${value}%`}
          onChange={handleShutdownPercentageChange}
          value={props.config.shutdown_percentage}
          sx={{ marginTop: 2, }}
          min={10}
          max={100}
          step={10}
          marks
        />}
      {/* 电池保护 */}
      {props.peripherals.includes("power_off_percentage") &&
        <SettingItemSlider
          title="Power Off Stratagy"
          subtitle="Power off if the battery percentage falls below this."
          valueFormat={(value) => `${value}%`}
          onChange={handlePowerOffPercentageChange}
          value={props.config.power_off_percentage}
          sx={{ marginTop: 2, }}
          min={5}
          max={100}
          step={5}
          marks
        />}
      {/* 当前时间 */}
      {props.peripherals.includes("time") &&
        <SettingItemCurrentTime
          title="Current Time"
          subtitle=""
          editable={!props.peripherals.includes("auto_time_enable") || props.config.auto_time_switch}
          request={props.request}
          onChange={handleTimeChange}
        />}
      {/* 时区选择 */}
      {props.peripherals.includes("timezone") &&
        <SettingItemTimezone
          title="SettingItemTimezone"
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
        <SettingItemNTPServer
          title="NTP Server"
          subtitle=""
          disabled={!props.config.auto_time_switch}
          value={props.config.ntp_server}
          onChange={handleNTPServerChange}
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
    </SectionFrame>
  )
}

export default SectionSystem