import React, { useState, useEffect } from 'react';

import PopupFrame from './popupFrame.jsx';
import SectionSystem from './sectionSystem.jsx';
import SectionMQTT from './sectionMQTT.jsx';
import SectionAuto from './sectionAuto.jsx';
import { SettingItemSwitch } from './settingItems.jsx';

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

const PopupSettings = (props) => {
  const [config, setConfig] = useState(defaultConfigData);
  const [themeSwitchChecked, setThemeSwitchChecked] = useState(window.localStorage.getItem("pm-dashboard-theme") === "dark" ? true : false);

  const themeSwitching = (isDark) => {
    let theme;
    if (isDark) {
      theme = "dark";
    } else {
      theme = "light";
    }
    props.onModeChange(theme);
    setThemeSwitchChecked(isDark);
    window.localStorage.setItem("PMTheme", theme);
  };

  const handleDarkMode = (e) => {
    themeSwitching(e.target.checked);
  }

  const handleMQTTChanged = (key, value) => {
    props.onChange('mqtt', key, value);
  }

  const handleChanged = (field, name, value) => {
    console.log("handleChangeConfig field", field, "name", name, "value", value);
    let newConfig = { ...config };
    newConfig[field][name] = value;
    setConfig(newConfig);
  };

  const getConfig = async () => {
    const newConfig = await props.request('get-config');
    console.log('newConfig', newConfig);
    setConfig(newConfig);
  }

  useEffect(() => {
    getConfig();
  }, [props.open])

  return (
    <PopupFrame title="Settings" onClose={props.onCancel} open={props.open} >
      <SettingItemSwitch
        title="Dark mode"
        subtitle="Whether to enable Dark Theme mode"
        onChange={handleDarkMode}
        value={themeSwitchChecked} />
      {/* Auto */}
      {props.peripherals.includes("auto") &&
        <SectionAuto></SectionAuto>}
      {/* MQTT */}
      {props.peripherals.includes("mqtt") &&
        <SectionMQTT
          config={config.mqtt}
          onChange={handleMQTTChanged}
        />}
      {/* System */}
      {(props.peripherals.includes("shutdown_percentage") ||
        props.peripherals.includes("power_off_percentage") ||
        props.peripherals.includes("time") ||
        props.peripherals.includes("timezone") ||
        props.peripherals.includes("auto_time_enable") ||
        props.peripherals.includes("mac_address") ||
        props.peripherals.includes("ip_address") ||
        props.peripherals.includes("sd_card_usage")) &&
        <SectionSystem
          config={config.system}
          onChange={handleChanged}
          sendData={props.sendData}
          request={props.request}
          peripherals={props.peripherals}
        />}
    </PopupFrame >
  );
};

export default PopupSettings;