import React from 'react';
import Card from './card.jsx';
import Chart from './chart.jsx';
import { timeFormatting, celciusToFahrenheit } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';

const powerDetail = {
  title: "Percentage",
  unit: "%",
};
const speedDetail = {
  title: "CPU Fan Speed",
  unit: "RPM",
};
const stateDetail = {
  title: "GPIO Fan State",
  unit: "",
};

const FanCard = (props) => {
  const theme = useTheme();
  let detail = {
    cpu_temperature: {
      title: "Temperature",
      unit: props.unit ? (props.unit === "C" ? "℃" : "℉") : "℃",
      color: theme.palette.temperature.main,
      min: 0,
      max: 100,
    },
  }
  let newData = props.data.map(obj => {
    let tmp = {
      timestamp: timeFormatting(obj.time),
    }
    let temperature = obj.cpu_temperature;
    if (props.unit === "F" && obj.cpu_temperature) {
      temperature = celciusToFahrenheit(obj.cpu_temperature);
      tmp.cpu_temperature = temperature;
    }

    if ("pwm_fan_speed" in obj) {
      tmp.speed = obj.pwm_fan_speed;
      detail.speed = speedDetail;
    }
    if ("spc_fan_power" in obj) {
      tmp.power = obj.spc_fan_power;
      detail.power = powerDetail;
    }
    if ("fan_power" in obj) {
      tmp.power = obj.fan_power;
      detail.power = powerDetail;
    }
    if ("gpio_fan_state" in obj) {
      tmp.state = obj.gpio_fan_state === 1 ? "ON" : "OFF";
      detail.state = stateDetail;
    }
    return tmp;
  });

  let chartData = newData;
  // let chartData = newData.map(({ state, mode, power, ...rest }) => rest)
  if (newData.length > 0 && !newData[0].cpu_temperature) {
    detail.cpu_temperature = {
      title: "Power",
      unit: "%",
      color: theme.palette.temperature.main,
      min: 0,
      max: 100,
    }
    chartData = newData.map(({ state, mode, ...rest }) => rest)
  } else {
    chartData = newData.map(({ state, mode, power, ...rest }) => rest)
  }


  return (
    <Card
      color="fan"
      title="Fan"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.fan.main}
      chart={<Chart detail={detail} data={chartData} />}
      icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" fill={theme.palette.iconFg.main}><path d="M258.6 0c-1.7 0-3.4 .1-5.1 .5C168 17 115.6 102.3 130.5 189.3c2.9 17 8.4 32.9 15.9 47.4L32 224H29.4C13.2 224 0 237.2 0 253.4c0 1.7 .1 3.4 .5 5.1C17 344 102.3 396.4 189.3 381.5c17-2.9 32.9-8.4 47.4-15.9L224 480v2.6c0 16.2 13.2 29.4 29.4 29.4c1.7 0 3.4-.1 5.1-.5C344 495 396.4 409.7 381.5 322.7c-2.9-17-8.4-32.9-15.9-47.4L480 288h2.6c16.2 0 29.4-13.2 29.4-29.4c0-1.7-.1-3.4-.5-5.1C495 168 409.7 115.6 322.7 130.5c-17 2.9-32.9 8.4-47.4 15.9L288 32V29.4C288 13.2 274.8 0 258.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>}
    />
  )
}

export default FanCard;