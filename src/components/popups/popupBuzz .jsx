import React, { useState, useEffect } from 'react';
import { Divider, IconButton } from '@mui/material';
import PopupFrame from './popupFrame.jsx';
import {
  SettingItemList,
  SettingItemSwitch,
  SettingItemButton,
  SettingItemSlider,
} from './settingItems.jsx';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const PopupBuzz = (props) => {
  const [buzzPopup, setbuzzPopup] = useState(false);
  const [buzzList, setbuzzList] = useState({
    battery_activated: false,
    low_battery: false,
    power_disconnected: false,
    power_restored: false,
    power_insufficient: false,
    battery_critical_shutdown: false,
    battery_voltage_critical_shutdown: false,
  });
  const [buzzVolume, setbuzzVolume] = useState(5);

  useEffect(() => {
    if (props.config.pipower5_buzz_on) {
      const updatedbuzzList = { ...buzzList };
      props.config.pipower5_buzz_on.forEach((setting) => {
        if (updatedbuzzList.hasOwnProperty(setting)) {
          updatedbuzzList[setting] = true;
        }
      });
      setbuzzList(updatedbuzzList);
      setbuzzVolume(props.config.pipower5_buzzer_volume);
    }
  }, [props.config.pipower5_buzz_on]);


  const handleToggle = (setting) => {
    console.log('Toggled buzz setting:', buzzList);
    setbuzzList((prevState) => ({
      ...prevState,
      [setting]: !prevState[setting],
    }));
  };

  const handlebuzzPopup = () => {
    setbuzzPopup(!buzzPopup);
  }

  const getActiveSettings = () => {
    const activeSettings = Object.entries(buzzList)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    return activeSettings;
  };

  const handleSave = async () => {
    const buzzListList = getActiveSettings();
    console.log('Saving buzz settings', buzzListList);
    let result = await props.sendData('set-pipower5-buzz-on', { 'on': buzzListList });
    if (result === "OK") {
      props.onChange('system', 'set-pipower5-buzz-on', buzzListList);
    }
    handlebuzzPopup();
  }

  const handlePlay = async (value) => {
    console.log(value);
    let result = await props.sendData('play-pipower5-buzzer', { 'event': value });
    if (result === "OK") {
      // props.onChange('system', 'play-pipower5-buzzer', true);
      console.log('Buzzer played');
    }
  }

  const handleBuzzVolumeChange = async (value) => {
    let result = await props.sendData('set-pipower5-buzzer-volume', { 'volume': value });
    if (result === "OK") {
      props.onChange('system', 'pipower5_buzzer_volume', value);
      setbuzzVolume(value);
    };
  }

  return (
    <>
      <SettingItemList
        primary="Buzzer"
        children={
          <>
            <SettingItemButton
              title="Buzzer on"
              subtitle="Select events that trigger buzzer"
              onClick={handlebuzzPopup}
            />
            <SettingItemSlider
              title="Buzzer Volume"
              subtitle="Set buzzer volume"
              valueFormat={(value) => `${value}%`}
              onCommitted={handleBuzzVolumeChange}
              // value={props.config.pipower5_buzzer_volume}
              value={buzzVolume}
              sx={{ marginTop: 2, }}
              min={0}
              max={10}
              upperLabel
            />
            <Divider />
          </>
        }
      />
      <PopupFrame
        title="Buzzer on"
        onClose={handlebuzzPopup}
        onConfirm={handleSave}
        open={buzzPopup}
        width="40rem"
        button={true}
        cancelText="Cancel"
        confirmText="Save"
      >
        <SettingItemSwitch
          title="Battery Activated"
          subtitle="on battery is activated"
          onChange={() => handleToggle('battery_activated')}
          children={
            <IconButton onClick={() => handlePlay('battery_activated')}>
              <PlayCircleOutlineIcon />
            </IconButton>
          }
          value={buzzList.battery_activated} />
        <SettingItemSwitch
          title="Low Battery"
          subtitle="on battery level is low"
          onChange={() => handleToggle('low_battery')}
          children={
            <IconButton onClick={() => handlePlay('low_battery')}>
              <PlayCircleOutlineIcon />
            </IconButton>
          }
          value={buzzList.low_battery} />
        <SettingItemSwitch
          title="Power Disconnected"
          subtitle="on external power supply is disconnected"
          onChange={() => handleToggle('power_disconnected')}
          children={
            <IconButton onClick={() => handlePlay('power_disconnected')}>
              <PlayCircleOutlineIcon />
            </IconButton>
          }
          value={buzzList.power_disconnected} />
        <SettingItemSwitch
          title="Power Restored"
          subtitle="on external power supply is restored"
          onChange={() => handleToggle('power_restored')}
          children={
            <IconButton onClick={() => handlePlay('power_restored')}>
              <PlayCircleOutlineIcon />
            </IconButton>
          }
          value={buzzList.power_restored} />
        <SettingItemSwitch
          title="Power Insufficient"
          subtitle="on the external power supply is insufficient"
          onChange={() => handleToggle('power_insufficient')}
          children={
            <IconButton onClick={() => handlePlay('power_insufficient')}>
              <PlayCircleOutlineIcon />
            </IconButton>
          }
          value={buzzList.power_insufficient} />

        <SettingItemSwitch
          title="Battery Critical Shutdown"
          subtitle="on device shutdown due to critically low battery"
          onChange={() => handleToggle('battery_critical_shutdown')}
          children={
            <IconButton onClick={() => handlePlay('battery_critical_shutdown')}>
              <PlayCircleOutlineIcon />
            </IconButton>
          }
          value={buzzList.battery_critical_shutdown} />

        <SettingItemSwitch
          title="Battery Voltage Critical Shutdown"
          subtitle="on device shutdown due to critically low battery voltage"
          onChange={() => handleToggle('battery_voltage_critical_shutdown')}
          children={
            <IconButton onClick={() => handlePlay('battery_voltage_critical_shutdown')}>
              <PlayCircleOutlineIcon />
            </IconButton>
          }
          value={buzzList.battery_voltage_critical_shutdown} />
      </PopupFrame>
    </>
  )
}

export default PopupBuzz;