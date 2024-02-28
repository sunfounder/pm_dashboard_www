import React, { useState } from 'react';
import Graph from './graph.jsx';
import { formatBytes } from '../../js/utils.js';
import { Paper, Typography } from '@mui/material';
import "./barChart.css"


const BarChart = (props) => {
  const { processorChartAmount } = props;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (index, event) => {
    setHoveredIndex(index);
    setHoveredPosition({ x: event.clientX + 20, y: event.clientY + 20 });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  return (
    <Graph processorChartAmount={processorChartAmount}>
      <div
        className='barChartBox'
        onMouseMove={(event) => {
          if (hoveredIndex !== null) {
            setHoveredPosition({ x: event.clientX + 20, y: event.clientY + 20 });
          }
        }}
        onMouseLeave={() => {
          setHoveredIndex(null);
        }}
      >
        <div className='barChart'>
          {props.data.map((item, index) => (
            <div
              key={index}
              className={`barData ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={(event) => handleMouseEnter(index, event)}
              onMouseLeave={handleMouseLeave}
            >
              <Paper className='barUsed' elevation={5} sx={{ width: `${item.percent}%`, bgcolor: `${props.color}.main` }}></Paper>
              {/* 中间空隙占2% */}
              <Paper className='barFree' elevation={5} sx={{ width: `${100 - item.percent - 2}%`, }}></Paper>
            </div>
          ))}
        </div>
        {hoveredIndex !== null && (
          <Paper className='barChartTip'
            color={props.color}
            sx={{ top: hoveredPosition.y, left: hoveredPosition.x, boxShadow: "none" }}
          >
            <div className='barChartTipText'>
              <Typography
                sx={{ margin: "0px 0px 5px 0" }}
              >
                {props.data[hoveredIndex].time}
              </Typography>
              <Typography
                color={`${props.color}.main`}
                sx={{ margin: "0px 0px 5px 0" }}
              >
                {props.data[hoveredIndex].type} : {formatBytes(props.data[hoveredIndex].used)}B / {formatBytes(props.data[hoveredIndex].total)}B
              </Typography>

            </div>
          </Paper>
        )}
      </div >
    </Graph >
  );
}

export default BarChart;