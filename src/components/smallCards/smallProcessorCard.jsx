import React, { useState, useEffect } from 'react';
import SmallCard from './smallCard.jsx';
import SmallChart from './smallChart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import MemoryIcon from '@mui/icons-material/Memory';

const ProcessorCard = (props) => {
  const theme = useTheme();
  const detail = {
    cores: {
      title: "Cores",
      unit: "",
    },
    frequency: {
      title: "Frequency",
      unit: "MHz",
    },
    cpuUsage: {
      title: "CPU Usage",
      color: theme.palette.processor.main,
      unit: "%",
      min: 0,
      max: 100,
    },
  };
  const chartNumber = props.data[0] ? props.data[0].cpu_count : 0;
  // 修改detail数据
  for (let i = 0; i < chartNumber; i++) {
    const cpuPercentKey = `cpu_${i}_percent`;
    detail[cpuPercentKey] = {
      title: cpuPercentKey,
      unit: "%",
      hide: true,  //表示在卡片上只显示图表不显示文字信息
      color: theme.palette.processor.main,
      min: 0,
      max: 100,
    };
  }
  // 重组数据
  let newData = props.data.map(obj => {
    let data = {
      timestamp: timeFormatting(obj.time),
      cores: obj.cpu_count,
      frequency: obj.cpu_freq,
    };

    let totalCpuPercent = 0;
    Array.from({ length: chartNumber }).forEach((_, index) => {
      const cpuPercentKey = `cpu_${index}_percent`;
      if (obj[cpuPercentKey] !== undefined) {
        data[cpuPercentKey] = obj[cpuPercentKey];
        totalCpuPercent += obj[cpuPercentKey];
      }
    });
    if (chartNumber > 0) {
      data["cpuUsage"] = totalCpuPercent / chartNumber;
    } else {
      data["cpuUsage"] = 0;
    }
    return data;
  });
  const newDataList = [];
  for (let i = 0; i < chartNumber; i++) {
    const cpuPercentKeyToInclude = `cpu_${i}_percent`;
    const newDataSubset = newData.map(obj => ({
      timestamp: obj.timestamp,
      [cpuPercentKeyToInclude]: obj[cpuPercentKeyToInclude],
    }));
    newDataList.push(newDataSubset);
  }
  let frequencyData = newData.map(({ cpu_0_percent, cpu_1_percent, cpu_2_percent, cpu_3_percent, cores, frequency, ...rest }) => rest);
  return (
    <SmallCard
      color="processor"
      title="Processor"
      width={4}
      data={newData}
      details={detail}
      // chart={
      //   props.processorChartAmount ?
      //     <div className='multipleChartsBox'>
      //       <div className='chartBos' style={{ gridTemplateColumns: chartNumber === 2 ? "repeat(2, 1fr)" : `repeat(${chartNumber / 2}, 1fr)` }}>
      //         {Object.values(newDataList).map((value, index) => (
      //           <SmallChart key={index} detail={detail} data={value} min={0} max={100} />
      //         ))}
      //       </div>
      //     </div> : <SmallChart detail={detail} data={frequencyData} min={0} max={100} />
      // }
      chart={
        <SmallChart detail={detail} data={frequencyData} min={0} max={100} />
      }
      icon={<MemoryIcon sx={{ width: '18px', height: '18px' }} />}
    />
  )
}

export default ProcessorCard;