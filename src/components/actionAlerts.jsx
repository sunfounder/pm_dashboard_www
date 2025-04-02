import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';

const ActionAlerts = (props) => {
  const onClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.onClose();
  }
  return (
    <Snackbar
      open={props.open}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity={props.severity}
        slots={{ transition: <Grow {...props} /> }}
        action={
          <Box>
            <IconButton color="inherit" size="small" onClick={onClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>
        }
      >
        {props.message}
      </Alert >
    </Snackbar >
  );
}

export default ActionAlerts;