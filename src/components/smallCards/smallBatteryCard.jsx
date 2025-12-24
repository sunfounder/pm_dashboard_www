import React from 'react';
import SmallCard from './smallCard.jsx';
import SmallChart from './smallChart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import BatteryFullIcon from '@mui/icons-material/BatteryFull'; //满电
import Battery80Icon from '@mui/icons-material/Battery80';
import Battery50Icon from '@mui/icons-material/Battery50';
import Battery30Icon from '@mui/icons-material/Battery30';
import Battery1BarIcon from '@mui/icons-material/Battery1Bar';

const BatteryCard = (props) => {
  const theme = useTheme();
  const detail = {
    voltage: {
      title: "Voltage",
      unit: "V",
      color: theme.palette.voltage.main,
    },
    current: {
      title: "Current",
      unit: "A",
      color: theme.palette.current.main,
    },
    power: {
      title: "Power",
      unit: "W",
      color: theme.palette.power.main,
    },
    // percentage: {
    //   title: "Percentage",
    //   unit: "%",
    // },
    // isCharging: {
    //   title: "Charging",
    //   unit: "",
    // },
  };
  let batteryPercentage = 100;
  let rightData;
  let newData = props.data.map(obj => {
    let tmp = {
      timestamp: timeFormatting(obj.time),
    }
    if ('battery_percentage' in obj) {
      // tmp.percentage = obj.battery_percentage;
      batteryPercentage = obj.battery_percentage;
    }
    if ('is_charging' in obj) {
      // tmp.isCharging = obj.is_charging ? "Charging" : "Not charging";
      rightData = obj.is_charging ? "Charging" : "Not charging";
    }
    if ('battery_voltage' in obj) {
      tmp.voltage = obj.battery_voltage / 1000;
    }
    if ('battery_current' in obj) {
      tmp.current = obj.battery_current / 1000;
      tmp.power = tmp.voltage * tmp.current;
    }
    return tmp;
  })
  let chartData = newData.map(({ percentage, isCharging, ...rest }) => rest)
  return (
    <SmallCard
      color="battery"
      title="Battery"
      // title={`Battery ${batteryPercentage}%`}
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.battery.main}
      rightData={rightData}
      chart={<SmallChart
        detail={detail}
        data={chartData}
        min={-30}
        max={30}
      />}
      icon={
        batteryPercentage >= 80 ? <BatteryFullIcon sx={{ width: '18px', height: '18px', color: '#16c60c !important' }} /> :
          batteryPercentage >= 60 ? <Battery80Icon sx={{ width: '18px', height: '18px', color: '#16c60c !important' }} /> :
            batteryPercentage >= 40 ? <Battery50Icon sx={{ width: '18px', height: '18px', color: '#16c60c !important' }} /> :
              batteryPercentage >= 20 ? <Battery30Icon sx={{ width: '18px', height: '18px', color: '#16c60c !important' }} /> :
                <Battery1BarIcon sx={{ width: '18px', height: '18px', color: '#16c60c !important' }} />
      }
    />
  )
}

export default BatteryCard;