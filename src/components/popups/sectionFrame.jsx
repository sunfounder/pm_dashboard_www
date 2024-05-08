import React from "react";
import {
  List,
  ListSubheader,
  Box,
} from "@mui/material";

const SectionFrame = (props) => {
  return (
    <List subheader={<ListSubheader
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
    >
      <Box>{props.title}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {props.actions}
      </Box>
    </ListSubheader>}>
      {props.children}
    </List>
  )
}

export default SectionFrame;