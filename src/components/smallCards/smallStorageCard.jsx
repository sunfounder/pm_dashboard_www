import React from 'react';
import { timeFormatting, formatBytes, round } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';
import { Box, Paper, LinearProgress, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

const StorageCard = (props) => {
  const theme = useTheme();
  let detail = {};
  let storageCardData = null;
  let diskData = [];
  if (props.data.length >= 2) {
    // 由于选择最后一个对象有时数据是null
    storageCardData = props.data[props.data.length - 2];
    if (Object.keys(storageCardData).length === 1) {
      storageCardData = props.data[0];
    }
    Object.keys(storageCardData).forEach(key => {
      // skip merge disk datas
      if (['disk_free', 'disk_total', 'disk_used', 'disk_percent'].includes(key)) {
        return;
      }
      if (key.startsWith("disk_")) {
        let diskType = key.split('_')[1]; // Extracting the common part
        let existingDisk = diskData.find(disk => disk.type === diskType);
        if (!existingDisk) {
          existingDisk = { type: diskType, time: timeFormatting(storageCardData["time"]) };
          diskData.push(existingDisk);
        }
        existingDisk[key.split('_')[2]] = storageCardData[key];
      }
    });
  }
  // 重组 detail 和 newData 数据
  let newDataEntry = {};
  let newDiskData = []
  diskData.forEach((entry, index) => {
    let diskName = entry.type;
    if (entry.total === 0 || entry.total === null) return;
    if (entry.mounted === null) return;
    if (entry.mounted === 0 && !props.mountSwitchChecked) return;
    newDiskData.push(entry);
    detail[diskName] = {
      title: diskName,
      unit: "",
      color: theme.palette.storage.mounted[index],
    };
    newDataEntry[diskName] = entry.mounted === 0 ? "No Mounted" : `${entry.percent}%`;
  });

  return (
    <Card
      color="storage"
      title="Storage"
      width={4}
      data={[newDataEntry]}
      details={detail}
      chartData={newDiskData}
      theme={theme}
      iconBoxColor={theme.palette.storage.main}
      processorChartAmount={true}
      // chart={<SmallBarChart color="storage" detail={detail} data={newDiskData} />}
      icon={<StorageIcon sx={{ width: '18px', height: '18px' }} />}
      pieChart={true}
    />
  )
}

const Card = (props) => {
  const { icon, details, title, data, rightData, chartData, theme, style } = props;
  // 辅助函数：字节转GB
  const toGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2);
  return (
    <Paper className="smallCard"
      color={props.color}
      elevation={2}
      style={style}
      sx={{
        borderRadius: "8px",
      }}
    >
      <Box>
        <Box className='smallHeader' >
          <Box sx={{ color: `${props.color}.main`, display: "flex", alignItems: "center" }}>
            <Box sx={{ fontSize: "18px", display: "flex", alignItems: "center" }}>{icon}</Box>
            {title}
          </Box>
          <Box sx={{ color: '#666', fontSize: "12px" }}>
            <span> {rightData}</span>
          </Box>
        </Box>
        <Box className='smallDetails'>
          {Object.keys(details).map((key, index) => {
            let LinearProgressData = chartData[index];
            let newData = data[0];
            const barColor = details[key].color;
            if (!newData)
              return null;
            if (!Object.keys(newData).includes(key)) {
              return null;
            }
            let _data = newData[key];
            _data = round(_data, 2);
            let unit = details[key].unit;
            if (unit === "B" || unit === "B/s") {
              _data = formatBytes(_data);
              _data += details[key].unit;
            } else {
              _data += " " + details[key].unit;
            }
            return (
              !details[key].hide && <div className='smallDataBox' key={key} style={{ flexDirection: "column", maxHeight: "40px" }}>
                {!details[key].hide &&
                  <>
                    {/* <div className='smallDetailLineDotBox'>
                      <div className="smallDetailLineDot" style={{
                        backgroundColor: details[key].color
                      }}></div>
                    </div> */}
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", height: '18px' }}>
                      <p >{details[key].title}</p>
                      {/* <p >{_data}</p> */}
                      <p >{`${toGB(LinearProgressData.used)} GB / ${toGB(LinearProgressData.total)} GB`}</p>
                    </Box>
                    {/* 进度条 */}
                    <Box sx={{ width: '100%', paddingTop: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center' }}>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={LinearProgressData.percent}
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
                          {`${toGB(LinearProgressData.used)} GB / ${toGB(LinearProgressData.total)} GB`}
                        </Typography> */}
                      </Box>
                    </Box>
                  </>
                }
              </div>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default StorageCard;