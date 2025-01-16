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

const gpuDetail = {
  title: "GPU",
  unit: "",
}

const FanCard = (props) => {
  const theme = useTheme();
  let detail = {
    cpu_temperature: {
      // title: "Temperature",
      title: "CPU",
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
    // if (props.unit === "F" && obj.cpu_temperature) {
    if (obj.cpu_temperature) {
      if (props.unit === "F") {
        temperature = celciusToFahrenheit(obj.cpu_temperature);
        tmp.cpu_temperature = temperature;
      } else {
        tmp.cpu_temperature = obj.cpu_temperature;
      }
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
    if ("gpu_temperature" in obj) {
      tmp.gpu_temperature = obj.gpu_temperature;
      detail.gpu_temperature = gpuDetail;
      gpuDetail.unit = props.unit ? (props.unit === "C" ? "℃" : "℉") : "℃";
      gpuDetail.color = theme.palette.power.main;
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
      // title="Fan"
      title="Temperature"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.fan.main}
      chart={<Chart detail={detail} data={chartData} />}
      // icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" fill={theme.palette.iconFg.main}><path d="M258.6 0c-1.7 0-3.4 .1-5.1 .5C168 17 115.6 102.3 130.5 189.3c2.9 17 8.4 32.9 15.9 47.4L32 224H29.4C13.2 224 0 237.2 0 253.4c0 1.7 .1 3.4 .5 5.1C17 344 102.3 396.4 189.3 381.5c17-2.9 32.9-8.4 47.4-15.9L224 480v2.6c0 16.2 13.2 29.4 29.4 29.4c1.7 0 3.4-.1 5.1-.5C344 495 396.4 409.7 381.5 322.7c-2.9-17-8.4-32.9-15.9-47.4L480 288h2.6c16.2 0 29.4-13.2 29.4-29.4c0-1.7-.1-3.4-.5-5.1C495 168 409.7 115.6 322.7 130.5c-17 2.9-32.9 8.4-47.4 15.9L288 32V29.4C288 13.2 274.8 0 258.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>}
      icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512" fill={theme.palette.iconFg.main}><path d="M160 64c-26.5 0-48 21.5-48 48l0 164.5c0 17.3-7.1 31.9-15.3 42.5C86.2 332.6 80 349.5 80 368c0 44.2 35.8 80 80 80s80-35.8 80-80c0-18.5-6.2-35.4-16.7-48.9c-8.2-10.6-15.3-25.2-15.3-42.5L208 112c0-26.5-21.5-48-48-48zM48 112C48 50.2 98.1 0 160 0s112 50.1 112 112l0 164.4c0 .1 .1 .3 .2 .6c.2 .6 .8 1.6 1.7 2.8c18.9 24.4 30.1 55 30.1 88.1c0 79.5-64.5 144-144 144S16 447.5 16 368c0-33.2 11.2-63.8 30.1-88.1c.9-1.2 1.5-2.2 1.7-2.8c.1-.3 .2-.5 .2-.6L48 112zM208 368c0 26.5-21.5 48-48 48s-48-21.5-48-48c0-20.9 13.4-38.7 32-45.3l0-50.7c0-8.8 7.2-16 16-16s16 7.2 16 16l0 50.7c18.6 6.6 32 24.4 32 45.3z" /></svg>}
    />
  )
}

export default FanCard;