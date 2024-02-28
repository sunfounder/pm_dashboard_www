// import React, { useState } from 'react';
import React from 'react';
import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


const Snackbars = (props) => {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      {/* <Button variant="outlined" onClick={props.handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar open={props.open} autoHideDuration={3000} onClose={props.handleClose} >
        <Alert elevation={10} severity={props.severity} sx={{ width: "100%" }}>
          {props.text}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default Snackbars;