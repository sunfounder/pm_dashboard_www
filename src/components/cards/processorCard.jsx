import React, { useState, useEffect } from 'react';
import Card from './card.jsx';
import Chart from './chart.jsx';
import {
  Switch,
  Typography,
} from '@mui/material'
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';

const ProcessorCard = (props) => {
  const theme = useTheme();
  const detail = {
    cores: {
      title: "Cores",
      unit: "",
    },
    frequency: {
      title: "Frequency",
      unit: "GHz",
    },
    cpuUsage: {
      title: "CPU Usage",
      color: theme.palette.processor.main,
      unit: "%",
      min: 0,
      max: 100,
    },
  };
  const [processorChartAmount, setProcessorChartAmount] = useState(false);
  useEffect(() => {
    let multiCore = JSON.parse(window.localStorage.getItem("multiCore") || "true");
    setProcessorChartAmount(multiCore);
  }, []);
  const handleProcessorChartChange = (e) => {
    localStorage.setItem("multiCore", e.target.checked);
    setProcessorChartAmount(e.target.checked);
  }
  const chartNumber = props.data[0] ? props.data[0].cpu_count : 6;
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
  let frequencyDtaa = newData.map(({ cpu_0_percent, cpu_1_percent, cpu_2_percent, cpu_3_percent, cores, frequency, ...rest }) => rest)
  return (
    <Card
      color="processor"
      title="Processor"
      width={4}
      data={newData}
      details={detail}
      chart={
        processorChartAmount ?
          <div className='multipleChartsBox'>
            <div className='chartBos' style={{ gridTemplateColumns: chartNumber === 2 ? "repeat(2, 1fr)" : `repeat(${chartNumber / 2}, 1fr)` }}>
              {Object.values(newDataList).map((value, index) => (
                <Chart key={index} detail={detail} data={value} />
              ))}
            </div>
          </div> : <Chart detail={detail} data={frequencyDtaa} />
      }
      icon={<svg aria-hidden="true" focusable="false" height="2em" fill={theme.palette.iconFg.main} data-prefix="fas" data-icon="microchip" class="svg-inline--fa fa-microchip fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64c-35.3 0-64 28.7-64 64H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v56H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v56H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64c0 35.3 28.7 64 64 64v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h56v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h56v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448c35.3 0 64-28.7 64-64h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V280h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V176h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448c0-35.3-28.7-64-64-64V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H280V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H176V24zM160 128H352c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H160c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32zm192 32H160V352H352V160z"></path></svg>}
      config={<div className='processorCores'>
        <Typography>Show All Cores</Typography>
        <Switch checked={processorChartAmount} onChange={handleProcessorChartChange} color="processor" />
      </div>}
    />
  )
}

export default ProcessorCard;