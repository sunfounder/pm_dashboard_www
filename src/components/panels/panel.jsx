import Box from '@mui/material/Box';

const Panel = (props) => {
  return (
    <Box id={props.id} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "2rem", padding: "20px", ...props.sx }}>
      {props.navActions}
      {props.children}
    </Box>
  )
}
export default Panel;