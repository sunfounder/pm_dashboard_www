import React from 'react';
import SmallCard from './smallCard.jsx';
import SmallChart from './smallChart.jsx';
import { timeFormatting, celciusToFahrenheit } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const gpuDetail = {
  title: "GPU",
  unit: "",
}

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

const MIN = {
  "C": 0,
  "F": 32,
}

const MAX = {
  "C": 100,
  "F": 212,
}

const TemperatureCard = (props) => {
  const theme = useTheme();
  let detail = {
    cpu_temperature: {
      title: "CPU",
      unit: props.unit ? (props.unit === "C" ? "℃" : "℉") : "℃",
      color: theme.palette.temperature.cpu,
    },
  }
  let newData = props.data.map(obj => {
    let tmp = {
      timestamp: timeFormatting(obj.time),
    }
    if (obj.cpu_temperature) {
      if (props.unit === "F") {
        let temperature = obj.cpu_temperature ? celciusToFahrenheit(obj.cpu_temperature) : null;
        tmp.cpu_temperature = temperature;
      } else {
        tmp.cpu_temperature = obj.cpu_temperature;
      }
    }
    if ("gpu_temperature" in obj) {
      tmp.gpu_temperature = obj.gpu_temperature;
      detail.gpu_temperature = gpuDetail;
      detail.gpu_temperature.unit = props.unit ? (props.unit === "C" ? "℃" : "℉") : "℃";
      detail.gpu_temperature.color = theme.palette.temperature.gpu;

    }
    if (obj.gpu_temperature) {
      if (props.unit === "F") {
        let temperature = obj.gpu_temperature ? celciusToFahrenheit(obj.gpu_temperature) : null;
        tmp.gpu_temperature = temperature;
      } else {
        tmp.gpu_temperature = obj.gpu_temperature;
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
    return tmp;
  });

  let chartData = newData;
  chartData = newData.map(({ state, mode, power, speed, ...rest }) => rest)

  return (
    <SmallCard
      color="temperature"
      title="Temperature"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.temperature.main}
      chart={<SmallChart detail={detail} data={chartData} min={MIN[props.unit]} max={MAX[props.unit]} />}
      icon={<ThermostatIcon sx={{ width: '18px', height: '18px', color: '#f03a17 !important' }} />}
    />
  )
}

export default TemperatureCard;