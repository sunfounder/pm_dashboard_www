import React, { useState, useEffect } from 'react';
import PopupFrame from './popupFrame.jsx';
import BasicTable from "./basicTable.jsx";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Typography,
  LinearProgress,
  Card,
  Collapse,
  ListItemButton,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';

const batteryTestTimeout = 60; // 1 minute
const PopupPowerFailureSimulation = (props) => {

  const [details, setDetails] = useState(false); // 显示详细数据
  const [batteryPercentage, setBatteryPercentage] = useState(90); // 电池百分比
  const [progress, setProgress] = useState(0); // 进度条
  const [linearProgress, setLinearProgress] = useState(false); //进度条显示
  const [seconds, setSeconds] = useState(5); // 倒计时秒数
  const [powerFailureSimulationDisabled, setPowerFailureSimulationDisabled] = useState(true);  //禁用确认按钮
  const [cancelDisabled, setCancelDisabled] = useState(false);  //禁用取消按钮
  const [powerFailureSimulationResult, setPowerFailureSimulationResult] = useState(""); //电池测试结果
  const [tip, setTip] = useState(false); //提示
  const [batteryData, setBatteryData] = useState({
    inputStatus: 0,
    input_voltage: 0,
    battery_voltage: 0,
    battery_current: 0,
    battery_power: 0,
    battery_percentage: 0,
    output_voltage: 0,
    output_current: 0,
  }); //电池数据

  const handleDetails = () => {
    setDetails(!details);
  }
  // 进度条
  function LinearProgressWithLabel(props) {
    const percent = (props.value / props.total) * 100; // 计算百分比
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          {/* <LinearProgress variant="determinate" {...props} /> */}
          <LinearProgress variant="determinate" value={percent} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`${Math.round(props.value)} S`}
          </Typography>
        </Box>
      </Box>
    );
  }

  const getBatteryPercentage = async () => {
    let batteryPercentage = await props.request("get-data", "GET", { n: 1 });
    setBatteryPercentage(batteryPercentage.battery_percentage);
  }

  const handleBatteryTest = async () => {
    props.onBatteryTestStatus(true);
    setPowerFailureSimulationDisabled(true);
    setSeconds(5);
    setPowerFailureSimulationResult("");
    setCancelDisabled(true);
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(prev => {
          let newProgress = prev - 1;
          if (newProgress === 0) {
            clearInterval(timer);
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }
    // 等待5秒后开始测试
    setTimeout(async () => {
      const result = await props.sendData('start-ups-power-failure-simulation', { "time": batteryTestTimeout });
      if (result === "OK") {
        setLinearProgress(true);
      }
    }, 5000);

    // 等待测试完成
    setTimeout(async () => {
      const intervalId = setInterval(async () => {
        let result = await props.request('get-ups-power-failure-simulation');
        result["bat_consumption"] = batteryPercentage - result["battery_percentage"];
        if (result) {
          let data_list = [
            { name: "Battery Voltage", field: "bat_voltage", unit: "V" },
            { name: "Battery Current", field: "bat_current", unit: "A" },
            { name: "Battery Power", field: "bat_power", unit: "W" },
            { name: "Output Current", field: "output_current", unit: "A" },
            { name: "Output Power", field: "output_power", unit: "W" },
            { name: "Output Voltage", field: "output_voltage", unit: "V" },
          ];
          const head = [
            { title: "Name", field: "name", align: "left" },
            { title: "Average", field: "average", align: "center" },
            { title: "Max", field: "max", align: "center" },
          ];
          const data_list2 = [
            { name: "Battery Consumption", field: "bat_consumption", unit: "%" },
            { name: "Average Battery Power", field: "bat_power_avg", unit: "W" },
            { name: "Available Time", field: "available_time_str", unit: "" },
            { name: "Battery Percentage", field: "battery_percentage", unit: "%" },
            // { name: "Available Battery Capacity", field: "available_bat_capacity", unit: "mAh" },
            { name: "Shutdown Percentage", field: "shutdown_percentage", unit: "%" },
          ];
          const head2 = [
            { title: "Name", field: "name", align: "left" },
            { title: "Value", field: "value", align: "center" },
          ]
          let data = [];
          let data2 = [];
          for (let i = 0; i < data_list.length; i++) {
            let item = data_list[i];
            let obj = {
              name: item.name,
              average: result[item.field + "_avg"] + " " + item.unit,
              max: result[item.field + "_max"] + " " + item.unit,
            }
            data.push(obj);
          };
          for (let i = 0; i < data_list2.length; i++) {
            let item = data_list2[i];
            let obj = {
              name: item.name,
              value: result[item.field] + " " + item.unit,
            }
            data2.push(obj);
          };
          const newData = {
            head: head,
            head2: head2,
            data: data,
            data2: data2,
          }
          setPowerFailureSimulationResult(newData);
        }
        if (result) {
          setProgress(100);
          setCancelDisabled(false);
          setLinearProgress(false);
          clearInterval(intervalId);
          setTip(false);
        };
      }, 1000);
    }, batteryTestTimeout * 1000 + 5000);

    //更新一次进度
    setTimeout(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          // const newProgress = prevProgress + (100 / batteryTestTimeout);
          const newProgress = prevProgress + 1;
          if (newProgress >= batteryTestTimeout) {
            clearInterval(timer);
            return batteryTestTimeout;
          }
          return newProgress;
        });
      }, 1000);
    }, 5000);

  }

  const getBatteryData = async () => {
    let data = await props.request("get-data", "GET", { n: 1 });
    if (data) {
      data = {
        inputStatus: data.is_input_plugged_in ? "Plugged in" : "Unplugged",
        input_voltage: (data.input_voltage / 1000).toFixed(2) + " V",
        battery_voltage: (data.battery_voltage / 1000).toFixed(2) + " V",
        battery_current: (data.battery_current / 1000).toFixed(2) + " A",
        battery_power: ((data.battery_current / 1000) * (data.battery_voltage / 1000)).toFixed(2) + " W",
        battery_percentage: data.battery_percentage,
        output_voltage: (data.output_voltage / 1000).toFixed(2) + " V",
        output_current: (data.output_current / 1000).toFixed(2) + " A",
        output_power: ((data.output_current / 1000) * (data.output_voltage / 1000)).toFixed(2) + " W",
        power_source: data.power_source,
      }
      setBatteryData(data);
      if (data.inputStatus === "Plugged in" && data.battery_percentage > 80 && !props.batteryTestStatus) {
        setPowerFailureSimulationDisabled(false);
      }
      if (data.power_source === 1) {
        setTip(true);
      }
    } else {
      console.log("获取数据失败");
    }
  }

  useEffect(() => {
    if (props.batteryTestPopup) {
      console.log("打开")
      getBatteryPercentage();
    } else {
      console.log("关闭")
      setProgress(0);
      setSeconds(5);
      setLinearProgress(false);
      setPowerFailureSimulationDisabled(true);
      setPowerFailureSimulationResult(""); // 清空测试结果
      setTip(false);
    }

  }, [props.batteryTestPopup]);


  useEffect(() => {
    let getDtataID
    if (props.batteryTestPopup) {
      getDtataID = setInterval(() => {
        getBatteryData();
      }, 1000);
    } else {
      clearInterval(getDtataID);
    };
    return () => {
      clearInterval(getDtataID);
    };
  }, [props.batteryTestPopup]);

  return (
    <PopupFrame title="⚡ Power Failure Simulation" open={props.batteryTestPopup} width="39rem" >
      <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
        {
          seconds > 0 && props.batteryTestStatus &&
          <Typography Typography variant="h6" sx={{ margin: "0 1rem 1rem 1rem", textAlign: "center" }}>
            Power failure simutaion in <span variant="h1">{seconds}</span>
          </Typography>
        }
        {
          cancelDisabled && seconds === 0 &&
          <Typography variant="h6" sx={{ margin: "0 1rem 1rem 1rem" }}>
            Power is disconnected, reading datas...
          </Typography>
        }
        {
          !props.batteryTestStatus && powerFailureSimulationResult === "" &&
          <>
            <Typography sx={{ margin: "0.5rem 1rem" }}>
              Start a 1-minute power failure simulation. Current battery capacity is {batteryPercentage}%.
            </Typography>
            <Typography sx={{ margin: "0 1rem" }}>
              Please note:
            </Typography>
            <Typography sx={{ margin: "0 1rem" }}>
              - Do not shut down the PiPower during the test.
            </Typography>
            <Typography sx={{ margin: "0 1rem" }}>
              - Do not refresh the page.
            </Typography>
            <Typography sx={{ margin: "0.5rem 1rem" }}>
              Click "Confirm" below to start the test.
            </Typography>
            {
              batteryPercentage < 80 &&
              <Typography sx={{ margin: "0.5rem 1rem" }}>
                ⚠️ Battery level below 80%, please charge before battery test.
              </Typography>
            }
            {
              batteryData.inputStatus === "Unplugged" &&
              <Typography sx={{ margin: "0.5rem 1rem" }}>
                ⚠️ Currently, there is no power connected. Please connect the power for testing.
              </Typography>
            }
          </>
        }
      </Box>
      {
        cancelDisabled &&
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0.1rem", flexWrap: "wrap" }}>
          <Card sx={{ minWidth: "10rem", margin: "0.5rem", flexGrow: "1", alignSelf: "stretch" }}>
            <Typography sx={{ margin: "0 1rem" }} variant="h6">Input</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Status" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.inputStatus} sx={{ textAlign: "right" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Voltage" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.input_voltage} sx={{ textAlign: "right" }} />
              </ListItem>
            </List>
          </Card>
          <Card sx={{ minWidth: "10rem", margin: "0.5rem", flexGrow: "1", alignSelf: "stretch" }}>
            <Typography sx={{ margin: "0 1rem" }} variant="h6">Battery</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Voltage" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.battery_voltage} sx={{ textAlign: "right" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Current" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.battery_current} sx={{ textAlign: "right" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Power" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.battery_power} sx={{ textAlign: "right" }} />
              </ListItem>
            </List>
          </Card>
          <Card sx={{ minWidth: "10rem", margin: "0.5rem", flexGrow: "1", alignSelf: "stretch" }}>
            <Typography sx={{ margin: "0 1rem" }} variant="h6">Output</Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Voltage" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.output_voltage} sx={{ textAlign: "right" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Current" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.output_current} sx={{ textAlign: "right" }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Power" sx={{ textAlign: "left" }} />
                <ListItemText primary={batteryData.output_power} sx={{ textAlign: "right" }} />
              </ListItem>
            </List>
          </Card>
        </Box>
      }
      {
        powerFailureSimulationResult !== "" &&
        <>
          <Typography sx={{ margin: "0 1rem 1rem 1rem" }}>
            System seamlessly transitioned to battery power during the 1-minute outage.
          </Typography>
          <Typography sx={{ margin: "0 1rem 1rem 1rem" }}>
            Battery is projected to operate for {powerFailureSimulationResult.data2[2].value} hours until reaching the set shutdown percentage, triggering an automatic shutdown.
          </Typography>
        </>
      }
      {
        powerFailureSimulationResult !== "" &&
        <>
          < BasicTable data={powerFailureSimulationResult.data2} head={powerFailureSimulationResult.head2} noHead={true} />
          <ListItemButton onClick={handleDetails}>
            <ListItemText primary="Details" />
            {details ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={details} timeout="auto" unmountOnExit>
            < BasicTable data={powerFailureSimulationResult.data} head={powerFailureSimulationResult.head} />
          </Collapse>
        </>
      }
      {
        linearProgress &&
        <Box sx={{ width: '100%', padding: '1rem' }}>
          <LinearProgressWithLabel value={progress} total={batteryTestTimeout} />
        </Box>
      }

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1rem" }}>
        {
          <Button
            variant="outlined"
            color="primary"
            disabled={cancelDisabled}
            sx={{ minWidth: "5rem", maxWidth: "8rem" }}
            onClick={props.handleBatteryTestPopup}>
            Cancel
          </Button>
        }
        {
          !props.batteryTestStatus &&
          <Button
            variant="contained"
            color="primary"
            sx={{ minWidth: "5rem", maxWidth: "8rem" }}
            disabled={powerFailureSimulationDisabled}
            onClick={handleBatteryTest}>
            Confirm
          </Button>
        }
      </Box>
    </PopupFrame >
  )
}

export default PopupPowerFailureSimulation