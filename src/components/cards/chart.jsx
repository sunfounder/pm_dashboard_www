import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatBytes } from '../../js/utils.js';
import Graph from './graph.jsx';
import { useTheme } from '@mui/material/styles';

const Chart = (props) => {
  const theme = useTheme();
  const { detail } = props;
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
  return <Graph>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={600} height={300} data={props.data}>
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '1vh',
            border: 0,
          }}
          formatter={bytesFormatter}
        />
        <XAxis dataKey="timestamp" hide={true} />
        {Object.keys(detail).map((key, index) => {
          let min = detail[key].min;
          let max = detail[key].max;
          if (min !== undefined) {
            return <YAxis domain={[min, max]} key={index} hide={true} />;
          }
          return undefined;
        })}

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