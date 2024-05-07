import React, { useState, useEffect } from 'react';
import "./settingPage.css";
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import {
  Paper,
  CardHeader,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Modal,
  Button,
  Stack,
  InputAdornment,
  Box,
  TextField,
  Switch,
  MenuItem,
  FormControl,
  Select,
  Input,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  CircularProgress,
  Typography,
  InputLabel,
  OutlinedInput,
  Menu,
  MenuList,
  Autocomplete
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close,
  Check,
} from '@mui/icons-material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarIcon } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

import { formatBytes } from '../js/utils';

const GPIO_FAN_MODES = ['Always On', 'Performance', 'Balanced', 'Quiet', 'OFF'];
// const TIMEZONE_MAP = [
//   { label: '(UTC-12:00) International Date Line West', id: 1 },
//   { label: '(UTC-11:00) Midway Island, Samoa', id: 2 },
//   { label: '(UTC-10:00) Hawaii', id: 3 },
//   { label: '(UTC-09:00) Alaska', id: 4 },
//   { label: '(UTC-08:00) Pacific Time (US & Canada)', id: 5 },
//   { label: '(UTC-07:00) Mountain Time (US & Canada)', id: 6 },
//   { label: '(UTC-06:00) Central Time (US & Canada), Mexico City', id: 7 },
//   { label: '(UTC-05:00) Eastern Time (US & Canada), Bogota, Lima', id: 8 },
//   { label: '(UTC-04:00) Atlantic Time (Canada), Caracas, La Paz', id: 19 },
//   { label: '(UTC-03:30) Newfoundland', id: 10 },
//   { label: '(UTC-03:00) Brasilia, Buenos Aires, Georgetown', id: 11 },
//   { label: '(UTC-02:00) Mid-Atlantic', id: 12 },
//   { label: '(UTC-01:00) Azores, Cape Verde Islands', id: 13 },
//   { label: '(UTC) Dublin, Edinburgh, Lisbon, London, Casablanca', id: 14 },
//   { label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna', id: 15 },
//   { label: '(UTC+02:00) Athens, Bucharest, Istanbul, Cairo', id: 16 },
//   { label: '(UTC+03:00) Moscow, St. Petersburg, Volgograd', id: 17 },
//   { label: '(UTC+03:30) Tehran', id: 18 },
//   { label: '(UTC+04:00) Abu Dhabi, Muscat, Baku, Tbilisi', id: 19 },
//   { label: '(UTC+04:30) Kabul', id: 20 },
//   { label: '(UTC+05:00) Islamabad, Karachi, Tashkent', id: 21 },
//   { label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', id: 22 },
//   { label: '(UTC+05:45) Kathmandu', id: 23 },
//   { label: '(UTC+06:00) Astana, Dhaka, Almaty, Novosibirsk', id: 24 },
//   { label: '(UTC+06:30) Yangon (Rangoon)', id: 25 },
//   { label: '(UTC+07:00) Bangkok, Hanoi, Jakarta', id: 26 },
//   { label: '(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei', id: 27 },
//   { label: '(UTC+09:00) Osaka, Sapporo, Tokyo, Seoul', id: 28 },
//   { label: '(UTC+09:30) Adelaide, Darwin', id: 29 },
//   { label: '(UTC+10:00) Brisbane, Canberra, Melbourne, Sydney, Guam, Port Moresby', id: 30 },
//   { label: '(UTC+11:00) Magadan, Solomon Islands, New Caledonia', id: 31 },
//   { label: '(UTC+12:00) Auckland, Wellington, Fiji, Kamchatka', id: 32 },
//   { label: '(UTC+13:00) Nuku\'alofa', id: 33 }
// ];
const TIMEZONE_MAP = [
  { data: 'UTC+12:00', label: '(UTC-12:00) International Date Line West' },
  { data: 'UTC+11:00', label: '(UTC-11:00) Midway Island, Samoa' },
  { data: 'UTC+10:00', label: '(UTC-10:00) Hawaii' },
  { data: 'UTC+09:00', label: '(UTC-09:00) Alaska' },
  { data: 'UTC+08:00', label: '(UTC-08:00) Pacific Time (US & Canada)' },
  { data: 'UTC+07:00', label: '(UTC-07:00) Mountain Time (US & Canada)' },
  { data: 'UTC+06:00', label: '(UTC-06:00) Central Time (US & Canada), Mexico City' },
  { data: 'UTC+05:00', label: '(UTC-05:00) Eastern Time (US & Canada), Bogota, Lima' },
  { data: 'UTC+04:00', label: '(UTC-04:00) Atlantic Time (Canada), Caracas, La Paz' },
  { data: 'UTC+03:30', label: '(UTC-03:30) Newfoundland' },
  { data: 'UTC+03:00', label: '(UTC-03:00) Brasilia, Buenos Aires, Georgetown' },
  { data: 'UTC+02:00', label: '(UTC-02:00) Mid-Atlantic' },
  { data: 'UTC+01:00', label: '(UTC-01:00) Azores, Cape Verde Islands' },
  { data: 'UTC', label: '(UTC) Dublin, Edinburgh, Lisbon, London, Casablanca' },
  { data: 'UTC-01:00', label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
  { data: 'UTC-02:00', label: '(UTC+02:00) Athens, Bucharest, Istanbul, Cairo' },
  { data: 'UTC-03:00', label: '(UTC+03:00) Moscow, St. Petersburg, Volgograd' },
  { data: 'UTC-03:30', label: '(UTC+03:30) Tehran' },
  { data: 'UTC-04:00', label: '(UTC+04:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
  { data: 'UTC-04:30', label: '(UTC+04:30) Kabul' },
  { data: 'UTC-05:00', label: '(UTC+05:00) Islamabad, Karachi, Tashkent' },
  { data: 'UTC-05:30', label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
  { data: 'UTC-05:45', label: '(UTC+05:45) Kathmandu' },
  { data: 'UTC-06:00', label: '(UTC+06:00) Astana, Dhaka, Almaty, Novosibirsk' },
  { data: 'UTC-06:30', label: '(UTC+06:30) Yangon (Rangoon)' },
  { data: 'UTC-07:00', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { data: 'UTC-08:00', label: '(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei' },
  { data: 'UTC-09:00', label: '(UTC+09:00) Osaka, Sapporo, Tokyo, Seoul' },
  { data: 'UTC-09:30', label: '(UTC+09:30) Adelaide, Darwin' },
  { data: 'UTC-10:00', label: '(UTC+10:00) Brisbane, Canberra, Melbourne, Sydney, Guam, Port Moresby' },
  { data: 'UTC-11:00', label: '(UTC+11:00) Magadan, Solomon Islands, New Caledonia' },
  { data: 'UTC-12:00', label: '(UTC+12:00) Auckland, Wellington, Fiji, Kamchatka' },
  { data: 'UTC-13:00', label: '(UTC+13:00) Nuku\'alofa' },
]
const QuickSelect = {
  // "last-5-minutes": "Last 5 minutes",
  // "last-30-minutes": "Last 30 minutes",
  // "last-1-hour": "Last 1 hour",
  // "last-2-hours": "Last 2 hours",
  // "last-4-hours": "Last 4 hours",
  // "today": "Today",
  // "yesterday": "Yesterday",
}

const SettingPage = (props) => {
  const [themeSwitchChecked, setThemeSwitchChecked] = useState(window.localStorage.getItem("pm-dashboard-theme") === "dark" ? true : false);
  const [hasError, setHasError] = useState({});


  const handleError = (name, error) => {
    if (error) {
      setHasError({ ...hasError, [name]: error });
    } else {
      let newHasError = { ...hasError };
      delete newHasError[name];
      setHasError(newHasError);
    }
  }

  const themeSwitching = (isDark) => {
    let theme;
    if (isDark) {
      theme = "dark";
    } else {
      theme = "light";
    }
    props.onModeChange(theme);
    setThemeSwitchChecked(isDark);
    window.localStorage.setItem("PMTheme", theme);
  };

  const handleDarkMode = (e) => {
    themeSwitching(e.target.checked);
  }

  const handleMQTTChanged = (key, value) => {
    props.onChange('mqtt', key, value);
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper className='setting'
        elevation={3}
        sx={{
          width: '50vw',
          height: "70vh",
          borderRadius: "10px",
        }}
      >
        <CardHeader title="Settings" action={
          <IconButton onClick={props.onCancel}>
            <Close />
          </IconButton>
        } />
        <Box sx={{ overflow: 'auto', height: 'auto', overflowX: "hidden", padding: "0 0" }}>
          <SettingSwitchItem
            title="Dark mode"
            subtitle="Whether to enable Dark Theme mode"
            onChange={handleDarkMode}
            value={themeSwitchChecked} />
          <List subheader={<ListSubheader sx={{ zIndex: 0 }}>
            {(props.peripherals.includes("battery") || props.peripherals.includes("gpio_fan") || props.peripherals.includes("ws2812")) && "AUTO"}
          </ListSubheader>}>
            {/* 风扇模式 */}
            {props.peripherals.includes("gpio_fan") &&
              <SettingSliderItem
                title="GPIO Fan Mode"
                subtitle="Set GPIO fan mode"
                valueFormat={(value) => GPIO_FAN_MODES[4 - value]}
                onChange={(event) => props.onChange('auto', 'gpio_fan_mode', 4 - event.target.value)}
                value={4 - props.configData.auto.gpio_fan_mode}
                sx={{ marginBottom: 0 }}
                min={0}
                max={4}
                step={1}
                marks
              />}
            {/* rgb设置显示 */}
            {props.peripherals.includes("ws2812") &&
              <>
                <SettingSwitchItem
                  title="RGB Enable"
                  subtitle="Whether to enable RGB"
                  onChange={(event) => props.onChange('auto', 'rgb_enable', event.target.checked)}
                  value={props.configData.auto.rgb_enable} />
                <SettingTextItem
                  title="RGB Color"
                  subtitle="Set RGB color"
                  value={props.configData.auto.rgb_color.replace("#", "")}
                  onChange={(event) => props.onChange('auto', 'rgb_color', event.target.value)}
                  start="#"
                />
                <SettingSliderItem
                  title="RGB Brightness"
                  subtitle="Set RGB brightness."
                  valueFormat={(value) => `${value}%`}
                  onChange={(event) => props.onChange('auto', 'rgb_brightness', event.target.value)}
                  value={props.configData.auto.rgb_brightness}
                  sx={{ marginTop: 2, }}
                  min={0}
                  max={100}
                />
                <ListItem>
                  <ListItemText primary="RGB Style" subheader="Set RGB animation style" />
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: "0" }}>
                    <Select
                      onChange={(event) => props.onChange('auto', "rgb_style", event.target.value)}
                      value={props.configData.auto.rgb_style}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      <MenuItem value="solid">Solid</MenuItem>
                      <MenuItem value="breathing">Breathing</MenuItem>
                      <MenuItem value="flow">Flow</MenuItem>
                      <MenuItem value="flow_reverse">Flow Reverse</MenuItem>
                      <MenuItem value="rainbow">Rainbow</MenuItem>
                      <MenuItem value="rainbow_reverse">Rainbow Reverse</MenuItem>
                      <MenuItem value="hue_cycle">Hue Cycle</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <SettingSliderItem
                  title="RGB Speed"
                  subtitle="Set RGB animation speed"
                  valueFormat={(value) => `${value}%`}
                  onChange={(event) => props.onChange('auto', 'rgb_speed', event.target.value)}
                  value={props.configData.auto.rgb_speed}
                  sx={{ marginTop: 2, }}
                  min={0}
                  max={100}
                />
              </>
            }
          </List>
          {/* MQTT */}
          {props.peripherals.includes("mqtt") &&
            <MQTTSection
              config={props.configData.mqtt}
              onChange={handleMQTTChanged}
              onError={handleError}
            />}
          {
            (
              props.peripherals.includes("shutdown_percentage") ||
              props.peripherals.includes("power_off_percentage") ||
              props.peripherals.includes("time") ||
              props.peripherals.includes("timezone") ||
              props.peripherals.includes("auto_time_enable") ||
              props.peripherals.includes("mac_address") ||
              props.peripherals.includes("ip_address") ||
              props.peripherals.includes("sd_card_usage")
            ) &&
            <SystemSection
              config={props.configData.system}
              onChange={props.onChange}
              onError={handleError}
              sendData={props.commonProps.sendData}
              request={props.commonProps.request}
              peripherals={props.peripherals}
            />}
        </Box>
        <CardActions>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            width={"100%"}
            spacing={12}
          >
            {/* <Button variant="contained" onClick={props.onCancel}>Cancel</Button>
            <Button
              disabled={Object.keys(hasError).length !== 0}
              variant="contained"
              onClick={props.onSave}
            >
              Save
            </Button> */}
          </Stack>
        </CardActions>
      </Paper >
    </Modal >
  );
};

const MQTTSection = (props) => {
  const [mqttTestState, setMqttTestState] = useState("idle");
  const [mqttTestErrorMsg, setMqttTestErrorMsg] = useState("");

  const handleTestMQTT = async () => {
    let sendData = props.config;
    setMqttTestState("loading");
    let data = await props.request("test-mqtt", "GET", sendData);
    if (data && data.status) {
      setMqttTestState("success");
    } else {
      setMqttTestState("failed");
      setMqttTestErrorMsg(data.error);
    }
  }

  return (
    <List subheader={<ListSubheader
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
    >
      <Box>MQTT</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {mqttTestState === "loading" && <CircularProgress sx={{ width: "2rem !important", height: "2rem !important" }} />}
        {mqttTestState === "success" && <Check />}
        {mqttTestState === "failed" && <Typography mt={0.5} color='red' >{mqttTestErrorMsg}</Typography>}
        <Button ml={2} onClick={handleTestMQTT}>Test</Button>
      </Box>
    </ListSubheader>}>
      <SettingTextItem
        title="Host"
        subtitle="MQTT broker host"
        value={props.config ? props.config.host : ""}
        onChange={(event) => props.onChange('host', event.target.value)}
      />
      <SettingNumberItem
        title="Port"
        subtitle="MQTT broker port, normally 1883"
        value={props.config ? props.config.port : ""}
        min={1}
        max={65535}
        onError={(error) => props.onError('mqtt_port', error)}
        onChange={(event) => props.onChange('port', event.target.value)}
      />
      <SettingTextItem
        title="Username"
        subtitle="Username to login to MQTT broker"
        value={props.config ? props.config.username : ""}
        autoComplete="username"
        name="username"
        onChange={(event) => props.onChange('username', event.target.value)}
      />
      <SettingPasswordItem
        title="Password"
        secondary="Password to login to MQTT broker"
        value={props.config ? props.config.password : ""}
        onChange={(event) => props.onChange('password', event.target.value)}
      />
    </List>
  )
}

const SettingToggleButtonItem = (props) => {
  let buttons = props.options.map((option, index) =>
    <ToggleButton value={option.value} key={option.value}>
      {option.name}
    </ToggleButton>
  )
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <ToggleButtonGroup size="small" value={props.value}
        onChange={props.onChange}
        exclusive={true}
        aria-label="Small sizes">
        {buttons}
      </ToggleButtonGroup>
    </SettingItem>
  )
}

const SettingNumberItem = (props) => {
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const validation = (value) => {
    // 如果外部传入校验函数，就直接使用外部校验函数
    if (props.validation) return props.validation(value);

    if (typeof value === "string" && value !== "") {
      // if (value === "" || value === undefined || value === NaN) {
      //   props.onError();
      //   return { status: false, message: "Port is required" };
      // }
      if (! /^\d+$/.test(value)) {
        props.onError(true);
        return { status: false, message: `Number is required` };
      }
    }
    // 如果没有传入最大最小值表示不使用
    if (props.min === undefined || props.max === undefined) return { status: true };
    if (value < props.min || value > props.max) {
      props.onError(true);
      return { status: false, message: `Out of range [${props.min}, ${props.max}]` };
    }
    props.onError(false);
    return { status: true };
  }

  const handleChange = (event) => {
    let newEvent = event;
    let value = event.target.value;
    let result = validation(value)
    if (result.status) {
      setError(false);
      setHelperText("");
      if (value !== "") {
        value = parseInt(value);
      }
      newEvent = { ...event, target: { ...event.target, value: value } };
    } else {
      setError(true);
      setHelperText(result.message);
    }
    props.onChange(newEvent);
  }
  return <SettingTextItem {...props}
    error={error}
    helperText={helperText}
    onChange={handleChange}
  />
}

const SettingTextItem = (props) => {
  let inputProps = null;
  if (props.start) {
    inputProps = {
      startAdornment: <InputAdornment position="start">{props.start}</InputAdornment>,
    }
  } else if (props.end) {
    inputProps = {
      endAdornment: <InputAdornment position="end">{props.end}</InputAdornment>,
    }
  }
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <TextField
        error={props.error || false}
        sx={{ width: "30%" }}
        variant={props.variant || "standard"}
        value={props.value}
        onChange={props.onChange}
        InputProps={inputProps}
        type={props.type || "text"}
        autoComplete={props.autoComplete || "off"}
        name={props.name}
        helperText={props.helperText}
        placeholder={props.placeholder}
      ></TextField>
    </SettingItem>
  )
}

const SettingSwitchItem = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Switch onChange={props.onChange} checked={props.value} />
    </SettingItem>
  )
}

const SettingItem = (props) => {
  return (<>
    <ListItem>
      <ListItemText primary={props.title} secondary={props.subtitle} />
      {props.children}
    </ListItem>
  </>
  )
}

const SettingPasswordItem = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Input
        sx={{ width: '30%' }}
        id="standard-adornment-password"
        type={showPassword ? 'text' : 'password'}
        onChange={props.onChange}
        value={props.value}
        autoComplete={props.autoComplete || "password"}
        endAdornment={
          <InputAdornment position="end" >
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleShowPassword}
              onMouseDown={handleShowPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </SettingItem>
  )
}

const SettingSliderItem = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Box
        sx={{ width: "50%", margin: "10px" }}
      >
        <Slider
          onChange={props.onChange}
          value={props.value}
          valueLabelFormat={props.valueFormat}
          valueLabelDisplay="auto"
          marks={props.marks}
          step={props.step}
          min={props.min}
          max={props.max}
        />
      </Box>
    </SettingItem>
  )
}

const DateTimePickerBak = (props) => {
  const [start, setStart] = useState(parseInt(window.localStorage.getItem("pm-dashboard-history-start")) || dayjs().subtract(5, "minute").unix());
  const [quickSelect, setQuickSelect] = useState(window.localStorage.getItem("pm-dashboard-history-quick-select") || "");
  const [label, setLabel] = useState(QuickSelect[quickSelect] || "");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const handleMenuShow = (event) => {
    setMenuAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  }

  const getTimeRange = (value) => {
    let start;
    if (value === "today") {
      start = dayjs().startOf("day").unix();
    } else if (value === "yesterday") {
      start = dayjs().subtract(1, "day").startOf("day").unix();
    } else if (value.startsWith("last")) {
      let temp = value.split("-");
      let number = parseInt(temp[1]);
      let unit = temp[2];
      start = dayjs().subtract(parseInt(number), unit).unix();
    }
    return [start];
  }

  const handleStartChange = (datetime) => {
    if (datetime.unix() === start) {
      return;
    }
    // 开始时间不能大于结束时间
    // if (datetime.unix() > end) {
    //   props.onError("Start time cannot be greater than end time");
    //   return;
    // }
    window.localStorage.setItem("pm-dashboard-history-start", datetime.unix());
    let startLabel = dayjs.unix(datetime.unix()).format("YYYY-MM-DD HH:mm:ss");
    // let endLabel = dayjs.unix(end).format("YYYY-MM-DD HH:mm:ss");
    setLabel(`${startLabel} `);
    setStart(datetime.unix());
    setQuickSelect("custom");
    props.onChange({ start: datetime.unix() });
    console.log(startLabel)
  }


  useEffect(() => {
    let interval = setInterval(() => {
      if (quickSelect !== "custom") {
        let [start] = getTimeRange(quickSelect);
        setStart(start);
        props.onChange({ start: start });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quickSelect]);
  // }, []);

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl sx={{ m: 1, width: '26ch' }} variant="outlined" size='smaall'>
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
          <Box id="custom-datetime-range" sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around", padding: "0 10px" }}>
              <DateTimeField
                value={dayjs.unix(start)}
                onChange={handleStartChange}
                format="YYYY-MM-DD HH:mm:ss"
                sx={{ margin: "auto", width: "100%" }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <DateCalendar value={dayjs.unix(start)} onChange={handleStartChange} />
            </Box>
          </Box>
        </Box>
      </Menu>
    </LocalizationProvider >
  );
}

const DateTimePickerBak2 = (props) => {
  const [start, setStart] = useState(parseInt(window.localStorage.getItem("pm-dashboard-history-start")) || dayjs().subtract(5, "minute").unix());
  const [quickSelect, setQuickSelect] = useState(window.localStorage.getItem("pm-dashboard-history-quick-select") || "");
  const [label, setLabel] = useState(QuickSelect[quickSelect] || "");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const handleMenuShow = (event) => {
    setMenuAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  }

  const getTimeRange = (value) => {
    let start;
    if (value === "today") {
      start = dayjs().startOf("day").unix();
    } else if (value === "yesterday") {
      start = dayjs().subtract(1, "day").startOf("day").unix();
    } else if (value.startsWith("last")) {
      let temp = value.split("-");
      let number = parseInt(temp[1]);
      let unit = temp[2];
      start = dayjs().subtract(parseInt(number), unit).unix();
    }
    return [start];
  }

  const handleStartChange = (datetime) => {
    if (datetime.unix() === start) {
      return;
    }
    // 开始时间不能大于结束时间
    // if (datetime.unix() > end) {
    //   props.onError("Start time cannot be greater than end time");
    //   return;
    // }
    window.localStorage.setItem("pm-dashboard-history-start", datetime.unix());
    let startLabel = dayjs.unix(datetime.unix()).format("YYYY-MM-DD HH:mm:ss");
    // let endLabel = dayjs.unix(end).format("YYYY-MM-DD HH:mm:ss");
    setLabel(`${startLabel} `);
    setStart(datetime.unix());
    setQuickSelect("custom");
    props.onChange({ start: datetime.unix() });
    console.log(startLabel)
  }


  useEffect(() => {
    let interval = setInterval(() => {
      if (quickSelect !== "custom") {
        let [start] = getTimeRange(quickSelect);
        setStart(start);
        props.onChange({ start: start });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quickSelect]);
  // }, []);

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box id="custom-datetime-range" sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around", padding: "0 10px" }}>
            <DateTimeField
              value={dayjs.unix(start)}
              onChange={handleStartChange}
              format="YYYY-MM-DD HH:mm:ss"
              sx={{ margin: "auto", width: "100%" }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <DateCalendar value={dayjs.unix(start)} onChange={handleStartChange} />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider >
  );
}

const SystemSection = (props) => {
  return (
    <List subheader={<ListSubheader
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
    >
      <Box>SYSTEM</Box>
    </ListSubheader >}>
      {/* 温度单位 */}
      {props.peripherals.includes("temperature_unit") &&
        <SettingToggleButtonItem
          title="Temperature Unit"
          subtitle="Set prefer temperature unit"
          onChange={(event) => props.onChange('system', 'temperature_unit', event.target.value)}
          value={props.config.temperature_unit}
          options={[
            { value: 'C', name: 'Celius' },
            { value: 'F', name: 'Fahrenheit' },
          ]} />
      }
      {/* 关机百分比 */}
      {props.peripherals.includes("shutdown_percentage") &&
        <SettingSliderItem
          title="Shutdown Stratagy"
          subtitle="Send shutdown request, if the battery percentage falls below this and no input power."
          valueFormat={(value) => `${value}%`}
          onChange={(event) => props.onChange('system', 'shutdown_percentage', event.target.value)}
          value={props.config.shutdown_percentage}
          sx={{ marginTop: 2, }}
          min={10}
          max={100}
          step={10}
          marks
        />}
      {/* 电池保护 */}
      {props.peripherals.includes("power_off_percentage") &&
        <SettingSliderItem
          title="Power Off Stratagy"
          subtitle="Power off if the battery percentage falls below this."
          valueFormat={(value) => `${value}%`}
          onChange={(event) => props.onChange('system', 'power_off_percentage', event.target.value)}
          value={props.config.power_off_percentage}
          sx={{ marginTop: 2, }}
          min={5}
          max={100}
          step={5}
          marks
        />}
      {/* 当前时间 */}
      {
        props.peripherals.includes("time") &&
        <CurrentTime
          title="Current Time"
          subtitle=""
          peripherals={props.peripherals}
          config={props.config}
          request={props.request}
        />
      }
      {/* 时区选择 */}
      {
        props.peripherals.includes("timezone") &&
        <Timezone
          title="Timezone"
          subtitle=""
          config={props.config}
          onChange={props.onChange}
        />
      }
      {/* 自动设置时间 */}
      {
        props.peripherals.includes("auto_time_enable") &&
        <SettingSwitchItem
          title="Auto Time Setting"
          value={props.config.auto_time_switch}
          // subtitle="Whether to enable Dark Theme mode"
          onChange={(event) => props.onChange('system', 'auto_time_switch', event.target.checked)}
        />
      }
      {
        props.peripherals.includes("auto_time_enable") &&
        <NTPServer
          title="NTP Server"
          subtitle=""
          onChange={props.onChange}
          value={props.config.ntp_server}
          sendData={props.sendData}
          disabled={!props.config.auto_time_switch}
        />
      }
      {/* Mac地址 */}
      {props.peripherals.includes("mac_address") &&
        <SettingItem
          title="Mac Address"
          subtitle=""
        >
          <Typography mt={0.5} >{props.config.mac_address}</Typography>
        </SettingItem>}
      {props.peripherals.includes("ip_address") &&
        <SettingItem
          title="IP Address"
          subtitle=""
        >
          <Typography mt={0.5} >{props.config.ip_address}</Typography>
        </SettingItem>}
      {
        props.peripherals.includes("sd_card_usage") &&
        <SDCardUsage
          title="Micro SD card usage"
          subtitle=""
          used={props.config.sd_card_used}
          total={props.config.sd_card_total}
        />
      }

    </List >
  )
}

const CurrentTime = (props) => {
  let disabled = !props.peripherals.includes("auto_time_enable") || props.config.auto_time_switch;
  const [currentTime, setCurrentTime] = useState('');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  // const [updateDataInterval, setUpdateDataInterval] = useState(1000);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleTimeRangeChange = (data) => {
    console.log("handleTimeRangeChange", data);
    if (data.start !== undefined) {
      setStart(data.start);
    }
    if (data.end !== undefined) {
      setEnd(data.end);
    }
  }

  const getCurrentTime = async () => {
    const newCurrentTime = await props.request("get-timestamp");
    setCurrentTime(newCurrentTime * 1000);
    // if (newCurrentTime) {
    //   let date = new Date(newCurrentTime * 1000);
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0');
    //   const hours = String(date.getHours()).padStart(2, '0');
    //   const minutes = String(date.getMinutes()).padStart(2, '0');
    //   const seconds = String(date.getSeconds()).padStart(2, '0');
    //   const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    //   setCurrentTime(formattedTime);
    // }
    // dayjs.extend(utc);
    // dayjs.extend(timezone);
    // const offset = parseInt(props.config.timezone.replace('UTC', '')); // 提取偏移量
    // const formattedTime = dayjs(newCurrentTime).utcOffset(offset).format('YYYY-MM-DD HH:mm:ss');
    // console.log("getCurrentTime", formattedTime)

  }

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={dayjs(currentTime)}
          onChange={handleTimeRangeChange}
          // timezone="UTC-8"
          disableOpenPicker={disabled} />
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
        <Typography >{currentTime}</Typography>

        <Box sx={{ flexGrow: 0 }}>
          <Button sx={{ padding: "0 0" }} disabled={disabled} onClick={handleOpenUserMenu}>Edit</Button>
          <Menu
            sx={{ mt: '35px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <DateTimePicker
              title="Timing"
              subtitle=""
              onChange={handleTimeRangeChange}
              onError={(msg) => props.commonProps.showSnackBar("error", msg)}
            />
          </Menu>
        </Box>
      </Box> */}
      </LocalizationProvider>
    </SettingItem>
  )
}

// 时区选择
const Timezone = (props) => {
  let data = props.config.timezone;

  // data 如 "UTC-8:00" 转为 "(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei"
  let option = TIMEZONE_MAP.find(timezone => timezone.data == data);

  // if (data.includes("-")) {
  //   data = data.replace("-", "+")
  // } else {
  //   data = data.replace("+", "-")
  // }
  // data = data.replace(/\b(\d)\b/, '0$1');
  // let matchingTimezone = TIMEZONE_MAP.find(timezone => timezone.label.includes(data));
  // console.log("matchingTimezone", matchingTimezone)
  // data = matchingTimezone ? matchingTimezone.label : TIMEZONE_MAP[0].label;

  // const handleChange = (event, value) => {
  //   console.log(props)
  //   let data = value.label;
  //   const regex = /^\(.*?\)/;
  //   data = data.match(regex)[0];
  //   data = data.slice(1, -1);
  //   if (data.includes("-")) {
  //     data = data.replace("-", "+")
  //   } else {
  //     data = data.replace("+", "-")
  //   }

  //   props.onChange('system', "timezone", data)
  // };
  const handleChange = (event, option) => {
    props.onChange('system', "timezone", option.data)
    // alert(event.target.value)
  };

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={TIMEZONE_MAP}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Timezone" />}
        // value={props.config.timezone}
        value={option}
        onChange={handleChange}
      />
    </SettingItem>
  )

}

const NTPServer = (props) => {
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    props.onChange('system', "ntp_server", event.target.value);
    setValue(event.target.value);
    // alert(event.target.value)
  }
  const handleSyncNow = async () => {
    const ntpServerIp = value;
    console.log(ntpServerIp);
    let responseData = await props.sendData("set-time-sync", ntpServerIp);
    // if (responseData.status) {
    //   showSnackBar("success", "Save Successfully");
    // }
  }
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <Input
          id="standard-adornment-password"
          type='text'
          value={props.value}
          disabled={props.disabled}
          onChange={handleChange}
          endAdornment={
            !props.disabled &&
            <InputAdornment position="end">
              <Button variant="text" onClick={handleSyncNow} disabled={props.disabled}>Sync Now</Button>
            </InputAdornment>
          }
        />
      </FormControl>
    </SettingItem>



  )
}

// SD卡容量占用
const SDCardUsage = (props) => {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 16,
    borderRadius: 7,
    marginTop: "0px !important",
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }));

  // 占用
  let usage = props.used / props.total * 100;
  let usedString = formatBytes(props.used, 'M');
  let totalString = formatBytes(props.total, 'M');
  let msg = `${usedString}B / ${totalString}B`;

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Box><Typography >{msg}</Typography></Box>
        <BorderLinearProgress variant="determinate" value={usage} />
      </Stack>
    </SettingItem>
  )
}



export default SettingPage;