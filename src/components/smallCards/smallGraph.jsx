import React, { useRef } from 'react';
import Paper from '@mui/material/Paper';
import "./smallGraph.css"

const Graph = (props) => {

  const chartBoxRef = useRef();

  return (
    <Paper
      className="smallChartBox"
      ref={chartBoxRef}
      sx={{
        minWidth: "100px",
        minHeight: "80px",
        boxShadow: "0",
        background: "#f5f5f5",
      }}
    >
      {props.children}
    </Paper>
  )
}

export default Graph;
