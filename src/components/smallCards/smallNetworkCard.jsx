import React from 'react';
import SmallCard from './smallCard.jsx';
import SmallChart from './smallChart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import LanIcon from '@mui/icons-material/Lan';

const NetworkCard = (props) => {
  const theme = useTheme();
  const detail = {
    type: {
      title: "Type",
      unit: "",
    },
    upSpeed: {
      title: "Speed(Up)",
      unit: "B/s",
      color: theme.palette.network.up,
    },
    downSpeed: {
      title: "Speed(Down)",
      unit: "B/s",
      color: theme.palette.network.down,
    },
  };
  let newData = props.data.map(obj => ({
    timestamp: timeFormatting(obj.time),
    type: obj.network_type,
    upSpeed: obj.network_upload_speed, //可用
    downSpeed: obj.network_download_speed,
  }));
  let chartData = newData.map(({ type, ...rest }) => rest)
  return (
    <SmallCard
      color="network"
      title="Network"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.network.main}
      chart={<>
        <SmallChart detail={detail} data={chartData} />
      </>}
      processorChartAmount={true}
      chartNumber={2}
      icon={<LanIcon sx={{ width: '18px', height: '18px' }} />}
    />
  )
}

export default NetworkCard;