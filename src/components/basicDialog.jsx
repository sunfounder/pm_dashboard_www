import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, Box, CircularProgress } from '@mui/material';
import "./barChart.css"


const BasicDialog = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
    >
      <DialogContent
        sx={{
          width: '50vw',
          display: "flex",
          justifyContent: "center",
        }}
      >
        <DialogContentText id="alert-dialog-description">
          {props.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {props.loading ?
          <Box sx={{ display: 'flex' }}>
            <CircularProgress sx={{ width: "2rem !important", height: "2rem !important" }} />
          </Box>
          :
          <>
            <Button onClick={props.onCancel} >Cancel</Button>
            <Button onClick={props.onConfirm} >Confirm</Button>
          </>
        }
      </DialogActions>
    </Dialog>
  );
}

export default BasicDialog;