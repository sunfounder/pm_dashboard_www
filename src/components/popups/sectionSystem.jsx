
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

const SectionSystem = (props) => {
  return (
    <List subheader={<ListSubheader
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
    >
      <Box>SYSTEM</Box>
    </ListSubheader >}>
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
          ]} />
      }
      {/* 关机百分比 */}
      {props.peripherals.includes("shutdown_percentage") &&
        <SettingItemSlider
          title="Shutdown Stratagy"
          subtitle="Send shutdown request, if the battery percentage falls below this and no input power."
          valueFormat={(value) => `${value}%`}
          onChange={(event) => props.onChange('system', 'shutdown_percentage', event.target.value)}
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
          onChange={(event) => props.onChange('system', 'power_off_percentage', event.target.value)}
          value={props.config.power_off_percentage}
          sx={{ marginTop: 2, }}
          min={5}
          max={100}
          step={5}
          marks
        />}
      {/* 当前时间 */}
      {
        props.peripherals.includes("time") &&
        <SettingItemCurrentTime
          title="Current Time"
          subtitle=""
          peripherals={props.peripherals}
          config={props.config}
          request={props.request}
        />
      }
      {/* 时区选择 */}
      {
        props.peripherals.includes("timezone") &&
        <SettingItemTimezone
          title="SettingItemTimezone"
          subtitle=""
          config={props.config}
          onChange={props.onChange}
        />
      }
      {/* 自动设置时间 */}
      {
        props.peripherals.includes("auto_time_enable") &&
        <SettingItemSwitch
          title="Auto Time Setting"
          value={props.config.auto_time_switch}
          // subtitle="Whether to enable Dark Theme mode"
          onChange={(event) => props.onChange('system', 'auto_time_switch', event.target.checked)}
        />
      }
      {
        props.peripherals.includes("auto_time_enable") &&
        <SettingItemNTPServer
          title="NTP Server"
          subtitle=""
          onChange={props.onChange}
          value={props.config.ntp_server}
          sendData={props.sendData}
          disabled={!props.config.auto_time_switch}
        />
      }
      {/* Mac地址 */}
      {props.peripherals.includes("mac_address") &&
        <SettingItem
          title="Mac Address"
          subtitle=""
        >
          <Typography mt={0.5} >{props.config.mac_address}</Typography>
        </SettingItem>}
      {props.peripherals.includes("ip_address") &&
        <SettingItem
          title="IP Address"
          subtitle=""
        >
          <Typography mt={0.5} >{props.config.ip_address}</Typography>
        </SettingItem>}
      {
        props.peripherals.includes("sd_card_usage") &&
        <SettingItemSDCardUsage
          title="Micro SD card usage"
          subtitle=""
          used={props.config.sd_card_used}
          total={props.config.sd_card_total}
        />
      }

    </List >
  )
}

export default SectionSystem