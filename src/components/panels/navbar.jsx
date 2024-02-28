import React from 'react';
import {
  Tooltip,
  Box,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/InsertChart'
import LogIcon from '@mui/icons-material/Article.js';

const Navbar = (props) => {
  return (
    <Box id="nav" sx={{
      display: "flex", borderRadius: "20px", justifyContent: "space-between", padding: "10px 20px", height: "60px", alignItems: "center"
    }}>
      <Box sx={{ display: "flex", gap: "30px" }}>
        <Typography variant="h5" sx={{ margin: "auto", width: "150px" }}> {props.title}</Typography>
        <Tabs value={props.tabIndex} onChange={props.onTabChange}>
          <Tooltip title="Dashboard" placement="bottom">
            <Tab icon={<DashboardIcon />} />
          </Tooltip>
          <Tooltip title="History" placement="bottom">
            <Tab icon={<HistoryIcon />} />
          </Tooltip>
          <Tooltip title="Log" placement="bottom">
            <Tab icon={<LogIcon />} />
          </Tooltip>
        </Tabs>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        {props.children}
        <Tooltip title="Settings" placement="bottom">
          <IconButton aria-label="settings" color="primary" onClick={props.onSettingPage}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box >
  )
}

export default Navbar;