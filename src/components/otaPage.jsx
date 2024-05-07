import React, { useState, useEffect } from 'react';
import "./otaPage.css";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Paper,
  CardHeader,
  Modal,
  Button,
  Box,
  IconButton,
  CircularProgress,
  LinearProgress,
  Typography,
  Tabs,
  Tab,
  ListItem,
  ListItemText,
} from '@mui/material';

import {
  Close,
} from '@mui/icons-material';


const OTAPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [linearWithValueLabel, setLinearWithValueLabel] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [latestVersion, setLatestVersion] = useState({ versiov: "", time: "", log: "", url: "" });
  const [fileName, setFileName] = useState('选择文件');
  const [progress, setProgress] = useState(0);
  const [downloadButton, setDownloadButton] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("");
  useEffect(() => {
    getCurrentVersion();
    return () => {
      console.log("组件卸载执行的事情");
      setLinearWithValueLabel(false);
      setLoading(false);
      setDownloadButton(false);
      setSelectedFile(null);
      setFileName('选择文件');
    };
  }, [props.open]);


  const handleUpgrade = async () => {
    console.log("手动升级");
    sendFile();
    setLinearWithValueLabel(true);
  }

  const getCurrentVersion = async () => {
    let currentVersion = await props.request("get-version", "GET");
    setCurrentVersion(currentVersion);
  }

  const handleAutoUpgrade = async () => {
    let latestVersion = await getLatestVersion();
    if (latestVersion) {
      let result = compareVersions(latestVersion.versiov, currentVersion);
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
          if (progress == 100) {
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
    const repoName = 'ai-camera-firmware';
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/releases/latest`);
      const data = await response.json();
      if (data) {
        setLoading(false);
      }
      const latestVersion = {
        versiov: data.tag_name,
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
      <Paper className='otaSetting'
        elevation={3}
        sx={{
          width: '40vw',
          borderRadius: "10px",
        }}
      >
        <CardHeader title="OTA" action={
          <IconButton onClick={props.onCancel}>
            <Close />
          </IconButton>
        } />
        <Box className='loaderBox' sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%', height: '50%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'column' }}>
            {
              <>
                <SettingItem
                  title="Current Version"
                  subtitle=""
                >
                  <Typography >{currentVersion}</Typography>
                </SettingItem>
                <SettingItem
                  title="Check Updates"
                  subtitle=""
                >
                  <Button onClick={handleAutoUpgrade}>检查更新</Button>
                  {
                    loading &&
                    <CircularProgress size={30} />
                  }
                </SettingItem>

                {
                  latestVersion.versiov !== "" &&

                  <Box>
                    <Typography >{latestVersion.versiov}</Typography>
                    <Typography >{latestVersion.log}</Typography>
                    <a href={latestVersion.url}>
                      <Button>Download</Button>
                    </a>
                  </Box>



                  // <>
                  //   <SettingItem
                  //     title="Latest Lersion"
                  //     subtitle=""
                  //   >
                  //     <Typography >{latestVersion.versiov}</Typography>
                  //   </SettingItem>
                  //   <SettingItem
                  //     title="Log"
                  //     subtitle=""
                  //   >
                  //     <Typography >{latestVersion.log}</Typography>
                  //   </SettingItem>
                  //   <a href={latestVersion.url}>
                  //     <Button>Download</Button>
                  //   </a>
                  // </>
                }

                <SettingItem
                  title="Firmware"
                  subtitle=""
                >
                  <Box sx={{ width: "50%" }}>
                    <form>
                      <label htmlFor="fileInput">{fileName}</label>
                      <input
                        type="file"
                        id="fileInput"
                        accept=".bin"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                      />
                    </form>
                  </Box>
                </SettingItem>
              </>
            }
            {
              !linearWithValueLabel &&
              <Button variant="contained"
                disabled={selectedFile == null ? true : false}
                sx={{ margin: '10px ', width: "90%" }}
                onClick={handleUpgrade}>
                Upgrade
              </Button>
            }
            {

            }
            {
              linearWithValueLabel &&
              <LinearWithValueLabel
                sx={{ margin: '10px ' }}
                progress={progress}
                setLinearWithValueLabel={setLinearWithValueLabel}
              />
            }
          </Box>
        </Box>
      </Paper >
    </Modal >
  );
};

const LinearProgressWithLabel = (props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      {/* <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value,)}%`}
        </Typography>
      </Box> */}
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
  }, [props.progress]);
  return (
    <Box sx={{ width: '90%', margin: "10px" }}>
      <LinearProgressWithLabel value={props.progress} sx={{ height: "36px", borderRadius: "4px" }} />
    </Box>
  );
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

export default OTAPage;