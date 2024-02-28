import React, { useEffect, useState, useRef } from 'react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Graph from '../graph';

const MAX_DATA_POINT = 20;

const Chart = (props) => {
  const [chartDatas, setChartDatas] = useState([]);
  const [radius, setRadius] = useState({ innerRadius: 50, outerRadius: 100 })
  const [timestamp, setTimestamp] = useState(null);
  const { data, chartNumber, processorChartAmount } = props;

  useEffect(() => {
    let chartElement = document.getElementsByClassName("chart")[0].offsetWidth;
    let innerRadius = chartElement / 6.5;  //6.5 是大概比例
    let outerRadius = innerRadius * 2;
    setRadius({ innerRadius: innerRadius, outerRadius: outerRadius });
    if (timestamp !== props.data.timestamp) {
      let data = { timestamp: props.data.timestamp };
      Object.keys(props.data).forEach((key) => {
        data[key] = props.data[key];
      });
      let newChartDatas = [...chartDatas, data].slice(-MAX_DATA_POINT);
      setTimestamp(props.data.timestamp);
      setChartDatas(newChartDatas);
    }
  }, [props.data, chartDatas, timestamp]);

  const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;
    const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;
    return toPercent(ratio, 2);
  };

  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0);
    return (
      <div className="customized-tooltip-content">
        <p className="total">{`${label} (Total: ${total})`}</p>
        <ul className="list">
          {payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const COLORS = ['#0088FE', '#00C49F'];
  return <Graph chartNumber={chartNumber} processorChartAmount={processorChartAmount} >
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          fill="#8884d8"
          dataKey="value"
          innerRadius={radius.innerRadius}
          outerRadius={radius.outerRadius}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={renderTooltipContent} />
      </PieChart>
    </ResponsiveContainer>
  </Graph>;
};

export default Chart;