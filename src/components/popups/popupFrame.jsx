
import {
  Paper,
  CardHeader,
  CardActions,
  Modal,
  Box,
  Stack,
  IconButton,
  Button
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';

const PopupFrame = (props) => {

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: props.width || '760px',
          maxHeight: props.maxHeight || '60vh',
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          '@media (max-width: 768px)': {
            width: '90vw',
          },
        }}
      >
        <CardHeader title={props.title}
          action={
            props.onClose &&
            <IconButton onClick={props.onClose}>
              <Close />
            </IconButton>
          }
        />
        <Box sx={{ overflow: 'auto', height: 'auto', overflowX: "hidden", paddingRight: 0 }}>
          {props.children}
        </Box>
        {props.actions &&
          <CardActions>
            <Stack
              direction="row"
              justifyContent="right"
              width={"100%"}
              spacing={12}
            >
              {props.actions}
            </Stack>
          </CardActions>}
        {
          props.button &&
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1rem" }}>
            <Button
              variant="outlined"
              color="primary"
              disabled={props.disabled}
              sx={{ minWidth: "5rem", maxWidth: "8rem" }}
              onClick={props.onClose}
            >
              {props.cancelText || 'Cancel'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ minWidth: "5rem", maxWidth: "8rem" }}
              disabled={props.disabled}
              onClick={props.onConfirm}
            >
              {props.confirmText || 'Confirm'}
            </Button>
          </Box>
        }
      </Paper >
    </Modal >
  );
};

export default PopupFrame;