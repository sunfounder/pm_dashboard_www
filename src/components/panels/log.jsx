
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import Button from '@mui/material/Button';
import Panel from './panel.jsx';
import MuiToolTip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WrapIcon from '@mui/icons-material/WrapText';
import AutoScrollIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import AutoUpdateIcon from '@mui/icons-material/Autorenew.js';
import DescriptionIcon from '@mui/icons-material/Description';
import PopupFrame from '../popups/popupFrame.jsx';

const LogPanel = (props) => {
  const [logList, setLogList] = useState(JSON.parse(window.localStorage.getItem("pm-dashboard-log-logList")) || []);
  const [fileIndex, setFileIndex] = useState(parseInt(window.localStorage.getItem("pm-dashboard-log-fileIndex")) || 0);
  const [logFile, setLogFile] = useState(window.localStorage.getItem("pm-dashboard-log-logFile") || "");
  const [fileContent, setFileContent] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(window.localStorage.getItem("pm-dashboard-log-autoUpdate") === "true");
  const [filter, setFilter] = useState(window.localStorage.getItem("pm-dashboard-log-filter") || "");
  const [lines, setLines] = useState(window.localStorage.getItem("pm-dashboard-log-lines") || 100);
  const [level, setLevel] = useState(window.localStorage.getItem("pm-dashboard-log-level") || "INFO");
  const [autoScroll, setAutoScroll] = useState(window.localStorage.getItem("pm-dashboard-log-autoScroll") === "true");
  const [wrap, setWrap] = useState(window.localStorage.getItem("pm-dashboard-log-wrap") === "true");
  const [element, setElement] = useState(null);
  // const [downloadElement, setDownloadElement] = useState(null);
  const [getLogFinished, setGetLogFinished] = useState(true);
  const [popupStatus, setPopupStatus] = useState(false);
  const [deleteFilename, setDeleteFilename] = useState(window.localStorage.getItem("pm-dashboard-log-logFile") || "");

  const contentRef = useRef(null);

  const getLog = useCallback(async () => {
    if (!logFile) return;
    if (!logList.includes(logFile)) {
      setLogFile(logList[fileIndex]);
    }
    let payload = {
      filename: logFile,
      filter: filter,
      lines: lines,
      level: level,
    }
    let result = await props.request('get-log', 'GET', payload);
    setGetLogFinished(true);
    setFileContent(result);
  }, [logFile, filter, lines, level, props.request]);

  const handleFileSelect = async (event, filename) => {
    const index = logList.indexOf(filename);
    window.localStorage.setItem("pm-dashboard-log-fileIndex", index);
    window.localStorage.setItem("pm-dashboard-log-logFile", filename);
    setFileIndex(index);
    setLogFile(filename);
  }

  const getLogList = useCallback(async () => {
    let result = await props.request('get-log-list', 'GET');
    if (!result) {
      props.showSnackBar("error", "Failed to get log list");
      return;
    }
    if (result.length === 0) {
      setLogFile("");
      setFileContent([]);
      window.localStorage.setItem("pm-dashboard-log-logFile", "");
    }
    result.sort();
    if (result.length > fileIndex) {
      setLogFile(result[fileIndex]);
    }
    window.localStorage.setItem("pm-dashboard-log-logList", JSON.stringify(result));
    setLogList(result);
  }, [fileIndex,]);

  const handleConfigChange = (config) => {
    if (config.lines !== undefined) {
      if (config.lines < 1) {
        config.lines = 10;
      }
      window.localStorage.setItem("pm-dashboard-log-lines", config.lines);
      setLines(config.lines);
    }
    if (config.level !== undefined) {
      window.localStorage.setItem("pm-dashboard-log-level", config.level);
      setLevel(config.level);
    }
    if (config.filter !== undefined) {
      window.localStorage.setItem("pm-dashboard-log-filter", config.filter);
      setFilter(config.filter);
    }
    if (config.autoUpdate !== undefined) {
      window.localStorage.setItem("pm-dashboard-log-autoUpdate", config.autoUpdate);
      setAutoUpdate(config.autoUpdate);
    }
    if (config.autoScroll !== undefined) {
      window.localStorage.setItem("pm-dashboard-log-autoScroll", config.autoScroll);
      setAutoScroll(config.autoScroll);
    }
    if (config.wrap !== undefined) {
      window.localStorage.setItem("pm-dashboard-log-wrap", config.wrap);
      setWrap(config.wrap);
    }
  }

  const handleDownload = async () => {
    let content = fileContent.join("");
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = logFile;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const handleDeleteLogFile = async (event, filename) => {
    // 阻止事件冒泡
    event.stopPropagation();
    let sendFiename = filename ? filename : logFile;
    setDeleteFilename(sendFiename);
    setPopupStatus(!popupStatus);
  }

  const handleDeleteLogConfirm = async () => {
    setPopupStatus(!popupStatus);
    if (!deleteFilename) return;
    let result = await props.sendData('delete-log-file', { 'filename': deleteFilename });
    if (result === "OK") {
      getLogList();
      let logFile = logList[0];
      if (logList[fileIndex + 1]) {
        logFile = logList[fileIndex + 1];
      } else if (!logList[fileIndex + 1] && logList.length > 2) {
        logFile = logList[logList.length - 2];
        setFileIndex(logList.length - 2);
        window.localStorage.setItem("pm-dashboard-log-fileIndex", logList.length - 2);
      }
      setLogFile(logFile);
      if (logList.length > 0) {
        window.localStorage.setItem("pm-dashboard-log-logFile", logFile);
      }
      props.showSnackBar("success", "Delete log file successfully");
    }
  }

  const handlePopup = () => {
    setPopupStatus(!popupStatus);
  }

  useEffect(() => {
    getLogList();
  }, [getLogList]);

  // 自动更新
  useEffect(() => {
    let interval = setInterval(() => {
      if (autoUpdate && logFile && getLogFinished) {
        setGetLogFinished(false);
        getLog();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getLog, lines, level, filter, autoUpdate, logFile]);

  // 自动更新
  useEffect(() => {
    getLog();
  }, [getLog, lines, level, filter, logFile]);

  useEffect(() => {
    if (autoScroll) {
      const contentElement = contentRef.current;
      contentElement.scrollTop = contentElement.scrollHeight;
    }
  }, [fileContent, autoScroll]);

  useEffect(() => {
    let newElement = <Card id="log-list" sx={{ width: '100%', overflow: "auto", height: '100%' }}>
      <List component="nav" dense>
        {logList.map((filename, index) => {
          // let logName = filename.replace(".log", "");
          // let moduleName = '';
          // if (logName.includes('.')) {
          //   moduleName = logName.split('.')[0];
          //   logName = logName.split('.')[1];
          // }
          let logNameArr = filename.split(".");
          let logName;
          if (logNameArr[0] === "pm_dashboard" || logNameArr[0] === "pm_auto") {
            logName = logNameArr[1];
          } else {
            logName = logNameArr[0];
          }
          if (logNameArr[3]) {
            logName = logNameArr[1] + "." + logNameArr[3];
          }
          let moduleName = logNameArr[0];

          return <ListItemButton key={index} selected={index === fileIndex} onClick={(event) => handleFileSelect(event, filename)}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary={logName} secondary={moduleName} />
            <ListItemIcon sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
              <DeleteForeverIcon onClick={(event) => handleDeleteLogFile(event, filename)} />
            </ListItemIcon>
          </ListItemButton>
        })}
      </List>
    </Card >;
    setElement(newElement);
    props.onElementChange(element); // 组件加载时调用父组件的回调函数，并传递元素
  }, [element, props.onElementChange]);

  // useEffect(() => {
  //   let newDownloadElement = <Tooltip title="Download log file">
  //     <IconButton aria-label="download" color="red" onClick={handleDownload}>
  //       <DownloadIcon />
  //     </IconButton>
  //   </Tooltip>;
  //   setDownloadElement(newDownloadElement);
  //   props.onDownloadElementChange(downloadElement); // 组件加载时调用父组件的回调函数，并传递元素
  // }, [downloadElement, props.onDownloadElementChange]);

  return (<Panel id="log-panel" title="Log" {...props} sx={{ height: "100%", overflow: "hidden" }}
  >
    <Box sx={{ display: "flex", width: "100%", height: "100%", gap: "2rem" }}>
      <Box id="log-content" sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <Toolbox
          lines={lines}
          level={level}
          filter={filter}
          wrap={wrap}
          autoUpdate={autoUpdate}
          autoScroll={autoScroll}
          onChange={handleConfigChange}
          handleDownload={handleDownload}
          onDeleteLogFile={handleDeleteLogFile}
        />
        <Box ref={contentRef} sx={{ flexGrow: 1, overflow: `${wrap ? "hidden" : "auto"} auto` }}>
          <Typography Typography whiteSpace="pre-line" sx={{ fontFamily: "Courier New", textWrap: wrap ? "wrap" : "nowrap" }}>
            {fileContent ? fileContent.join("") : ""}
          </Typography>
        </Box>
      </Box>
      <PopupFrame open={popupStatus} onClose={handlePopup} title="Warning" width="30rem">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ margin: "0 1rem 1rem 1rem" }}>Do you want to delete the selected file? And this action cannot be undone.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginBottom: "0.5rem" }}>
          <Button variant="contained" color='error' sx={{ width: "28rem" }} onClick={handleDeleteLogConfirm}>DELETE "{deleteFilename}" FILE</Button>
        </Box>
      </PopupFrame>
    </Box >
  </Panel >
  );
}

const Toolbox = (props) => {
  const [toggleGroupValues, setToggleGroupValues] = useState([]);

  useEffect(() => {
    let values = [];
    if (props.wrap) values.push("wrap");
    if (props.autoScroll) values.push("autoScroll");
    if (props.autoUpdate) values.push("autoUpdate");
    setToggleGroupValues(values);
  }, [props.wrap, props.autoScroll, props.autoUpdate]);

  const handleToggleGroupChange = (event, newValues) => {
    setToggleGroupValues(newValues);
    props.onChange({
      wrap: newValues.includes("wrap"),
      autoScroll: newValues.includes("autoScroll"),
      autoUpdate: newValues.includes("autoUpdate")
    });
  }

  const handleLinesChange = (event) => {
    props.onChange({ lines: event.target.value });
  }

  const handleLevelChange = (event) => {
    props.onChange({ level: event.target.value });
  }

  const handleFilterChange = (event) => {
    props.onChange({ filter: event.target.value });
  }

  // const handleAutoUpdateChanges = (event) => {
  //   props.onChange({ autoUpdate: event.target.checked });
  // }

  // const handleAutoScrollChanges = (event) => {
  //   props.onChange({ autoScroll: event.target.checked });
  // }

  let isMobile = window.matchMedia("(max-width: 767px)").matches;

  return (
    <Box sx={{ width: "100%", display: "flex", margin: "10px 0", gap: "9px", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row" }}>
      <Box sx={{ width: "100%", display: "flex", margin: !isMobile ? "10px 0" : "0", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        {!isMobile &&
          <TextField id="lines-number" label="Lines" variant="outlined" size="small" value={props.lines} sx={{ width: isMobile ? "54px" : "100px" }} onChange={handleLinesChange} />
        }
        {
          isMobile &&
          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <TextField id="lines-number" label="Lines" variant="outlined" size="small" value={props.lines} sx={{ width: isMobile ? "54px" : "100px" }} onChange={handleLinesChange} />
            <FormControl size="small">
              <InputLabel id="level">Level</InputLabel>
              <Select
                labelId="level-label"
                id="level"
                value={props.level}
                label="Level"
                onChange={handleLevelChange}
              >
                <MenuItem value={"DEBUG"}>Debug</MenuItem>
                <MenuItem value={"INFO"}>Info</MenuItem>
                <MenuItem value={"WARNING"}>Warning</MenuItem>
                <MenuItem value={"ERROR"}>Error</MenuItem>
                <MenuItem value={"CRITICAL"}>Critical</MenuItem>
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={toggleGroupValues}
              onChange={handleToggleGroupChange}
              size="small"
            >
              <ToggleButton value="wrap" aria-label="wrap">
                <Tooltip title="Line Wrap">
                  <WrapIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="autoScroll" aria-label="autoScroll">
                <Tooltip title="Auto Scroll">
                  <AutoScrollIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="autoUpdate" aria-label="autoUpdate">
                <Tooltip title="Auto Update">
                  <AutoUpdateIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <IconButton id="delete" aria-label="delete" color="primary" >
              <MuiToolTip title="Delete CSV">
                <DeleteForeverIcon onClick={props.onDeleteLogFile} />
              </MuiToolTip>
            </IconButton>
            <IconButton id="download" aria-label="download" color="primary" onClick={props.handleDownload}>
              <MuiToolTip title="Download CSV">
                <DownloadIcon />
              </MuiToolTip>
            </IconButton>
          </Box>
        }
        {
          !isMobile &&
          <FormControl size="small">
            <InputLabel id="level">Level</InputLabel>
            <Select
              labelId="level-label"
              id="level"
              value={props.level}
              label="Level"
              onChange={handleLevelChange}
            >
              <MenuItem value={"DEBUG"}>Debug</MenuItem>
              <MenuItem value={"INFO"}>Info</MenuItem>
              <MenuItem value={"WARNING"}>Warning</MenuItem>
              <MenuItem value={"ERROR"}>Error</MenuItem>
              <MenuItem value={"CRITICAL"}>Critical</MenuItem>
            </Select>
          </FormControl>
        }
        <TextField id="filter" label="Filter" variant="outlined" size="small" value={props.filter} onChange={handleFilterChange} sx={{ flexGrow: 1 }} />
      </Box>
      {/* <FormControlLabel control={<Checkbox defaultChecked value={props.autoUpdate} onChange={handleAutoUpdateChanges} />} label="Auto Update" />
      <FormControlLabel control={<Checkbox defaultChecked value={props.autoScroll} onChange={handleAutoScrollChanges} />} label="Auto Scroll" /> */}
      {
        !isMobile &&
        <Box sx={{ display: "flex", margin: !isMobile ? "10px 0" : "0", gap: "9px", alignItems: "center" }}>
          <ToggleButtonGroup
            value={toggleGroupValues}
            onChange={handleToggleGroupChange}
            size="small"
          >
            <ToggleButton value="wrap" aria-label="wrap">
              <Tooltip title="Line Wrap">
                <WrapIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="autoScroll" aria-label="autoScroll">
              <Tooltip title="Auto Scroll">
                <AutoScrollIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="autoUpdate" aria-label="autoUpdate">
              <Tooltip title="Auto Update">
                <AutoUpdateIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton id="delete" aria-label="delete" color="primary" >
            <MuiToolTip title="Delete CSV">
              <DeleteForeverIcon onClick={props.onDeleteLogFile} />
            </MuiToolTip>
          </IconButton>
          <IconButton id="download" aria-label="download" color="primary" onClick={props.handleDownload}>
            <MuiToolTip title="Download CSV">
              <DownloadIcon />
            </MuiToolTip>
          </IconButton>
        </Box>
      }
    </Box>
  );
}

export default LogPanel;
