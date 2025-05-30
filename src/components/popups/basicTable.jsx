import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const BasicTable = (props) => {
  return (
    <TableContainer component={Paper} sx={{ width: "unset", margin: "1rem" }}>
      <Table sx={{ minWidth: 100 }} aria-label="simple table">
        {
          !props.noHead &&
          <TableHead>
            <TableRow>
              {
                props.head.map((item, index) => (
                  <TableCell key={index} align={item.align || "center"}>{item.title}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>
        }
        <TableBody>
          {props.data.map((row, index) => (
            <TableRow
              key={row.index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {
                props.head.map((item, index) => {
                  return <TableCell key={index} align={item.align || "center"}>{row[item.field]}</TableCell>
                })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable;