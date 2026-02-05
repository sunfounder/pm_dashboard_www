import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

const Panel = (props) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.endsWith('/small');
  return (
    // <Box id={props.id} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "2rem", padding: window.innerWidth === 800 ? "10px" : "20px", ...props.sx }}>
    <Box id={props.id} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "2rem", padding: isDashboardRoute ? "10px" : "20px", ...props.sx }}>
      {props.navActions}
      {props.children}
    </Box>
  )
}
export default Panel;