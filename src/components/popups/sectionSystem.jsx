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

  const handleShutdownPercentageCommitted = async (shutdownPercentage) => {
    let result = await props.sendData('set-shutdown-percentage', { 'shutdown-percentage': shutdownPercentage });
    if (result === "OK") {
      props.onChange('system', 'shutdown_percentage', shutdownPercentage);
      return true;
    } else {
      return false;
    }
  }
  const handlePowerOffPercentageCommitted = async (powerOffPercentage) => {
    let result = await props.sendData('set-power-off-percentage', { 'power-off-percentage': powerOffPercentage });
    if (result === "OK") {
      props.onChange('system', 'power_off_percentage', powerOffPercentage);
      return true;
    } else {
      return false;
    }
  }
  const handleTimeChange = async (time) => {
    let result = await props.sendData('set-time', { 'timestamp': time });
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
      props.onChange('system', 'auto_time', enable);
    }
  }
  const handleNTPServerChange = async (ntpServer) => {
    let result = await props.sendData('set-ntp-server', { 'ntp_server': ntpServer });
    if (result === "OK") {
      props.onChange('system', 'ntp_server', ntpServer);
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
          onCommitted={handleShutdownPercentageCommitted}
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
          onCommitted={handlePowerOffPercentageCommitted}
          value={props.config.power_off_percentage}
          sx={{ marginTop: 2, }}
          min={5}
          max={100}
          step={5}
          marks
        />}
      {/* 当前时间 */}
      {props.peripherals.includes("time") &&
        <SettingItemTime
          title="Time"
          subtitle=""
          editable={!props.peripherals.includes("auto_time_enable") || !props.config.auto_time_switch}
          request={props.request}
          onChange={handleTimeChange}
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
    </SectionFrame>
  )
}

export default SectionSystem