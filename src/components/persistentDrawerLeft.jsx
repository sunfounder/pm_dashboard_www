import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/InsertChart'
import UpgradeIcon from '@mui/icons-material/Upgrade';
import LogIcon from '@mui/icons-material/Article.js';
import SettingsIcon from '@mui/icons-material/Settings';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiTetheringOutlinedIcon from '@mui/icons-material/WifiTetheringOutlined';
import DashboardPanel from './panels/dashboard.jsx';
import HistoryPanel from './panels/history.jsx';
import LogPanel from './panels/log.jsx';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const PersistentDrawerLeft = (props) => {
  const [open, setOpen] = useState(false);
  const [element, setelement] = useState(null);
  const [downloadElement, setDownloadElement] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(JSON.parse(window.localStorage.getItem("pm-dashboard-tabIndex")) || { text: "Dashboard", index: 0 });
  const [settingButton, setSettingButton] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenUserMenu = (event) => {
    let dropdown = [
      'ota_auto',
      'ota_manual',
      'sta_switch',
      'sta_ssid_scan',
      'sta_ssid',
      'sta_psk',
      'ap_ssid',
      'ap_psk'
    ];
    const hasCommonItem = dropdown.some(item => props.peripherals.includes(item));
    if (!hasCommonItem) {
      handleSettingPage();
    } else {
      setSettingButton(true);
      setAnchorElUser(event.currentTarget);
    }
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleSettingPage = () => {
    handleCloseUserMenu();
    props.onSettingPage();
  }
  const handlePopupWiFi = () => {
    handleCloseUserMenu();
    props.onPopupWiFi();
  }
  const handlePopupAP = () => {
    handleCloseUserMenu();
    props.onPopupAP();
  }
  const handlePopupOTA = () => {
    handleCloseUserMenu();
    props.onPopupOTA();
  }

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  }

  let title = [
    { text: "Dashboard", icon: <DashboardIcon /> },
  ]

  if (props.peripherals.includes('history')) {
    title.push({ text: 'History', icon: <HistoryIcon /> });
  }

  if (props.peripherals.includes('log')) {
    title.push({ text: 'Log', icon: <LogIcon /> });
  }

  const handleMenuItemClick = (item, index) => {
    const data = { text: item, index: index };
    props.onTabChange(item, index);
    setSelectedIndex(data);
  }

  const handleChildElement = (element) => {
    // 在这里处理子组件传递的元素
    setelement(element);
  };

  const handleDownloadElement = (downloadElement) => {
    // 在这里处理下载元素
    setDownloadElement(downloadElement)
  }

  // 处理退出全屏
  const handleExitFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        console.log("全屏模式已启用。");
        setIsFullscreen(true);
      }).catch(err => {
        console.log(`启用全屏模式时出错: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen().then(() => {
        console.log("已退出全屏模式。");
        setIsFullscreen(false);
      }).catch(err => {
        console.log(`退出全屏模式时出错: ${err.message} (${err.name})`);
      });
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      <AppBar position="fixed" open={false} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {
              (props.peripherals.includes('history') || props.peripherals.includes('log')) &&
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            }
            <Typography variant="h6" noWrap component="div">
              {props.deviceName}
            </Typography>
            {/* {props.tabIndex !== 0 && downloadElement} */}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/* <Tooltip title="Fullscreen"> */}
            <IconButton onClick={handleExitFullscreen} color="inherit">
              {
                isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />
              }
            </IconButton>
            {/* </Tooltip> */}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} color="inherit">
                <WidgetsOutlinedIcon />
              </IconButton>
            </Tooltip>
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
              {
                (props.peripherals.includes('ota_auto') || props.peripherals.includes('ota_manual')) &&
                <MenuItem onClick={handlePopupOTA} disableRipple>
                  <UpgradeIcon sx={{ marginRight: '10px' }} />
                  OTA
                </MenuItem>
              }
              {
                (
                  props.peripherals.includes('sta_switch') ||
                  props.peripherals.includes('sta_ssid_scan') ||
                  props.peripherals.includes('sta_ssid') ||
                  props.peripherals.includes('sta_psk')
                ) &&
                <MenuItem onClick={handlePopupWiFi} disableRipple>
                  <WifiIcon sx={{ marginRight: '10px' }} />
                  Wi-Fi
                </MenuItem>
              }
              {
                (props.peripherals.includes('ap_ssid') ||
                  props.peripherals.includes('ap_psk')) &&
                <MenuItem onClick={handlePopupAP} disableRipple>
                  <WifiTetheringOutlinedIcon sx={{ marginRight: '10px' }} />
                  AP
                </MenuItem>
              }
              {/* {
                props.peripherals.includes('download_history_file') &&
                <MenuItem onClick={handleCloseUserMenu} disableRipple>
                  <DownloadIcon sx={{ marginRight: '10px' }} />
                  Download History
                </MenuItem>
              } */}
              {
                settingButton &&
                <MenuItem onClick={handleSettingPage} disableRipple>
                  <SettingsIcon sx={{ marginRight: '10px' }} />
                  Settings
                </MenuItem>
              }
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          position: 'absolute',
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader sx={{ minHeight: '48px !important' }} />
        <Divider />
        <List>
          {title.map((item, index) => (
            <ListItem key={item.text} disablePadding  >
              <ListItemButton selected={selectedIndex.index === index} onClick={() => handleMenuItemClick(item, index)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* 左侧列表 */}
        {props.tabIndex.index !== 0 && element}

      </Drawer>
      <Main className='main' open={open} sx={{ padding: 0, width: "100vw", marginLeft: "0px" }}>
        <DrawerHeader sx={{ minHeight: '48px !important' }} />
        <Box sx={{ height: '95%', paddingBottom: window.innerWidth === 800 ? "10px" : "40px" }}>
          {props.tabIndex.text === "Dashboard" && <DashboardPanel {...props} temperatureUnit={props.temperatureUnit} />}
          {
            props.tabIndex.text === 'History' &&
            <HistoryPanel
              {...props}
              temperatureUnit={props.temperatureUnit}
              onElementChange={handleChildElement}
              onDownloadElementChange={handleDownloadElement}
            />}
          {props.tabIndex.text === "Log" &&
            <LogPanel
              {...props}
              onElementChange={handleChildElement}
              onDownloadElementChange={handleDownloadElement}
            />}
        </Box>
      </Main>
    </Box >
  );
};

export default PersistentDrawerLeft;