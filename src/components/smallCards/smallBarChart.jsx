import React, { useRef } from 'react';
import Graph from './smallGraph.jsx';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const BarChart = (props) => {
  const theme = useTheme();
  const containerRef = useRef(null);

  // 辅助函数：字节转GB
  const toGB = (bytes) => (bytes / (1024 ** 3)).toFixed(1);

  return (
    <Graph ref={containerRef}>
      <Box sx={{
        padding: '4px 6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        gap: 1.5
      }}>
        {props.data.map((item, index) => {
          const barColor = props.detail[item.type].color;
          return (
            <Box key={index} sx={{ width: '100%' }}>
              {/* 顶部标签 */}
              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '11px', color: theme.palette.text.secondary }}>
                  {item.type.split('/').pop()}: <strong>{toGB(item.free)} GB 可用</strong>
                </Typography>
                <Typography sx={{ fontSize: '11px', color: theme.palette.text.secondary }}>
                  共 {toGB(item.total)} GB
                </Typography>
              </Box> */}

              {/* 进度条区域 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={item.percent}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[800],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: barColor,
                        borderRadius: 4,
                      }
                    }}
                  />
                </Box>
                {/* <Typography sx={{ fontSize: '10px', minWidth: '30px', textAlign: 'right', color: theme.palette.text.primary }}>
                  {item.percent}%
                  {toGB(item.total)} GB
                </Typography> */}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Graph>
  );
}

export default BarChart;