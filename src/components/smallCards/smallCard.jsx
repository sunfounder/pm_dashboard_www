import React from 'react';
import { formatBytes, round } from '../../js/utils';
import { Box, Paper } from '@mui/material';
import "./smallCard.css";

const Card = (props) => {
  const { icon, width, details, title, data, rightData, chart, config, style } = props;
  return (
    <Paper className="smallCard"
      color={props.color}
      elevation={2}
      style={style}
      sx={{
        borderRadius: "8px",
      }}
    >
      <Box>
        <Box className='smallHeader' >
          <Box sx={{ color: `${props.color}.main`, display: "flex", alignItems: "center" }}>
            <Box sx={{ fontSize: "18px", display: "flex", alignItems: "center" }}>{icon}</Box>
            {title}
          </Box>
          <Box sx={{ color: '#666', fontSize: "12px" }}>
            <span> {rightData}</span>
            {/* {config} */}
          </Box>
        </Box>
        <Box className='smallDetails'>
          {Object.keys(details).map((key) => {
            // let newData = data[data.length - 1];
            let newData = data[0];
            if (!newData)
              return null;
            if (!Object.keys(newData).includes(key)) {
              // console.warn("key not found: ", title, key);
              return null;
            }
            let _data = newData[key];
            _data = round(_data, 2);
            let unit = details[key].unit;
            if (unit === "B" || unit === "B/s") {
              _data = formatBytes(_data);
              _data += details[key].unit;
            } else {
              _data += " " + details[key].unit;
            }
            return (
              !details[key].hide && <div className='smallDataBox' key={key}>
                {!details[key].hide &&
                  <>
                    <div className='smallDetailLineDotBox'>
                      <div className="smallDetailLineDot" style={{
                        backgroundColor: details[key].color
                      }}></div>
                    </div>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p >{details[key].title}</p>
                      <p >{_data}</p>
                    </Box>
                  </>
                }
              </div>
            );
          })}
        </Box>
      </Box>
      {chart}
    </Paper>
  );
};

export default Card;