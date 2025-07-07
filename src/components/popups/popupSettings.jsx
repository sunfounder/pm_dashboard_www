import React, { useState, useEffect } from 'react';

import PopupFrame from './popupFrame.jsx';
import SectionSystem from './sectionSystem.jsx';
import SectionMQTT from './sectionMQTT.jsx';
// import SectionAuto from './sectionAuto.jsx';
import { SettingItemSwitch, SettingItem } from './settingItems.jsx';

const VERSIONS = "1.1.0"

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
    "rgb_pin": 10,  // 10,12,21,
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
    "sd_card_total": 1,
    "sd_card_data_interval": 1,
    "sd_card_data_retain": 1,
    "fan_power": 0,
    "gpio_fan_mode": 1,
    "rgb_switch": true,
    "rgb_enable": true,
    "rgb_style": 'breathing',  // 'breath', 'leap', 'flow', 'raise_up', 'colorful'
    "rgb_color": "#0a1aff",
    "rgb_speed": 50, //速度
    "rgb_pwm_frequency": 1000, //频率
    "rgb_pin": 10,  // 10,12,21,
    "oled_enable": true,
    "oled_disk": "total",
    "oled_network_interface": "all",
    "oled_rotation": 0,
    "oled_sleep_timeout": 0,
    "gpio_fan_led": "on",
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
    window.localStorage.setItem("pm-dashboard-theme", theme);
  };

  const handleDarkMode = (checked) => {
    themeSwitching(checked);
  }

  const handleMQTTChanged = (key, value) => {
    // props.onChange('mqtt', key, value);
    handleChanged('mqtt', key, value);
  }
  // const handleAutohanged = (key, value) => {
  //   // props.onChange('auto', key, value);
  //   handleChanged('auto', key, value);
  // }

  const handleChanged = (field, name, value) => {
    let newConfig = { ...config };
    newConfig[field][name] = value;
    setConfig(newConfig);
  };

  const getConfig = async () => {
    const result = await props.request('get-config');
    let newConfig = { ...config };
    if (result) {
      for (let key in result) {
        if (newConfig[key]) {
          newConfig[key] = result[key];
        }
      }
    }
    setConfig(newConfig);
  }

  useEffect(() => {
    getConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open])

  return (
    <PopupFrame title="Settings" onClose={props.onCancel} open={props.open} >
      <SettingItemSwitch
        title="Dark mode"
        subtitle="Whether to enable Dark Theme mode"
        onChange={handleDarkMode}
        value={themeSwitchChecked} />
      <SettingItemSwitch
        title="Show unmounted disk"
        subtitle="Show unmounted disks on Storage card"
        onChange={props.onMountSwitch}
        value={props.mountSwitchChecked} />
      <SettingItemSwitch
        title="Show all cores"
        subtitle="Show all cores on Processor card"
        onChange={props.onProcessorSwitch}
        value={props.processorChartAmount} />
      {
        props.peripherals.includes('battery_voltage') &&
        <SettingItemSwitch
          title="Show battery warning"
          subtitle="Whether to display battery warning"
          onChange={props.onCloseForever}
          value={props.bannerPermanent} />
      }
      {/* 版本号versions */}
      <SettingItem
        title="Web UI Version"
        subtitle={VERSIONS}
      />
      {/* Auto */}
      {/* {props.peripherals.includes("auto") && */}
      {/* {props.peripherals.includes("ws2812") &&
        <SectionAuto
          config={config.auto}
          onChange={handleAutohanged}
          sendData={props.sendData}
        >
        </SectionAuto>} */}
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
        props.peripherals.includes("ws2812") ||
        props.peripherals.includes("oled") ||
        props.peripherals.includes("sd_card_usage")) &&
        <SectionSystem
          config={config.system}
          showSnackBar={props.showSnackBar}
          onChange={handleChanged}
          sendData={props.sendData}
          showAlert={props.showAlert}
          request={props.request}
          peripherals={props.peripherals}
          restartPrompt={props.restartPrompt}
          latestData={props.latestData}
          onTemperatureUnitChanged={props.onTemperatureUnitChanged}
        />}
    </PopupFrame >
  );
};

export default PopupSettings;