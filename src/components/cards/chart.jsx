import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatBytes } from '../../js/utils.js';
import Graph from './graph.jsx';
import { useTheme } from '@mui/material/styles';

const Chart = (props) => {
  const theme = useTheme();
  const detail = props.detail;
  const bytesFormatter = (value, name, props) => {
    let unit = props.unit;
    if (unit === 'B' || unit === 'B/s') {
      value = formatBytes(value);
    } else {
      if (Array.isArray(value) || isNaN(value)) return;
      value = value.toFixed(2);
      value += ' ';
    }
    return value;
  };
  // 对传入的数据进行倒序
  const reversedData = [...props.data].reverse();
  return <Graph>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={600} height={300} data={reversedData}>
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '1vh',
            border: 0,
          }}
          formatter={bytesFormatter}
        />
        <XAxis dataKey="timestamp" hide={true} />
        {/* 如果min 和max都存在 */}
        {props.min !== undefined && props.max !== undefined && <YAxis domain={[props.min, props.max]} hide={true} />}
        {/* 如果min存在且不等于0 */}
        {props.min && <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />}
        {Object.keys(detail).map((key, index) => {
          return (
            <Line
              type="monotone"
              dataKey={key}
              key={index}
              stroke={detail[key].color}
              name={detail[key].title}
              unit={detail[key].unit}
              strokeWidth={3}
              isAnimationActive={false}
              connectNulls={true}
              animationEasing="linear"
              dot={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  </Graph>;
};

export default Chart;