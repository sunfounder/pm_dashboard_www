import React from 'react';
import Card from './card.jsx';
import Chart from './chart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';

const MemoryCard = (props) => {
  const theme = useTheme();

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
    detail.used.max = newData[newData.length - 1].total;
  }
  let chartData = newData.map(({ total, percent, ...rest }) => rest);
  return (
    <Card
      color="memory"
      title="Memory"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={theme.palette.memory.main}
      chart={<Chart detail={detail} data={chartData} />}
      icon={<svg aria-hidden="true" focusable="false" height="2em" fill={theme.palette.iconFg.main} data-prefix="fas" data-icon="memory" class="svg-inline--fa fa-memory fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M64 64C28.7 64 0 92.7 0 128v7.4c0 6.8 4.4 12.6 10.1 16.3C23.3 160.3 32 175.1 32 192s-8.7 31.7-21.9 40.3C4.4 236 0 241.8 0 248.6V320H576V248.6c0-6.8-4.4-12.6-10.1-16.3C552.7 223.7 544 208.9 544 192s8.7-31.7 21.9-40.3c5.7-3.7 10.1-9.5 10.1-16.3V128c0-35.3-28.7-64-64-64H64zM576 352H0v64c0 17.7 14.3 32 32 32H80V416c0-8.8 7.2-16 16-16s16 7.2 16 16v32h96V416c0-8.8 7.2-16 16-16s16 7.2 16 16v32h96V416c0-8.8 7.2-16 16-16s16 7.2 16 16v32h96V416c0-8.8 7.2-16 16-16s16 7.2 16 16v32h48c17.7 0 32-14.3 32-32V352zM192 160v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32z"></path></svg>}
    />
  )
}

export default MemoryCard;