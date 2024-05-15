import React, { useState } from "react";
import {
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";

import { Check } from "@mui/icons-material";
import {
  SettingItemText,
  SettingItemNumber,
  SettingItemPassword,
} from "./settingItems.jsx";
import SectionFrame from "./sectionFrame.jsx";

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
    <SectionFrame title='MQTT'
      actions={<>
        {mqttTestState === "loading" && <CircularProgress sx={{ width: "2rem !important", height: "2rem !important" }} />}
        {mqttTestState === "success" && <Check />}
        {mqttTestState === "failed" && <Typography mt={0.5} color='red' >{mqttTestErrorMsg}</Typography>}
        <Button ml={2} onClick={handleTestMQTT}>Test</Button>
      </>
      } >
      <SettingItemText
        title="Host"
        subtitle="MQTT broker host"
        value={props.config ? props.config.host : ""}
        onChange={(event) => props.onChange('host', event)}
      />
      <SettingItemNumber
        title="Port"
        subtitle="MQTT broker port, normally 1883"
        value={props.config ? props.config.port : ""}
        min={1}
        max={65535}
      />
      <SettingItemText
        title="Username"
        subtitle="Username to login to MQTT broker"
        value={props.config ? props.config.username : ""}
        autoComplete="username"
        name="username"
        onChange={(event) => props.onChange('username', event)}
      />
      <SettingItemPassword
        title="Password"
        secondary="Password to login to MQTT broker"
        value={props.config ? props.config.password : ""}
        onChange={(event) => props.onChange('password', event.target.value)}
      />
    </SectionFrame >
  )
}

export default SectionMQTT;