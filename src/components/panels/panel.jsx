import Box from '@mui/material/Box';
import Navbar from './navbar.jsx';

const Panel = (props) => {
  return (
    <Box id={props.id} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "2rem", padding: "30px", ...props.sx }}>
      <Navbar title={props.title} {...props}>
        {props.navActions}
      </Navbar>
      {props.children}
    </Box>
  )
}
export default Panel;