import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import {
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  InputAdornment,
  TextField,
  Switch,
  Input,
  IconButton,
  Slider,
  Stack,
  Button,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';

import { DateTimePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  Visibility,
  VisibilityOff,
  Check,
} from '@mui/icons-material';

import { formatBytes } from '../../js/utils';

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

const SettingItem = (props) => {
  return (<>
    <ListItem>
      <ListItemText primary={props.title} secondary={props.subtitle} />
      {props.children}
    </ListItem>
  </>
  )
}

const SettingItemToggleButton = (props) => {
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

const SettingItemNumber = (props) => {
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
  return <SettingItemText {...props}
    error={error}
    helperText={helperText}
    onChange={handleChange}
  />
}

const SettingItemText = (props) => {
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

const SettingItemSwitch = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Switch onChange={props.onChange} checked={props.value} />
    </SettingItem>
  )
}

const SettingItemPassword = (props) => {
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

const SettingItemSlider = (props) => {
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

const SettingItemMenu = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: "0" }}>
        <Select
          onChange={props.onChange}
          value={props.value}
        >
          {props.options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </SettingItem>
  )
}

const SettingItemCurrentTime = (props) => {
  const [currentTime, setCurrentTime] = useState('');

  const getCurrentTime = async () => {
    const newCurrentTime = await props.request("get-timestamp");
    setCurrentTime(newCurrentTime * 1000);
  }

  const handleTimeChanged = (newTime) => {
    console.log(newTime);
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
          onChange={handleTimeChanged}
          disableOpenPicker={props.editable} />
      </LocalizationProvider>
    </SettingItem>
  )
}

// 时区选择
const SettingItemTimezone = (props) => {

  // data 如 "UTC-8:00" 转为 "(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei"
  let option = TIMEZONE_MAP.find(timezone => timezone.data == props.value);

  const handleChange = (event, option) => {
    props.onChange(option.data)
  };

  return (
    <SettingItem title={props.title} subtitle={props.subtitle} >
      <Autocomplete
        disablePortal
        id="timezone-select"
        options={TIMEZONE_MAP}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={props.title} />}
        value={option}
        onChange={handleChange}
      />
    </SettingItem>
  )
}

const SettingItemNTPServer = (props) => {
  const [value, setValue] = useState(props.value);
  const handleChange = (event) => {
    setValue(event.target.value);
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
          value={value}
          disabled={props.disabled}
          onChange={handleChange}
          endAdornment={
            !props.disabled &&
            <InputAdornment position="end">
              <IconButton
                size="small"
                color="primary"
                onClick={props.onChange}
                disabled={props.disabled}
              >
                <Check />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </SettingItem>
  )
}

// SD卡容量占用
const SettingItemSDCardUsage = (props) => {
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

export {
  SettingItem,
  SettingItemToggleButton,
  SettingItemNumber,
  SettingItemText,
  SettingItemPassword,
  SettingItemSwitch,
  SettingItemSlider,
  SettingItemMenu,
  SettingItemCurrentTime,
  SettingItemTimezone,
  SettingItemNTPServer,
  SettingItemSDCardUsage,
}