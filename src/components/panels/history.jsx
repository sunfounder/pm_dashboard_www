import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Checkbox,
  Typography,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  MenuList,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
} from '@mui/material';
import MuiToolTip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { CalendarIcon } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,

} from 'recharts';

import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
} from '@mui/material/colors';

import { DateTime } from 'luxon';

import Panel from './panel.jsx';
import { celciusToFahrenheit } from '../../js/utils.js';

const QuickSelect = {
  "last-5-minutes": "Last 5 minutes",
  "last-30-minutes": "Last 30 minutes",
  "last-1-hour": "Last 1 hour",
  "last-2-hours": "Last 2 hours",
  "last-4-hours": "Last 4 hours",
  "today": "Today",
  "yesterday": "Yesterday",
}

const Colors = [
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
]

const HistoryPanel = (props) => {
  const [keys, setKeys] = useState([]);
  const [data, setData] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(JSON.parse(window.localStorage.getItem("pm-dashboard-history-selected-keys")) || []);
  const [colors, setColors] = useState(JSON.parse(window.localStorage.getItem("pm-dashboard-history-colors")) || {});
  const [element, setElement] = useState(null);
  const [downloadElement, setDownloadElement] = useState(null);
  const updateData = useCallback(async () => {
    if (selectedKeys.length === 0) {
      return;
    }
    let payload = {
      start: start * 1000000000,
      end: end * 1000000000,
      key: selectedKeys.join(","),
    }
    let data = await props.request("get-time-range", "GET", payload);

    // Convert celcius to fahrenheit if unit is F
    if (props.temperatureUnit === "F") {
      data.forEach((row) => {
        if ('cpu_temperature' in row) {
          row.cpu_temperature = celciusToFahrenheit(row.cpu_temperature);
        }
      });
    }
    setData(data);
  }, [props, start, end, selectedKeys]);

  useEffect(() => {
    updateData();
  }, [start, end, selectedKeys, updateData]);

  useEffect(() => {
    props.request("get-history-data", "GET", { n: 1 }).then(data => {
      let keys = Object.keys(data);
      // 删除时间
      keys.splice(keys.indexOf("time"), 1);
      setKeys(keys);
    });
  }, [props]);

  useEffect(() => {
    let newElement = <Card sx={{ display: "flex", width: "100%", height: "100%", overflow: "hidden scroll", padding: "0 10px" }}>
      <List dense sx={{ height: "fit-content" }}>
        {keys.map((key, index) => {
          return (
            <DataListItem key={key} name={key}
              checked={selectedKeys.includes(key)}
              color={colors[key]}
              onClick={handleKeyChange}
              onColorChange={handleColorChange}
            />);
        })}
      </List>
    </Card >
    setElement(newElement);
    props.onElementChange(element); // 组件加载时调用父组件的回调函数，并传递元素
  }, [element, props.onElementChange]);

  useEffect(() => {
    let newDownloadElement = <IconButton id="download" aria-label="download" color="red" onClick={handleDownloadCSV}>
      <MuiToolTip title="Download CSV">
        <DownloadIcon />
      </MuiToolTip>
    </IconButton>;
    setDownloadElement(newDownloadElement);
    props.onDownloadElementChange(downloadElement); // 组件加载时调用父组件的回调函数，并传递元素
  }, [downloadElement, props.onDownloadElementChange]);

  const handleKeyChange = (key, checked) => {
    let temp = [];
    let newColors = { ...colors };
    if (checked) {
      temp = [...selectedKeys, key];
      let colorIndex = Math.floor(Math.random() * Colors.length);
      newColors[key] = Colors[colorIndex][500];
    } else {
      temp = selectedKeys.filter(k => k !== key);
      delete newColors[key];
    }
    window.localStorage.setItem("pm-dashboard-history-selected-keys", JSON.stringify(temp));
    window.localStorage.setItem("pm-dashboard-history-colors", JSON.stringify(newColors));
    setColors(newColors);
    setSelectedKeys(temp);
  }

  const handleTimeRangeChange = (data) => {
    if (data.start !== undefined) {
      setStart(data.start);
    }
    if (data.end !== undefined) {
      setEnd(data.end);
    }
  }

  const handleColorChange = (key, color) => {
    let newColors = { ...colors };
    newColors[key] = color;
    window.localStorage.setItem("pm-dashboard-history-colors", JSON.stringify(newColors));
    setColors(newColors);
  }

  const handleDownloadCSV = () => {
    let csv = "data:text/csv;charset=utf-8,";
    let header = ["time", ...selectedKeys];
    csv += header.join(",") + "\n";
    data.forEach((row) => {
      let temp = [];
      header.forEach((key) => {
        temp.push(row[key]);
      });
      csv += temp.join(",") + "\n";
    });
    let encodedUri = encodeURI(csv);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <Panel title="History" {...props} sx={{ height: "100%", overflow: "hidden" }} navActions={
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
        <DateTimeRangePicker onChange={handleTimeRangeChange} onError={(msg) => props.showSnackBar("error", msg)} />
        {/* <IconButton id="download" aria-label="download" color="primary" onClick={handleDownloadCSV}>
          <MuiToolTip title="Download CSV">
            <DownloadIcon />
          </MuiToolTip>
        </IconButton> */}
      </Box>
    }>
      <Box sx={{ display: "flex", width: "100%", height: "100%", overflow: "hidden", gap: "2rem" }}>


        {/* <Card sx={{ display: "flex", width: "320px", height: "100%", overflow: "hidden scroll", padding: "0 10px" }}>
          <List dense sx={{ height: "fit-content" }}>
            {keys.map((key, index) => {
              return (
                <DataListItem key={key} name={key}
                  checked={selectedKeys.includes(key)}
                  color={colors[key]}
                  onClick={handleKeyChange}
                  onColorChange={handleColorChange}
                />);
            })}
          </List>
        </Card > */}

        <Card sx={{ width: "100%" }}>
          <Chart data={data} keys={selectedKeys} colors={colors} />
        </Card>
      </Box >
    </Panel>
  );
}

const DateTimeRangePicker = (props) => {
  // default start time is 5 minutes ago
  const [start, setStart] = useState(parseInt(window.localStorage.getItem("pm-dashboard-history-start")) || DateTime.now().minus({ minutes: 5 }).toSeconds());
  const [end, setEnd] = useState(parseInt(window.localStorage.getItem("pm-dashboard-history-end")) || DateTime.now().toSeconds());
  const [quickSelect, setQuickSelect] = useState(window.localStorage.getItem("pm-dashboard-history-quick-select") || "last-5-minutes");
  const [label, setLabel] = useState(QuickSelect[quickSelect] || "Last 5 minutes");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const handleMenuShow = (event) => {
    setMenuAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  }

  const handleQuickSelect = (value) => {
    window.localStorage.setItem("pm-dashboard-history-quick-select", value);
    setQuickSelect(value);
    setLabel(QuickSelect[value]);
    handleMenuClose();
  }

  const getTimeRange = (value) => {
    let start, end;
    if (value === "today") {
      start = DateTime.now().startOf("day").toSeconds();
      end = DateTime.now().toSeconds();
    } else if (value === "yesterday") {
      start = DateTime.now().subtract({ days: 1 }).startOf("day").toSeconds();
      end = DateTime.now().subtract({ days: 1 }).endOf("day").toSeconds();
    } else if (value.startsWith("last")) {
      let temp = value.split("-");
      let number = parseInt(temp[1]);
      let unit = temp[2];
      start = DateTime.now().minus({ [unit]: number }).toSeconds();
      end = DateTime.now().toSeconds();
    }
    return [start, end];
  }

  const handleStartChange = (datetime) => {
    if (datetime.unix() === start) {
      return;
    }
    // 开始时间不能大于结束时间
    if (datetime.unix() > end) {
      props.onError("Start time cannot be greater than end time");
      return;
    }
    window.localStorage.setItem("pm-dashboard-history-start", datetime.unix());
    let startLabel = DateTime.fromSeconds(datetime.unix())
    let endLabel = DateTime.fromSeconds(end);
    setLabel(`${startLabel} - ${endLabel}`);
    setStart(datetime.unix());
    setQuickSelect("custom");
    props.onChange({ start: datetime.unix() });
  }

  const handleEndChange = (datetime) => {
    if (datetime.unix() === end) {
      return;
    }
    // 结束时间不能小于开始时间
    if (datetime.unix() < start) {
      props.onError("End time cannot be less than start time");
      return;
    }
    window.localStorage.setItem("pm-dashboard-history-end", datetime.unix());
    let startLabel = DateTime.fromSeconds(start);
    let endLabel = DateTime.fromSeconds(datetime.unix());
    setLabel(`${startLabel} - ${endLabel}`);
    setEnd(datetime.unix());
    setQuickSelect("custom");
    props.onChange({ end: datetime.unix() });
  }

  useEffect(() => {
    let interval = setInterval(() => {
      if (quickSelect !== "custom") {
        let [start, end] = getTimeRange(quickSelect);
        setStart(start);
        setEnd(end);
        props.onChange({ start: start, end: end });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quickSelect]);
  // }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined" size='smaall'>
        <InputLabel htmlFor="datetime-range">Datetime Range</InputLabel>
        <OutlinedInput
          id="datetime-range"
          type='text'
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="datetime-range"
                onClick={handleMenuShow}
                edge="end"
              >
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Datetime Range"
          value={label}
        />
      </FormControl>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <MenuList>
            {Object.keys(QuickSelect).map((key, index) => {
              return (
                <MenuItem
                  key={key}
                  selected={quickSelect === key}
                  onClick={() => { handleQuickSelect(key) }}>
                  {QuickSelect[key]}
                </MenuItem>
              );
            })}
          </MenuList>
          <Box id="custom-datetime-range" sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around", padding: "0 10px" }}>
              <DateTimeField
                label="From"
                value={DateTime.fromSeconds(start)}
                onChange={handleStartChange}
                format="YYYY-MM-DD HH:mm:ss"
                sx={{ margin: "auto", width: "100%" }}
              />
              <Typography variant="h6" sx={{ margin: "auto 10px" }}>-</Typography>
              <DateTimeField
                label="To"
                value={DateTime.fromSeconds(end)}
                onChange={(date) => setEnd(date.unix())}
                format="YYYY-MM-DD HH:mm:ss"
                sx={{ margin: "auto", width: "100%" }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <DateCalendar value={DateTime.fromSeconds(start)} onChange={handleStartChange} />
              <DateCalendar value={DateTime.fromSeconds(end)} onChange={handleEndChange} />
            </Box>
          </Box>
        </Box>
      </Menu>
    </LocalizationProvider >
  );
}

const DataListItem = (props) => {
  const [colorMenuAnchorEl, setColorMenuAnchorEl] = useState(null);
  const openColorMenu = Boolean(colorMenuAnchorEl);

  const handleColorMenuShow = (event) => {
    setColorMenuAnchorEl(event.currentTarget);
  }

  const handleColorMenuClose = () => {
    setColorMenuAnchorEl(null);
  }

  const handleKeyChange = (event) => {
    props.onClick(props.name, event.target.checked);
  }

  const handleColorChange = (key, color) => {
    props.onColorChange(key, color);
    handleColorMenuClose();
  }

  return (
    <ListItem
      key={props.name}
      secondaryAction={props.color &&
        <IconButton aria-label="color" onClick={handleColorMenuShow}>
          <Box sx={{ bgcolor: props.color, width: "20px", height: "20px", borderRadius: "50%" }} />
        </IconButton>
      }
      disablePadding
      disableGutters
    >
      <ListItemButton dense
        disableGutters
        onClick={handleKeyChange} >
        <ListItemIcon sx={{ minWidth: "unset" }}>
          <Checkbox
            edge="start"
            checked={props.checked}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': props.name }}
          />
        </ListItemIcon>
        <ListItemText id={props.name} primary={props.name} />
      </ListItemButton>
      <Menu
        id="color-menu"
        anchorEl={colorMenuAnchorEl}
        open={openColorMenu}
        onClose={handleColorMenuClose}
      >
        <Grid container spacing={1} sx={{ width: "160px" }}>
          {Colors.map((color, index) => {
            return (
              <Grid item key={index} xs={3} sx={{ textAlign: "center" }}>
                <IconButton
                  aria-label="color"
                  onClick={() => handleColorChange(props.name, color[500])}
                >
                  <Box sx={{ bgcolor: color[500], width: "20px", height: "20px", borderRadius: "50%" }} />
                </IconButton>
              </Grid>
            );
          })}
        </Grid>
      </Menu>
    </ListItem>
  );
}

const Chart = (props) => {
  const theme = useTheme();

  const tooltipFormatter = (value, name, props) => {
    return value;
  }

  const formatXAxis = (tickItem) => {
    // 将时间戳转换为时间
    return new Date(tickItem).toLocaleTimeString();
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '1vh',
          }}
          formatter={tooltipFormatter}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={formatXAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        {props.keys.map((key, index) => {
          return (
            <Line
              type="monotone"
              dataKey={key}
              stroke={props.colors[key]}
              key={index}
              isAnimationActive={false}
              dot={false} />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HistoryPanel;
