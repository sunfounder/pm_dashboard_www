import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Box,
  LinearProgress,
  Typography,
  List,
  ListItem,
  Card,
  CardActions,
  ListItemText
} from '@mui/material';

import PopupFrame from './popupFrame.jsx';
import {
  SettingItem,
  SettingItemButton,
  SettingItemFileSelector,
} from './settingItems.jsx';

const PopupOTA = (props) => {
  const [loading, setLoading] = useState(false);
  const [linearWithValueLabel, setLinearWithValueLabel] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [latestVersion, setLatestVersion] = useState({ version: "", time: "", log: "", url: "" });
  const [fileName, setFileName] = useState('Select firmware');
  const [progress, setProgress] = useState(0);
  const [downloadButton, setDownloadButton] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");

  const handleUpgrade = async () => {
    console.log("手动升级");
    sendFile();
    setLinearWithValueLabel(true);
  }

  const getCurrentVersion = useCallback(async () => {
    let currentVersion = await props.request("get-version", "GET");
    setCurrentVersion(currentVersion);
  }, [props])

  const checkUpdate = async () => {
    let latestVersion = await getLatestVersion();
    if (latestVersion) {
      let result = compareVersions(latestVersion.version, currentVersion);
      if (result > 0) {
        console.log("有新版本");
        setDownloadButton(true);
      } else if (result < 0) {
        console.log("新版本号比当前版本号小");
      } else {
        console.log("版本相同");
        setDownloadButton(false);
      }
    }
  }

  const sendFile = async () => {
    const HOST = `http://pironman-u1.local:34001/api/v1.0/`;
    if (selectedFile) {
      let formData = new FormData();
      formData.append('update', selectedFile);
      let xhr = new XMLHttpRequest();
      xhr.open('POST', HOST + 'ota-update');
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          let progress = e.loaded / e.total * 100;
          console.log("progress", progress);
          setProgress(progress);
          if (progress === 100) {
            console.log('update success');
            props.showSnackBar("success", "Upgrade Success");
            setProgress(0);
          }
        }
      });
      xhr.send(formData);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file && file.type === "application/octet-stream") {
      // 处理选择的二进制文件
      setFileName(file.name);
    } else {
      // 文件类型不符合要求
      console.log("请选择二进制文件");
    }
  };


  const getLatestVersion = async () => {
    setLoading(true);
    const username = 'sunfounder';
    const repoName = 'pironman-u1-firmware';
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/releases/latest`);
      const data = await response.json();
      if (data) {
        setLoading(false);
      }
      const latestVersion = {
        version: data.tag_name,
        time: data.published_at,
        log: data.body,
        url: data.assets[0].browser_download_url
      }
      setLatestVersion(latestVersion);
      console.log('Latest version:', latestVersion);
      return latestVersion;
    } catch (error) {
      console.error('Error fetching latest release:', error);
      return false;
    }
  }

  const compareVersions = (latestVersion, oldVersion) => {
    const versionA = latestVersion.split('.').map(Number);
    const versionB = oldVersion.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if (versionA[i] > versionB[i]) {
        return 1;
      } else if (versionA[i] < versionB[i]) {
        return -1;
      }
    }
    return 0;
  }

  useEffect(() => {
    getCurrentVersion();
  }, [props.open]);


  return (
    <PopupFrame title="OTA" open={props.open} onClose={props.onCancel}>
      <SettingItemButton
        title="Current Version"
        subtitle={currentVersion}
        buttonText="Check for updates"
        onClick={checkUpdate}
      />
      {latestVersion.version !== "" &&
        <Card elevation={3} sx={{ margin: '10px' }}>
          <List dense={true}>
            <ListItem>
              <ListItemText primary="Latest version" secondary={latestVersion.version}></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText primary="Change logs" secondary={latestVersion.log}></ListItemText>
            </ListItem>
            {/* <ListItem><Typography>{latestVersion.log}</Typography></ListItem> */}
          </List>
          <CardActions>
            <Button>Download</Button>
          </CardActions>
        </Card>}
      <SettingItemFileSelector
        title="Firmware"
        subtitle="Select bin file to upgrade"
        onChange={handleFileSelect} />
      {!linearWithValueLabel &&
        <Button variant="contained"
          disabled={selectedFile == null ? true : false}
          sx={{ margin: '10px', width: "90%" }}
          onClick={handleUpgrade}>
          Upgrade
        </Button>}
      {linearWithValueLabel &&
        <LinearWithValueLabel
          sx={{ margin: '10px ' }}
          progress={progress}
          setLinearWithValueLabel={setLinearWithValueLabel}
        />}
    </PopupFrame >
  );
};

const LinearProgressWithLabel = (props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

const LinearWithValueLabel = (props) => {
  console.log(props.progress);
  useEffect(() => {
    if (props.progress === 100) {
      setTimeout(() => {
        props.setLinearWithValueLabel(false);
      }, 3000);
    }
  }, [props]);

  return (
    <Box sx={{ width: '90%', margin: "10px" }}>
      <LinearProgressWithLabel value={props.progress} sx={{ height: "36px", borderRadius: "4px" }} />
    </Box>
  );
}

export default PopupOTA;