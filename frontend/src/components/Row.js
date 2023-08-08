import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button } from "@mui/material";

export default function Row(props) {
  const { row, handleService } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" , cursor:`${row?.sub_service?.length > 0 ? "pointer" : "auto"}`} }}
        onClick={row?.sub_service?.length > 0 ? () => setOpen(!open) : undefined} 
      >
        <TableCell>
          {/* {row?.sub_service ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          ) : (
            ""
          )} */}
        </TableCell>
        {/* <TableCell component="th" scope="row">
          {row.name}
        </TableCell> */}
        <TableCell>{row.service_id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>
          <Button
            sx={{
              wordBreak: "break-word",
              border: "1px #005734 solid",
              borderRadius: "5px",
              m: 0,
              color: "#005734",
            }}
            href={row.link}
            target="_blank"
            size="small"
          >
            {" "}
            Click
          </Button>
        </TableCell>
        {row.credits == null ? "" : <TableCell>{row.credits}</TableCell>}
        <TableCell>
          <Button
            // disabled={api.is_active}
            size="small"
            sx={{
              border: "1px #005734 solid",
              color: "#005734",
            }}
            onClick={() => handleService(row)}
          >
            {row.is_active ? "Remove Service" : "Activate"}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Sub service Id
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Sub service name
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Quantity
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Sub service credits
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.sub_service?.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.sub_service_id}
                      </TableCell>
                      <TableCell>{historyRow.sub_service_name}</TableCell>
                      <TableCell align="right">{historyRow.quantity}</TableCell>
                      <TableCell align="right">
                        {historyRow.sub_service_credits}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
