import React, { useMemo, useEffect, useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { Row } from "./components/table_row";
import { getDataApi } from "./services/api/api";
import { getBaseAPIUrl } from "./services/api/get_base_url";
import {
  Stack,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTime } from "luxon";

const createData = (name: any, details?: any) => {
  return {
    name,
    history: details,
  };
};

function App() {
  const [datePickerValue, setDatePickerValue] = useState<DateTime | string>(
    "2015-03-02"
  );

  //pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [students, setStudents] = useState({});

  const url = `${getBaseAPIUrl()}Snappet/SnappetChallenge/master/Data/work.json`;

  const { loading, data, error } = useFetch({
    api: getDataApi,
    method: "get",
    url: url,
  });

  const fetchedData = useMemo(() => {
    if (data) {
      //@ts-ignore
      return data?.data;
    }
  }, [data]);

  useEffect(() => {
    if (fetchedData) {
      //@ts-ignore
      const currentDate = new Date(datePickerValue)
        .toISOString()
        .substring(0, 10);

      const studentsIds = fetchedData.map((student: any) => student.UserId);

      //@ts-ignore
      const uniqueIds = [...new Set(studentsIds)];

      const studentPropsByEveryDate = {};
      uniqueIds.forEach((studentId) => {
        const extractedPropsforEveryStudent = fetchedData.filter(
          (item: any) => item.UserId === studentId
        );
        //@ts-ignore
        studentPropsByEveryDate[studentId] = extractedPropsforEveryStudent;
      });

      const studentPropsByCurrentDate = {};
      for (const [key, value] of Object.entries(studentPropsByEveryDate)) {
        //@ts-ignore
        const filterDates = value.filter(
          (item: any) => item.SubmitDateTime.substring(0, 10) === currentDate
        );
        //@ts-ignore
        studentPropsByCurrentDate[key] = filterDates;
      }

      setStudents(studentPropsByCurrentDate);
    }
  }, [datePickerValue, fetchedData]);

  const clickedValueHandler = (newValue: any) => {
    setDatePickerValue(newValue);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let rows: any = [];
  if (students) {
    rows = Object.keys(students).map((stud) => {
      //@ts-ignore
      const domain = students[stud].map((item: any) => item.Domain);

      return createData(
        stud,
        //@ts-ignore
        students[stud].map((item: any) => item)
      );
    });
  }

  const currentRows = rows.filter((r: any, ind: any) => {
    return ind >= rowsPerPage * page && ind < rowsPerPage * (page + 1);
  });

  return (
    <div className="App">
      <Stack
        p={4}
        flexDirection="column"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box component="div">
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              disableMaskedInput
              inputFormat="dd-MM-yyyy"
              orientation="landscape"
              label="Basic example"
              value={datePickerValue}
              onChange={(newValue) => clickedValueHandler(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box width="70%">
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((row: any) => (
                  <Row key={row.name} row={row} />
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Stack>
    </div>
  );
}

export default App;
