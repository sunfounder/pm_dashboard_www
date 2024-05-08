
import { PropaneSharp } from '@mui/icons-material';
import {
  Paper,
  CardHeader,
  CardActions,
  Modal,
  Box,
  Button,
  Stack,
  IconButton,
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
          width: props.width || '50vw',
          maxHeight: props.maxHeight || '60vh',
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          '@media (max-width: 767px)': {
            width: '90vw',
          },
        }}
      >
        <CardHeader title={props.title} action={
          <IconButton onClick={props.onClose}>
            <Close />
          </IconButton>
        } />
        <Box sx={{ overflow: 'auto', height: 'auto', overflowX: "hidden", padding: "0 0" }}>
          {props.children}
        </Box>
        <CardActions>
          <Stack
            direction="row"
            justifyContent="right"
            width={"100%"}
            spacing={12}
          >
            {props.actions}
          </Stack>
        </CardActions>
      </Paper >
    </Modal >
  );
};

export default PopupFrame;