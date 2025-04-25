import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { formatBytes } from '../../js/utils';

import Panel from './panel.jsx';
import ExternalInputCard from '../cards/externalInputCard.jsx';
import TemperatureCard from '../cards/temperatureCard.jsx';
import BatteryCard from '../cards/batteryCard.jsx';
import RaspberryPiPowerCard from '../cards/raspberryPiPowerCard.jsx';
import StorageCard from '../cards/storageCard.jsx';
import MemoryCard from '../cards/memoryCard.jsx';
import ProcessorCard from '../cards/processorCard.jsx';
import NetworkCard from '../cards/networkCard.jsx';

const TEST_DATA = [
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
  { time: new Date().getTime() },
];

const DashboardPanel = (props) => {
  const [data, setData] = useState(TEST_DATA);
  const [updateDataInterval, setUpdateDataInterval] = useState(1000);

  const updateData = async () => {
    let _data;
    if (props.peripherals.includes('history')) {
      // _data = await props.request("get-history", "GET", { n: 20 });
      _data = await props.request("get-data", "GET", { n: 20 });
    } else {
      _data = await props.request("get-data", "GET");
    }
    if (_data) {
      if (!Array.isArray(_data)) {
        if (!_data.time) {
          _data.time = new Date().getTime();
        }
        let newData = [...data];
        if (newData.length >= 20) {
          // newData.shift();
          newData.pop();
        }
        // newData.push(_data);
        // Pironman 5 NAS数据往后走，所以使用pop和unshift
        newData.unshift(_data);
        setData(newData);
      } else {
        setData(_data);
      }
    }
  }

  // 自动获取数据
  useEffect(() => {
    let interval;
    if (props.connected && props.peripherals.length > 0) {
      interval = setInterval(() => {
        updateData();
      }, updateDataInterval);
    }
    return () => clearInterval(interval);
  }, [updateDataInterval, props.connected, data, props.peripherals]);

  useEffect(() => {
    if (data.length > 0) {
      props.onDataChange(data[data.length - 1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
        {
          (props.peripherals.includes('external_input') ||
            props.peripherals.includes("input_voltage") ||
            props.peripherals.includes("input_current") ||
            props.peripherals.includes("is_input_plugged_in")) &&
          <ExternalInputCard data={data} bytesFormatter={bytesFormatter} switchShow={props.peripherals.includes('output_switch')} />
        }
        {
          // (props.peripherals.includes('pwm_fan')) &&
          (
            props.peripherals.includes('pwm_fan_speed') ||
            props.peripherals.includes('cpu_temperature') ||
            props.peripherals.includes('gpu_temperature') ||
            props.peripherals.includes('temperature')) &&
          <TemperatureCard data={data} request={props.request} unit={props.temperatureUnit || "C"} />}
        {
          (props.peripherals.includes('is_battery_plugged_in') ||
            props.peripherals.includes('battery_percentage') ||
            props.peripherals.includes('battery_capacity') ||
            props.peripherals.includes('battery_voltage') ||
            props.peripherals.includes('battery') ||
            props.peripherals.includes('battery_current')) &&
          <BatteryCard data={data} />}
        {(props.peripherals.includes('raspberry_pi_power') ||
          props.peripherals.includes('output_voltage') ||
          props.peripherals.includes('output_current') ||
          props.peripherals.includes('output_switch')) &&
          <RaspberryPiPowerCard data={data} sendData={props.sendData} peripherals={props.peripherals} showAlert={props.showAlert} showBanner={props.showBanner} />}

        {props.peripherals.includes('storage') && <StorageCard data={data} mountSwitchChecked={props.mountSwitchChecked} />}
        {props.peripherals.includes('memory') && <MemoryCard data={data} />}
        {props.peripherals.includes('network') && <NetworkCard data={data} />}
        {props.peripherals.includes('cpu') && <ProcessorCard data={data} processorChartAmount={props.processorChartAmount} />}
      </Box >
    </Panel >
  </Box>
  );
};

export default DashboardPanel;
