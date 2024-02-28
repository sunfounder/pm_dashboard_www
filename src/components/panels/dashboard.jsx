import { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';

import { formatBytes } from '../../js/utils';

import Panel from './panel.jsx';
import ExternalInputCard from '../cards/externalInputCard.jsx';
import FanCard from '../cards/fanCard.jsx';
import BatteryCard from '../cards/batteryCard.jsx';
import RaspberryPiPowerCard from '../cards/raspberryPiPowerCard.jsx';
import StorageCard from '../cards/storageCard.jsx';
import MemoryCard from '../cards/memoryCard.jsx';
import ProcessorCard from '../cards/processorCard.jsx';
import NetworkCard from '../cards/networkCard.jsx';

const DashboardPanel = (props) => {
  const [data, setData] = useState([]);
  const [updateDataInterval, setUpdateDataInterval] = useState(1000);

  const updateData = useCallback(async () => {
    let _data = await props.request("get-history", "GET", { n: 20 });
    if (!_data) {
      setUpdateDataInterval(10000);
    } else {
      setUpdateDataInterval(1000);
      setData(_data.reverse());
    }
  }, [props]);

  // 自动获取数据
  useEffect(() => {
    const interval = setInterval(() => {
      updateData();
    }, updateDataInterval);
    return () => clearInterval(interval);
  }, [updateDataInterval, updateData]);

  const bytesFormatter = (value, name, props) => {
    let unit = props.unit;
    if (unit === 'B' || unit === 'B/s') {
      value = formatBytes(value);
    } else {
      if (Array.isArray(value)) return;
      value = value.toFixed(2);
      value += ' ';
    }
    return value;
  };

  return (<Box sx={{ width: "100%", height: "100%", overflowY: "scroll", overflowX: "hidden" }}>
    <Panel title={props.deviceName} {...props}>
      <Box sx={{ display: "flex", flexFlow: "wrap", gap: "70px 40px" }}>
        {props.peripherals.includes('usb_in') && <ExternalInputCard data={data} bytesFormatter={bytesFormatter} />}
        {props.peripherals.includes('fan') && <FanCard data={data} request={props.request} unit={props.temperatureUnit || "C"} />}
        {props.peripherals.includes('battery') && <BatteryCard data={data} />}
        {props.peripherals.includes('output') && <RaspberryPiPowerCard data={data} />}

        <StorageCard data={data} />
        <MemoryCard data={data} />
        <NetworkCard data={data} />
        <ProcessorCard data={data} />
      </Box >
    </Panel >
  </Box>
  );
};

export default DashboardPanel;
