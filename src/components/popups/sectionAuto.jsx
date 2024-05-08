import React, { useState } from "react";
import {
  List,
  ListSubheader,
  CircularProgress,
  Box,
  Check,
  Typography,
  Button,
} from "@mui/material";

import {
  SettingItemText,
  SettingItemSlider,
  SettingItemSwitch,
  SettingItemMenu,
} from "./settingItems.jsx";
import SectionFrame from "./sectionFrame.jsx";

const GPIO_FAN_MODES = ['Always On', 'Performance', 'Balanced', 'Quiet', 'OFF'];

const SectionMQTT = (props) => {
  const [mqttTestState, setMqttTestState] = useState("idle");
  const [mqttTestErrorMsg, setMqttTestErrorMsg] = useState("");

  const handleTestMQTT = async () => {
    let sendData = props.config;
    setMqttTestState("loading");
    let data = await props.request("test-mqtt", "GET", sendData);
    if (data && data.status) {
      setMqttTestState("success");
    } else {
      setMqttTestState("failed");
      setMqttTestErrorMsg(data.error);
    }
  }

  return (
    <SectionFrame title='AUTO'>
      {/* 风扇模式 */}
      {props.peripherals.includes("gpio_fan") &&
        <SettingItemSlider
          title="GPIO Fan Mode"
          subtitle="Set GPIO fan mode"
          valueFormat={(value) => GPIO_FAN_MODES[4 - value]}
          onChange={(event) => props.onChange('auto', 'gpio_fan_mode', 4 - event.target.value)}
          value={4 - props.configData.auto.gpio_fan_mode}
          sx={{ marginBottom: 0 }}
          min={0}
          max={4}
          step={1}
          marks
        />}
      {/* rgb设置显示 */}
      {props.peripherals.includes("ws2812") &&
        <>
          <SettingItemSwitch
            title="RGB Enable"
            subtitle="Whether to enable RGB"
            onChange={(event) => props.onChange('auto', 'rgb_enable', event.target.checked)}
            value={props.configData.auto.rgb_enable} />
          <SettingItemText
            title="RGB Color"
            subtitle="Set RGB color"
            value={props.configData.auto.rgb_color.replace("#", "")}
            onChange={(event) => props.onChange('auto', 'rgb_color', event.target.value)}
            start="#"
          />
          <SettingItemSlider
            title="RGB Brightness"
            subtitle="Set RGB brightness."
            valueFormat={(value) => `${value}%`}
            onChange={(event) => props.onChange('auto', 'rgb_brightness', event.target.value)}
            value={props.configData.auto.rgb_brightness}
            sx={{ marginTop: 2, }}
            min={0}
            max={100}
          />
          <SettingItemMenu
            title="RGB Style"
            subtitle="Set RGB animation style"
            onChange={(event) => props.onChange('auto', 'rgb_style', event.target.value)}
            value={props.configData.auto.rgb_style}
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
          <SettingItemSlider
            title="RGB Speed"
            subtitle="Set RGB animation speed"
            valueFormat={(value) => `${value}%`}
            onChange={(event) => props.onChange('auto', 'rgb_speed', event.target.value)}
            value={props.configData.auto.rgb_speed}
            sx={{ marginTop: 2, }}
            min={0}
            max={100}
          />
        </>
      }
    </SectionFrame >
  )
}

export default SectionMQTT;