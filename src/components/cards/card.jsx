import React from 'react';
import { formatBytes, round } from '../../js/utils';
import Paper from '@mui/material/Paper';
import "./card.css";

const Card = (props) => {
  const { icon, width, details, title, data, chart, config } = props;
  return (
    <Paper className="card"
      color={props.color}
      elevation={2}
      sx={{
        borderRadius: "20px",
        flexGrow: width,
      }}>
      <div className="box">
        <Paper className="icon" elevation={5}
          sx={{
            bgcolor: `${props.color}.main`
          }}

        >
          {icon}
        </Paper>
        <div className="config">
          {config}
        </div>
        <div className="detailBox">
          <div className="pictureBox">
            <div className="mainTitle">
              <p>{title}</p>
            </div>
            <div className="details">
              {Object.keys(details).map((key) => {
                let newData = data[data.length - 1];
                if (!newData)
                  return null;
                if (!Object.keys(newData).includes(key)) {
                  console.warn("key not found: ", title, key);
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
                  <div key={key}>
                    {!details[key].hide &&
                      <>
                        <div className="detailLineDot" style={{
                          backgroundColor: details[key].color
                        }}></div>
                        <p className="title">{details[key].title}</p>
                        <p className="digital">{_data}</p>
                      </>
                    }
                  </div>
                );
              })}
            </div>
          </div>
          {chart}
        </div>
      </div>
      {/* </div>*/}
    </Paper>
  );
};

export default Card;