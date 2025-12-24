import React from 'react';
import SmallCard from './smallCard.jsx';
import SmallChart from './smallChart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';

const ExternalInputCard = (props) => {
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
    // isPluggedIn: {
    //   title: "Status",
    //   unit: "",
    // },
  };
  let rightData;
  let newData = props.data.map(obj => {
    let tmp = {
      timestamp: timeFormatting(obj.time),
    }
    if ('is_input_plugged_in' in obj) {
      // tmp.isPluggedIn = obj.is_input_plugged_in ? "Plugged in" : "Unplugged";
      rightData = obj.is_input_plugged_in ? "Plugged in" : "Unplugged";
    }
    if ('input_voltage' in obj) {
      tmp.voltage = obj.input_voltage / 1000;
    }
    if ('input_current' in obj) {
      tmp.current = obj.input_current / 1000;
      tmp.power = tmp.voltage * tmp.current;
    }
    return tmp;
  });

  let chartData = newData.map(({ isPluggedIn, ...rest }) => rest);
  return (
    <SmallCard
      title="Input"
      color="externalInput"
      width={4}
      data={newData}
      details={detail}
      rightData={rightData}
      iconBoxColor={theme.palette.externalInput.main}
      chart={<SmallChart detail={detail} data={chartData} />}
      icon={<SettingsInputHdmiIcon sx={{ width: '18px', height: '18px' }} />}
    >
    </SmallCard>
  )
}

export default ExternalInputCard;