import React from 'react';
import SmallCard from './smallCard.jsx';
import SmallChart from './smallChart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import SimCardIcon from '@mui/icons-material/SimCard';

const MemoryCard = (props) => {
  const theme = useTheme();
  let max = 0;
  const detail = {
    total: {
      title: "Total",
      unit: "B",
    },
    used: {
      title: "Used",
      unit: "B",
      color: theme.palette.memory.main,
      min: 0,
    },
    percent: {
      title: "Percent",
      unit: "%",
    }
  };
  let newData = props.data.map(obj => ({
    timestamp: timeFormatting(obj.time),
    total: obj.memory_total,
    available: obj.memory_available, //可用
    percent: obj.memory_percent,
    used: obj.memory_used,
    free: obj.memory_free,
  }));
  if (newData.length > 0) {
    max = newData[newData.length - 1].total ? newData[newData.length - 1].total : newData[0].total;
  }
  let chartData = newData.map(({ total, percent, ...rest }) => rest);
  return (
    <SmallCard
      color="memory"
      title="Memory"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.memory.main}
      chart={<SmallChart detail={detail} data={chartData} max={max} min={0} />}
      icon={<SimCardIcon sx={{ width: '18px', height: '18px' }} />}
    />
  )
}

export default MemoryCard;