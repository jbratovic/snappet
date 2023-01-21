import React, { useState } from "react";
import { DateTime } from "luxon";
import { TStudentProps } from "../../types";
import {
  IconButton,
  Collapse,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export const Row = (props: { row: any }) => {
  const { row } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.domain}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Learning objective</TableCell>
                    <TableCell>Difficulty</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Submitted date time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map(
                    (historyRow: TStudentProps, index: number) => {
                      return (
                        <TableRow key={historyRow.UserId + index}>
                          <TableCell component="th" scope="row">
                            {historyRow.Subject}
                          </TableCell>
                          <TableCell>{historyRow.LearningObjective}</TableCell>
                          <TableCell>{historyRow.Difficulty}</TableCell>
                          <TableCell>{historyRow.Progress}</TableCell>
                          <TableCell>{`${DateTime.fromISO(
                            historyRow.SubmitDateTime
                          ).toLocaleString(
                            DateTime.DATETIME_MED_WITH_SECONDS
                          )}`}</TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
