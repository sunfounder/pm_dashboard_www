import React from "react";
import {
  SettingItemText,
  SettingItemSlider,
  SettingItemSwitch,
  SettingItemMenu,
} from "./settingItems.jsx";
import SectionFrame from "./sectionFrame.jsx";

const GPIO_FAN_MODES = ['Always On', 'Performance', 'Balanced', 'Quiet', 'OFF'];

const SectionMQTT = (props) => {
  return (
    <SectionFrame title='AUTO'>

      {/* rgb设置显示 */}
      {
        <>
          <SettingItemSwitch
            title="RGB Enable"
            subtitle="Whether to enable RGB"
            onChange={(event) => props.onChange('rgb_enable', event)}
            value={props.config.rgb_enable} />
          <SettingItemText
            title="RGB Color"
            subtitle="Set RGB color"
            value={props.config.rgb_color.replace("#", "")}
            onChange={(event) => props.onChange('rgb_color', event)}
            start="#"
          />
          <SettingItemSlider
            title="RGB Brightness"
            subtitle="Set RGB brightness."
            valueFormat={(value) => `${value}%`}
            onChange={(event) => props.onChange('rgb_brightness', event)}
            value={props.config.rgb_brightness}
            sx={{ marginTop: 2, }}
            min={0}
            max={100}
          />
          <SettingItemMenu
            title="RGB Style"
            subtitle="Set RGB animation style"
            onChange={(event) => props.onChange('rgb_style', event.target.value)}
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
          <SettingItemSlider
            title="RGB Speed"
            subtitle="Set RGB animation speed"
            valueFormat={(value) => `${value}%`}
            onChange={(event) => props.onChange('rgb_speed', event)}
            value={props.config.rgb_speed}
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