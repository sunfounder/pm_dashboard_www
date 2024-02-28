import React from "react"
import { Box, Slider, Switch } from '@mui/material';
import './fanControl.css'
import { firstUpperCase } from '../../js/utils';

const FanControl = (props) => {
  const modes = props.modes.map((mode, index) => {
    return {
      value: index,
      label: firstUpperCase(mode),
    }
  })

  const getMode = (index) => {
    return modes[index].label;
  }

  const handleModeChange = (e) => {
    props.onModeChange(e.target.value)
  }
  const handleStateChange = (e) => {
    console.log(e.target.checked)
    props.onStateChange(e.target.checked);
  }

  return (
    <div className="fanBut">
      <div className="fanSwitch">
        <Switch checked={props.state} onChange={handleStateChange} color={props.color} />
      </div>
      <Box sx={{ width: 180, display: "flex" }}>
        <Slider
          color={props.color}
          onChange={handleModeChange}
          value={props.value}
          valueLabelFormat={getMode}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={3}
        />
      </Box>
    </div>
    // </div>
  );
}

export default FanControl;