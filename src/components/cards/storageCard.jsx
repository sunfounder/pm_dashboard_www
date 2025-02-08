import React from 'react';
import Card from './card.jsx';
import BarChart from './barChart.jsx';
import { timeFormatting } from '../../js/utils.js';
import { useTheme } from '@mui/material/styles';

const StorageCard = (props) => {
  const theme = useTheme();
  let detail = {};
  let storageCardData = null;
  let diskData = [];
  if (props.data.length >= 2) {
    // 由于选择最后一个对象有时数据是null
    // storageCardData = props.data[props.data.length - 1]
    storageCardData = props.data[props.data.length - 2]
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
    if (entry.total === 0) return;
    if (entry.mounted === null) return;
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
      iconBoxColor={theme.palette.storage.main}
      processorChartAmount={true}
      chart={
        <BarChart color="storage" detail={detail} data={newDiskData} />
      }
      icon={<svg aria-hidden="true" focusable="false" height="2em" fill={theme.palette.iconFg.main} data-prefix="fas" data-icon="hard-drive" class="svg-inline--fa fa-hard-drive fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V280.4c-17-15.2-39.4-24.4-64-24.4H64c-24.6 0-47 9.2-64 24.4V96zM64 288H448c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V352c0-35.3 28.7-64 64-64zM320 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm128-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg>}
      pieChart={true}
    />
  )
}

export default StorageCard;