import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  CssBaseline,
  // MuiAppBar,
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
// import Drawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/InsertChart'
import UpgradeIcon from '@mui/icons-material/Upgrade';
import LogIcon from '@mui/icons-material/Article.js';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiTetheringOutlinedIcon from '@mui/icons-material/WifiTetheringOutlined';
import DashboardPanel from './panels/dashboard.jsx';
import HistoryPanel from './panels/history.jsx';
import LogPanel from './panels/log.jsx';

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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const PersistentDrawerLeft = (props) => {
  // const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [element, setelement] = useState(null);
  const [downloadElement, setDownloadElement] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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
  let title = [
    { text: props.deviceName, icon: <DashboardIcon /> },
  ]

  if (props.peripherals.includes('history')) {
    title.push({ text: 'History', icon: <HistoryIcon /> });
  }

  if (props.peripherals.includes('log')) {
    title.push({ text: 'Log', icon: <LogIcon /> });
  }

  const handleMenuItemClick = (item, index) => {
    props.onTabChange(item, index);
  }

  const handleChildElement = (element) => {
    // 在这里处理子组件传递的元素
    setelement(element);
  };

  const handleDownloadElement = (downloadElement) => {
    // 在这里处理下载元素
    setDownloadElement(downloadElement)
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      <AppBar position="fixed" open={false} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {
              props.peripherals.includes('history') && props.peripherals.includes('log') &&
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
              // sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
            }
            <Typography variant="h6" noWrap component="div">
              {title[props.tabIndex].text}
            </Typography>
            {props.tabIndex != 0 && downloadElement}
          </Box>
          {/* <IconButton
            aria-label="settings"
            color="inherit"
            onClick={props.onSettingPage}
          >
            <SettingsIcon />
            <WidgetsOutlinedIcon />
          </IconButton> */}


          <Box sx={{ flexGrow: 0 }}>
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
              <MenuItem onClick={handleSettingPage} disableRipple>
                <SettingsIcon sx={{ marginRight: '10px' }} />
                Settings
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton> */}
        </DrawerHeader>
        <Divider />
        <List>
          {title.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleMenuItemClick(item, index)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* aa */}
        {props.tabIndex != 0 && element}

      </Drawer>
      <Main className='main' open={open} >
        <DrawerHeader />
        <Box sx={{ height: '95%' }}>
          {props.tabIndex === 0 && <DashboardPanel {...props} temperatureUnit={props.temperatureUnit} />}
          {
            props.tabIndex === 1 &&
            <HistoryPanel
              {...props}
              temperatureUnit={props.temperatureUnit}
              onElementChange={handleChildElement}
              onDownloadElementChange={handleDownloadElement}
            />}
          {props.tabIndex === 2 &&
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