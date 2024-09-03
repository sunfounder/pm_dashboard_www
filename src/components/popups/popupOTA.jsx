import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Button,
  Box,
  LinearProgress,
  List,
  ListItem,
  Card,
  CardActions,
  ListItemText
} from '@mui/material';

import PopupFrame from './popupFrame.jsx';
import {
  SettingItemButton,
  SettingItemFileSelector,
} from './settingItems.jsx';

import './markdown.css';
import { HOST } from '../../js/config';

const PopupOTA = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [latestVersion, setLatestVersion] = useState(null);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentVersion, setCurrentVersion] = useState("");
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!selectedFile) {
      props.showSnackBar("error", "Please select a file first");
      return;
    }
    props.showAlert("OTA Upgrade", `Are you sure to upgrade with ${fileName}.`, () => upgrade());
  }

  const getCurrentVersion = useCallback(async () => {
    let currentVersion = await props.request("get-version", "GET");
    setCurrentVersion(currentVersion);
  }, [props])

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
      return latestVersion;
    } catch (error) {
      console.error('Error fetching latest release:', error);
      return false;
    }
  }

  const checkUpdate = async () => {
    let latestVersion = await getLatestVersion();
    if (latestVersion) {
      let result = compareVersions(latestVersion.version, currentVersion);
      if (result > 0) {
        setLatestVersion(latestVersion);
        // console.log("有新版本");
      } else if (result < 0) {
        // console.log("新版本号比当前版本号小");
        props.showSnackBar("success", "Already up to date");
      } else {
        // console.log("版本相同");
        props.showSnackBar("success", "Already up to date");
      }
    }
  }

  const upgrade = async () => {
    if (selectedFile) {
      setUpgrading(true);
      let formData = new FormData();
      formData.append('update', selectedFile);
      let xhr = new XMLHttpRequest();
      xhr.open('POST', HOST + 'ota-update');
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          let progress = e.loaded / e.total * 100;
          setProgress(progress);
          if (progress === 100) {
            console.log('update success');
            props.showSnackBar("success", "Upgrade Success");
            setUpgrading(false);
            setTimeout(() => setProgress(0), 200);
            props.restartPrompt(
              "Update successfully",
              "Do you want to restart now to take effect?",
              props.onCancel,
            );
          }
        }
      });
      xhr.send(formData);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleDownload = () => {
    window.open(latestVersion.url);
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
    return () => {
      setSelectedFile(null);
      setFileName('');
      setProgress(0);
      setUpgrading(false);
      setLatestVersion(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);


  return (
    <PopupFrame title="OTA" open={props.open} onClose={props.onCancel}>
      <SettingItemButton
        title={`${props.deviceName} Firmware`}
        subtitle={currentVersion}
        buttonText="Check for updates"
        loading={loading}
        onClick={checkUpdate}
      />
      {latestVersion && latestVersion.version !== "" &&
        <Card elevation={3} sx={{ margin: '10px' }}>
          <List dense={true}>
            <ListItem>
              <ListItemText primary="New version available" secondary={latestVersion.version}></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText primary="Change logs" secondary={
                <ReactMarkdown
                  className='markdown'>
                  {latestVersion.log}
                </ReactMarkdown>
              }></ListItemText>
            </ListItem>
          </List>
          <CardActions>
            <Button onClick={handleDownload}>Download</Button>
          </CardActions>
        </Card>}
      <SettingItemFileSelector
        title="Firmware"
        subtitle="Select bin file to upgrade"
        value={fileName}
        accept='.bin'
        onChange={handleFileSelect} />
      <ListItem >
        {upgrading ?
          <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} sx={{ width: '100%', height: '36.5px', borderRadius: '4px' }} />
          </Box> :
          <Button
            variant='contained'
            disabled={upgrading || !selectedFile}
            onClick={handleUpgrade}
            sx={{ width: '100%' }}>
            Upgrade
          </Button>
        }
      </ListItem>
    </PopupFrame >
  );
};

export default PopupOTA;