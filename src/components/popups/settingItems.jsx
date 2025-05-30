import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { useMediaQuery } from '@mui/material';

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

import { DateTime, Settings as LuxonSettings } from 'luxon';

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
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  let flexDirection = 'row';

  if (props.wrap && isSmallScreen) flexDirection = 'column';

  return (<>
    <ListItem sx={{ flexDirection: flexDirection }}>
      <ListItemText primary={props.title} secondary={props.subtitle} sx={{ width: '100%' }} />
      <Box sx={{ display: 'flex', flexFlow: 'right', justifyContent: 'flex-end', width: '100%' }}>
        {props.children}
      </Box>
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
    <SettingItem {...props} >
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
        if (props.onError) props.onError(true);
        return { status: false, message: `An integer is required` };
      }
    }
    // 如果没有传入最大最小值表示不使用
    if (props.min === undefined || props.max === undefined) return { status: true };
    if (value < props.min || value > props.max) {
      if (props.onError) props.onError(true);
      return { status: false, message: `Out of range [${props.min}, ${props.max}]` };
    }
    if (props.onError) props.onError(false);
    return { status: true };
  }

  const handleChange = (event) => {
    let newEvent = event;
    // let value = event.target.value;
    let value = event;
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
    if (props.onChange) props.onChange(value);
  }
  return <SettingItemText {...props}
    error={error}
    helperText={helperText}
    onChange={handleChange}
    onBlur={props.onBlur}
    type="number"
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
    <SettingItem {...props} >
      <TextField
        error={props.error || false}
        sx={{ width: props.width || "100%" }}
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
        onBlur={props.onBlur}
      >
      </TextField>
      {
        props.children && props.children
      }
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
    <SettingItem {...props} >
      {loading && <CircularProgress size={20} />}
      <Switch onChange={handleChange} checked={props.value || false} disabled={loading} />
    </SettingItem>
  )
}

const SettingItemPassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SettingItem {...props} wrap >
      <Input
        sx={{ width: '100%' }}
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

  let label = props.valueFormat ? props.valueFormat(value) : value;

  return (
    <SettingItem {...props} wrap >
      <Box
        sx={{ width: "80%" }}
      >
        {props.upperLabel && <Typography sx={{ padding: "0 3", width: "100%", textAlign: "right" }}>{label}</Typography>}
        <Slider
          onChangeCommitted={handleChangeCommitted}
          onChange={handleChange}
          value={value}
          valueLabelFormat={props.valueFormat}
          valueLabelDisplay={props.upperLabel ? "off" : "auto"}
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
    <SettingItem {...props}>
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
  const [currentTime, setCurrentTime] = useState(props.value || 0);
  const [changing, setChanging] = useState(false);

  const handleTimeAccepted = (newTime) => {
    let timestamp = newTime.toSeconds();
    props.onAccept(timestamp);
    setChanging(false);
  }

  const handleTimeChanged = () => {
    setChanging(true);
  }

  useEffect(() => {
    if (!changing) {
      setCurrentTime(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  const adapterLocale = navigator.language.toLowerCase().split('-')[0];

  return (
    <SettingItem {...props} wrap >
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={adapterLocale}>
        <DateTimePicker
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
  let option = TIMEZONE_MAP.find(timezone => timezone.data === props.value);
  LuxonSettings.defaultZone = option.offset;

  const handleChange = (event, option) => {
    props.onChange(option.data)
  };

  return (
    <SettingItem {...props} wrap >
      <Autocomplete
        disablePortal
        id={props.id}
        options={TIMEZONE_MAP}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label={props.title} />}
        value={option}
        onChange={handleChange}
      />
    </SettingItem>
  )
}

// SD卡容量占用
const SettingItemSDCardUsage = (props) => {
  // 占用
  let usage = props.used / props.total * 100;
  let usedString = formatBytes(props.used, 'M');
  let totalString = formatBytes(props.total, 'M');
  let msg = `${usedString}B / ${totalString}B`;

  return (
    <SettingItem {...props} wrap >
      <Stack sx={{ flexGrow: 1 }}>
        <Box><Typography >{msg}</Typography></Box>
        <LinearProgress variant="determinate" value={usage} />
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
    setLoading(true);
    setTimerId(setTimeout(getSsidList, 1000));
  }

  const getSsidList = async () => {
    let ssidList = await props.request("get-wifi-scan", "GET",);
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
    <SettingItem {...props} wrap >
      <Autocomplete
        id={props.id}
        sx={{ width: "100%" }}
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
        onInputChange={(event, newInputValue) => {
          props.onIinputChange(newInputValue);
        }}
        options={options}
        loading={loading}
        freeSolo
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
  return <SettingItem {...props} >
    <Button
      onClick={props.onClick}
      variant={props.variant}
      color={props.color}
      startIcon={props.loading && <CircularProgress size={30} />}
    >
      {props.buttonText}
    </Button>
  </SettingItem>
}

const SettingItemFileSelector = (props) => {
  return <SettingItemText
    {...props}
    wrap
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