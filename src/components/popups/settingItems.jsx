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
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Button,
} from '@mui/material';

import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import { DateTime, Settings } from 'luxon';

import {
  Visibility,
  VisibilityOff,
  Check,
} from '@mui/icons-material';

import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
import SignalWifi2BarIcon from '@mui/icons-material/SignalWifi2Bar';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import SignalWifi4BarIcon from '@mui/icons-material/SignalWifi4Bar';
import SignalWifi1BarLockIcon from '@mui/icons-material/SignalWifi1BarLock';
import SignalWifi2BarLockIcon from '@mui/icons-material/SignalWifi2BarLock';
import SignalWifi3BarLockIcon from '@mui/icons-material/SignalWifi3BarLock';
import SignalWifi4BarLockIcon from '@mui/icons-material/SignalWifi4BarLock';
import UploadIcon from '@mui/icons-material/Upload';

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
  { data: 'UTC+12:00', offset: 'UTC-12:00', label: '(UTC-12:00) International Date Line West' },
  { data: 'UTC+11:00', offset: 'UTC-11:00', label: '(UTC-11:00) Midway Island, Samoa' },
  { data: 'UTC+10:00', offset: 'UTC-10:00', label: '(UTC-10:00) Hawaii' },
  { data: 'UTC+09:00', offset: 'UTC-09:00', label: '(UTC-09:00) Alaska' },
  { data: 'UTC+08:00', offset: 'UTC-08:00', label: '(UTC-08:00) Pacific Time (US & Canada)' },
  { data: 'UTC+07:00', offset: 'UTC-07:00', label: '(UTC-07:00) Mountain Time (US & Canada)' },
  { data: 'UTC+06:00', offset: 'UTC-06:00', label: '(UTC-06:00) Central Time (US & Canada), Mexico City' },
  { data: 'UTC+05:00', offset: 'UTC-05:00', label: '(UTC-05:00) Eastern Time (US & Canada), Bogota, Lima' },
  { data: 'UTC+04:00', offset: 'UTC-04:00', label: '(UTC-04:00) Atlantic Time (Canada), Caracas, La Paz' },
  { data: 'UTC+03:30', offset: 'UTC-03:30', label: '(UTC-03:30) Newfoundland' },
  { data: 'UTC+03:00', offset: 'UTC-03:00', label: '(UTC-03:00) Brasilia, Buenos Aires, Georgetown' },
  { data: 'UTC+02:00', offset: 'UTC-02:00', label: '(UTC-02:00) Mid-Atlantic' },
  { data: 'UTC+01:00', offset: 'UTC-01:00', label: '(UTC-01:00) Azores, Cape Verde Islands' },
  { data: 'UTC', offset: 'UTC', label: '(UTC) Dublin, Edinburgh, Lisbon, London, Casablanca' },
  { data: 'UTC-01:00', offset: 'UTC+01:00', label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
  { data: 'UTC-02:00', offset: 'UTC+02:00', label: '(UTC+02:00) Athens, Bucharest, Istanbul, Cairo' },
  { data: 'UTC-03:00', offset: 'UTC+03:00', label: '(UTC+03:00) Moscow, St. Petersburg, Volgograd' },
  { data: 'UTC-03:30', offset: 'UTC+03:30', label: '(UTC+03:30) Tehran' },
  { data: 'UTC-04:00', offset: 'UTC+04:00', label: '(UTC+04:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
  { data: 'UTC-04:30', offset: 'UTC+04:30', label: '(UTC+04:30) Kabul' },
  { data: 'UTC-05:00', offset: 'UTC+05:00', label: '(UTC+05:00) Islamabad, Karachi, Tashkent' },
  { data: 'UTC-05:30', offset: 'UTC+05:30', label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
  { data: 'UTC-05:45', offset: 'UTC+05:45', label: '(UTC+05:45) Kathmandu' },
  { data: 'UTC-06:00', offset: 'UTC+06:00', label: '(UTC+06:00) Astana, Dhaka, Almaty, Novosibirsk' },
  { data: 'UTC-06:30', offset: 'UTC+06:30', label: '(UTC+06:30) Yangon (Rangoon)' },
  { data: 'UTC-07:00', offset: 'UTC+07:00', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
  { data: 'UTC-08:00', offset: 'UTC+08:00', label: '(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei' },
  { data: 'UTC-09:00', offset: 'UTC+09:00', label: '(UTC+09:00) Osaka, Sapporo, Tokyo, Seoul' },
  { data: 'UTC-09:30', offset: 'UTC+09:30', label: '(UTC+09:30) Adelaide, Darwin' },
  { data: 'UTC-10:00', offset: 'UTC+10:00', label: '(UTC+10:00) Brisbane, Canberra, Melbourne, Sydney, Guam, Port Moresby' },
  { data: 'UTC-11:00', offset: 'UTC+11:00', label: '(UTC+11:00) Magadan, Solomon Islands, New Caledonia' },
  { data: 'UTC-12:00', offset: 'UTC+12:00', label: '(UTC+12:00) Auckland, Wellington, Fiji, Kamchatka' },
  { data: 'UTC-13:00', offset: 'UTC+13:00', label: '(UTC+13:00) Nuku\'alofa' },
]

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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
  const [value, setValue] = useState(props.value);
  const handleChange = (event) => {
    setValue(event.target.value);
    if (props.onChange) props.onChange(event.target.value);
  }
  const handleSubmit = () => {
    props.onSubmit(value);
  }

  let inputProps = null;
  if (props.start) {
    inputProps = {
      startAdornment: <InputAdornment position="start">{props.start}</InputAdornment>,
    }
  } else if (props.end) {
    inputProps = {
      endAdornment: <InputAdornment position="end">{props.end}</InputAdornment>,
    }
  } else if (props.submitable) {
    inputProps = {
      endAdornment: <InputAdornment position="end">
        <IconButton
          size="small"
          color="primary"
          onClick={handleSubmit}
          disabled={props.disabled}
        >
          <Check />
        </IconButton>
      </InputAdornment>,
    }
  }

  useEffect(() => {
    setValue(props.value);
  }, [props.value])

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <TextField
        error={props.error || false}
        sx={{ width: "40%" }}
        variant={props.variant || "standard"}
        value={value}
        onChange={handleChange}
        InputProps={inputProps}
        type={props.type || "text"}
        autoComplete={props.autoComplete || "off"}
        name={props.name}
        disabled={props.disabled}
        helperText={props.helperText}
        placeholder={props.placeholder}
      >
      </TextField>
    </SettingItem>
  )
}

const SettingItemSwitch = (props) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async (event) => {
    setLoading(true);
    await props.onChange(event.target.checked);
    setLoading(false);
  }
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      {loading && <CircularProgress size={20} />}
      <Switch onChange={handleChange} checked={props.value} disabled={loading} />
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
        id={props.id}
        type={showPassword ? 'text' : 'password'}
        onChange={props.onChange}
        value={props.value}
        disabled={props.disabled}
        autoComplete={props.autoComplete || "password"}
        endAdornment={
          <InputAdornment position="end" >
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleShowPassword}
              disabled={props.disabled}
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
  const [value, setValue] = useState(props.value || 0);

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange && props.onChange(event.target.value);
  }

  const handleChangeCommitted = async () => {
    if (!await props.onCommitted(value)) {
      setValue(props.value);
    }
  }

  useEffect(() => {
    setValue(props.value);
  }, [props.value])

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Box
        sx={{ width: "50%", margin: "10px" }}
      >
        <Slider
          onChangeCommitted={handleChangeCommitted}
          onChange={handleChange}
          value={value}
          getAriaValueText={props.valueFormat}
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

const SettingItemTime = (props) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [changing, setChanging] = useState(false);

  const getCurrentTime = async () => {
    const newCurrentTime = await props.request("get-timestamp");
    if (newCurrentTime && newCurrentTime !== currentTime) {
      setCurrentTime(newCurrentTime);
    }
  }

  const handleTimeAccepted = (newTime) => {
    let timestamp = newTime.toSeconds();
    console.log(timestamp);
    props.onAccept(timestamp);
    setChanging(false);
  }

  const handleTimeChanged = () => {
    console.log('handleTimeChanged');
    setChanging(true);
  }

  useEffect(() => {
    if (!changing) {
      const interval = setInterval(() => {
        getCurrentTime();
      }, 300);
      return () => clearInterval(interval);
    }
  }, [changing]);

  const adapterLocale = navigator.language.toLowerCase().split('-')[0];

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={adapterLocale}>
        <DateTimePicker
          views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
          value={DateTime.fromSeconds(currentTime)}
          onAccept={handleTimeAccepted}
          onChange={handleTimeChanged}
          readOnly={!props.editable} />
      </LocalizationProvider>
    </SettingItem>
  )
}

// 时区选择
const SettingItemTimezone = (props) => {

  // data 如 "UTC-8:00" 转为 "(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei"
  // console.log("props.value", props.value);
  let option = TIMEZONE_MAP.find(timezone => timezone.data === props.value);
  Settings.defaultZone = option.offset;

  const handleChange = (event, option) => {
    props.onChange(option.data)
  };

  return (
    <SettingItem title={props.title} subtitle={props.subtitle} >
      <Autocomplete
        disablePortal
        id={props.id}
        options={TIMEZONE_MAP}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={props.title} />}
        value={option}
        onChange={handleChange}
      />
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

const SettingItemSSIDList = (props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [ssidList, setSsidList] = useState([]);
  const [timerId, setTimerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWiFiStrengthIcon = (rssi, secure) => {
    if (rssi >= -60) {
      if (secure) return <SignalWifi4BarLockIcon />;
      else return <SignalWifi4BarIcon />;
    } else if (rssi >= -80) {
      if (secure) return <SignalWifi3BarLockIcon />;
      else return <SignalWifi3BarIcon />;
    } else if (rssi >= -90) {
      if (secure) return <SignalWifi2BarLockIcon />;
      else return <SignalWifi2BarIcon />;
    } else {
      if (secure) return <SignalWifi1BarLockIcon />;
      else return <SignalWifi1BarIcon />;
    }
  }

  const startWiFiScan = async (rssi) => {
    let status = await props.request("start-wifi-scan", "GET",);
    console.log("status", status);
    setLoading(true);
    setTimerId(setTimeout(getSsidList, 1000));
  }

  const getSsidList = async () => {
    let ssidList = await props.request("get-wifi-scan", "GET",);
    console.log("ssidList", ssidList);
    if (typeof ssidList === "object") {
      setSsidList(ssidList);
      let options = ssidList.map((ssid) => ssid.ssid);
      setOptions(options);
      setLoading(false);
      stopGetSsidList();
    } else if (ssidList === -2) {
      setLoading(false);
      stopGetSsidList();
    } else {
      setTimerId(setTimeout(getSsidList, 1000));
    }
  }

  const stopGetSsidList = () => {
    setLoading(false);
    setTimerId(clearTimeout(timerId));
  }

  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Autocomplete
        id={props.id}
        sx={{ width: "60%" }}
        open={open}
        value={props.value}
        disabled={props.disabled}
        onOpen={() => {
          setOpen(true);
          startWiFiScan();
        }}
        onClose={() => {
          setOpen(false);
          stopGetSsidList();
        }}
        onChange={(event, newValue) => {
          props.onChange(newValue);
        }}
        options={options}
        loading={loading}
        renderOption={(props, ssid) => {
          let ssidData = ssidList.find((item) => item.ssid === ssid);
          return (<Box component="li" sx={{ display: "flex", alignItems: 'space-between', '& > img': { flexShrink: 0 } }} {...props}>
            {getWiFiStrengthIcon(ssidData.rssi, ssidData.secure)}
            <Typography sx={{ flexGrow: 1, padding: "0 8px" }}>{ssidData.ssid}</Typography>
          </Box>)
        }}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </SettingItem>
  );
}

const SettingItemButton = (props) => {
  return <SettingItem title={props.title} subtitle={props.subtitle}>
    <Button
      onClick={props.onClick}
      startIcon={props.loading && <CircularProgress size={30} />}
    >
      {props.buttonText}
    </Button>
  </SettingItem>
}

const SettingItemFileSelector = (props) => {
  console.log("SettingItemFileSelector", props.value)
  return <SettingItemText
    title={props.title}
    subtitle={props.subtitle}
    editable={false}
    value={props.value}
    disabled={props.disabled}
    end={
      <IconButton
        component="label"
      >
        <UploadIcon />
        <VisuallyHiddenInput
          type="file"
          accept={props.accept}
          onChange={props.onChange}
          multiple={props.multiple}
        />
      </IconButton>
    }
  />
}

export {
  SettingItem,
  SettingItemButton,
  SettingItemToggleButton,
  SettingItemNumber,
  SettingItemText,
  SettingItemPassword,
  SettingItemSwitch,
  SettingItemSlider,
  SettingItemMenu,
  SettingItemTime,
  SettingItemTimezone,
  SettingItemSDCardUsage,
  SettingItemSSIDList,
  SettingItemFileSelector,
}