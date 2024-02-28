import React, { useRef } from 'react';
import Paper from '@mui/material/Paper';
import "./graph.css"

const Graph = (props) => {

  const chartBoxRef = useRef();
  const { children } = props

  return (
    <Paper
      className="chartBox"
      ref={chartBoxRef}
      elevation={10}
      sx={{
        position: "relative",
        flex: "1 1 auto",
        minWidth: "150px",
        minHeight: "150px",
        borderRadius: "20px",
        right: "-20px",
        bottom: "-15px",
        margin: "0 10px",
      }}
    >
      {children}
    </Paper>
  )
}

export default Graph;
