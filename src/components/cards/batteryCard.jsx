import React from 'react';
import Card from './card.jsx';
import Chart from './chart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';

const BatteryCard = (props) => {
  const theme = useTheme();
  const detail = {
    percentage: {
      title: "Percentage",
      unit: "%",
    },
    isCharging: {
      title: "Charging",
      unit: "",
    },
    voltage: {
      title: "Voltage",
      unit: "V",
      color: theme.palette.voltage.main,
      min: -9,
      max: 9,
    },
    current: {
      title: "Current",
      unit: "A",
      color: theme.palette.current.main,
      min: - 5,
      max: 5,
    },
    power: {
      title: "Power",
      unit: "W",
      color: theme.palette.power.main,
      min: -45,
      max: 45,
    }
  };
  let newData = props.data.map(obj => ({
    timestamp: timeFormatting(obj.time),
    percentage: obj.battery_percentage,
    isCharging: obj.is_charging ? "Charging" : "Not charging",
    voltage: obj.battery_voltage / 1000,
    current: obj.battery_current / 1000,
    power: obj.battery_voltage / 1000 * obj.battery_current / 1000,
  }));
  let chartData = newData.map(({ percentage, isCharging, ...rest }) => rest)
  return (
    <Card
      color="battery"
      title="Battery"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.battery.main}
      chart={<Chart detail={detail} data={chartData} />}
      icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512" fill={theme.palette.iconFg.main}><path d="M464 160c8.8 0 16 7.2 16 16V336c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16H464zM80 96C35.8 96 0 131.8 0 176V336c0 44.2 35.8 80 80 80H464c44.2 0 80-35.8 80-80V320c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32V176c0-44.2-35.8-80-80-80H80zm272 96H96V320H352V192z" /></svg>}
    />
  )
}

export default BatteryCard;