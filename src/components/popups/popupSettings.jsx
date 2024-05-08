import React, { useState } from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';

import PopupFrame from './popupFrame.jsx';
import SectionSystem from './sectionSystem.jsx';
import SectionMQTT from './sectionMQTT.jsx';
import SectionAuto from './sectionAuto.jsx';
import { SettingItemSwitch } from './settingItems.jsx';


const PopupSettings = (props) => {
  const [themeSwitchChecked, setThemeSwitchChecked] = useState(window.localStorage.getItem("pm-dashboard-theme") === "dark" ? true : false);
  const [hasError, setHasError] = useState({});

  const handleError = (name, error) => {
    if (error) {
      setHasError({ ...hasError, [name]: error });
    } else {
      let newHasError = { ...hasError };
      delete newHasError[name];
      setHasError(newHasError);
    }
  }

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
          config={props.configData.mqtt}
          onChange={handleMQTTChanged}
          onError={handleError}
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
          config={props.configData.system}
          onChange={props.onChange}
          onError={handleError}
          sendData={props.commonProps.sendData}
          request={props.commonProps.request}
          peripherals={props.peripherals}
        />}
    </PopupFrame >
  );
};

export default PopupSettings;