import React, { useState, useRef, useEffect } from 'react';
import { formatBytes } from '../../js/utils.js';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Graph from './graph.jsx';
import { useTheme } from '@mui/material/styles';
import "./barChart.css"


const BarChart = (props) => {
  const theme = useTheme();
  const containerRef = useRef(null);  // 创建引用
  const [containerWidth, setContainerWidth] = useState(260); // 初始宽度高度
  const [containerHeight, setContainerHeight] = useState(260); // 初始宽度高度

  useEffect(() => {
    const chartBox = document.getElementsByClassName("chartBox")[0];
    if (chartBox) {
      setContainerWidth(chartBox.clientWidth);
      setContainerHeight(chartBox.clientHeight === 150 ? 150 : 260);
    }
    // 监听窗口变化，实时更新高度
    const handleResize = () => {
      const chartBox = document.getElementsByClassName("chartBox")[0];
      if (chartBox) {
        setContainerWidth(chartBox.clientWidth);
        setContainerHeight(chartBox.clientHeight === 150 ? 150 : 260);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // 0.8 是为了留出一些空间
  const WIDTH = Math.ceil(containerWidth * 0.8);
  const HEIGHT = containerHeight;
  const BAR_WIDTH = 20;
  // const BAR_MARGIN = 10;
  const MAX_RADIUS = WIDTH / 2;
  const MIN_RADIUS = 20;
  const MAX_WIDTH = MAX_RADIUS - MIN_RADIUS;
  const MIDDLE_RADIUS = MAX_WIDTH / 2 + MIN_RADIUS;

  const totalPies = props.data.length;
  let barWidth = BAR_WIDTH;
  let barMargin = BAR_WIDTH / 2;
  let totalWidth = totalPies * barWidth + (totalPies - 1) * (barWidth / 2);
  if (totalWidth > MAX_WIDTH) {
    barWidth = (MAX_WIDTH * 2) / (3 * totalPies - 1);
    barMargin = barWidth / 2;
    totalWidth = totalPies * barWidth + (totalPies - 1) * barMargin;
  }
  const firstPieOuterRadius = MIDDLE_RADIUS + (totalWidth / 2);
  let calculatedCY = (HEIGHT - firstPieOuterRadius) / 2 / HEIGHT * 100;
  // 半圆的视觉重心在下面，需要提高一点来让视觉重心在中间
  calculatedCY *= 1.05;


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const color = payload[0].payload.textColor || '#000';
      return (
        <div className="custom-tooltip" style={{ backgroundColor: "white", borderRadius: "5px" }}>
          <p className="time" >{`${payload[0].payload.time}`}</p>
          <p className="label" style={{ color: color }}>{`${payload[0].payload.type} : ${payload[0].payload.freeUnit}B / ${payload[0].payload.totalUnit}B`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Graph ref={containerRef}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          {props.data.map((item, index) => {
            const formattedItem = [
              {
                name: "used",
                value: Number(formatBytes(item.used).replace(/[^0-9.]/g, '')),
                freeUnit: formatBytes(item.used),
                totalUnit: formatBytes(item.total),
                type: item.type,
                time: item.time,
                free: item.free,
                total: item.total,
                mounted: item.mounted,
                percent: item.percent,
                color: theme.palette.storage.mounted[index],
                textColor: theme.palette.storage.mounted[index]
              },
              {
                name: "free",
                value: Number(formatBytes(item.free).replace(/[^0-9.]/g, '')) === 0 ? Number(formatBytes(item.total).replace(/[^0-9.]/g, '')) : Number(formatBytes(item.free).replace(/[^0-9.]/g, '')),
                freeUnit: formatBytes(item.used),
                totalUnit: formatBytes(item.total),
                type: item.type,
                time: item.time,
                free: item.free,
                total: item.total,
                mounted: item.mounted,
                percent: item.percent,
                color: item.mounted ? '#EEEEEE' : theme.palette.storage.notMounted[index],
                textColor: theme.palette.storage.mounted[index]
              }
            ];
            const outerRadius = firstPieOuterRadius - index * (barWidth + barMargin);
            const innerRadius = outerRadius - barWidth;
            return (
              <Pie
                key={index}
                data={formattedItem}
                isAnimationActive={false}
                dataKey="value"
                fill="#8884d8"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={180}
                endAngle={0}
                style={{outline: 'none'}}
                cx="50%"
                cy={`${100 - calculatedCY}%`}
              >
                {formattedItem.map((entry, entryIndex) => (
                  <Cell key={`cell-${entryIndex}`} fill={entry.color} />
                ))}
              </Pie>
            );
          })}
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Graph>
  );
}

export default BarChart;