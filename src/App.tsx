import React, { useMemo, useEffect, useState } from "react";
import { useFetch } from "./hooks/useFetch";
import { Row } from "./components/table_row";
import { getDataApi } from "./services/api/api";
import { getBaseAPIUrl } from "./services/api/get_base_url";
import { TStudentProps, TDataTable, TChart } from "./types";
import { createData } from "./util/createData";
import { ESortCategory } from "./types";
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
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTime } from "luxon";

function App() {
  const [datePickerValue, setDatePickerValue] = useState<DateTime | string>(
    "2015-03-02"
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [students, setStudents] = useState({});

  const [filter, setFilter] = useState("");

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

      const studentsIds = fetchedData.map(
        (student: TStudentProps) => student.UserId
      );

      const uniqueIds = [...new Set(studentsIds)];

      const studentPropsByEveryDate = {};
      uniqueIds.forEach((studentId) => {
        const extractedPropsforEveryStudent = fetchedData.filter(
          (item: TStudentProps) => item.UserId === studentId
        );
        //@ts-ignore
        studentPropsByEveryDate[studentId] = extractedPropsforEveryStudent;
      });

      const studentPropsByCurrentDate = {};
      for (const [key, value] of Object.entries(studentPropsByEveryDate)) {
        //@ts-ignore
        const filterDates = value.filter(
          (item: TStudentProps) =>
            item.SubmitDateTime.substring(0, 10) === currentDate
        );
        //@ts-ignore
        studentPropsByCurrentDate[key] = filterDates;
      }

      setStudents(studentPropsByCurrentDate);
    }
  }, [datePickerValue, fetchedData]);

  const clickedValueHandler = (newValue: DateTime) => {
    setDatePickerValue(newValue);
    setFilter("");
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

  const onKeyDownHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const changeHandler = (event: any) => {
    const category = event.target.value;
    if (category === ESortCategory.highest) {
      const studentSortedByHighProgress = {};
      for (const [key, value] of Object.entries(students)) {
        //@ts-ignore
        const sortByHighProgress = value.sort((a, b) =>
          Math.round(a.Progress) < Math.round(b.Progress) ? 1 : -1
        );
        //@ts-ignore
        studentSortedByHighProgress[key] = sortByHighProgress;
      }

      setStudents(studentSortedByHighProgress);
      setFilter(category);
    } else if (category === ESortCategory.lowest) {
      const studentSortedByLowProgress = {};
      for (const [key, value] of Object.entries(students)) {
        //@ts-ignore
        const sortByLowProgress = value.sort((a, b) =>
          Math.round(a.Progress) > Math.round(b.Progress) ? 1 : -1
        );
        //@ts-ignore
        studentSortedByLowProgress[key] = sortByLowProgress;
      }

      setStudents(studentSortedByLowProgress);
      setFilter(category);
    }
  };

  let rows: TDataTable[] = [];
  if (students) {
    const domains: string[] = [];
    rows = Object.keys(students).map((student) => {
      //@ts-ignore
      students[student].forEach((student: TStudentProps) => {
        domains.push(student.Domain);
      });

      const domain = [...new Set(domains)].join(", ");

      return createData(
        student,
        domain,
        //@ts-ignore
        students[student].map((item: TStudentProps) => item)
      );
    });
  }

  const currentRows = rows.filter((r: any, ind: any) => {
    return ind >= rowsPerPage * page && ind < rowsPerPage * (page + 1);
  });

  const chartData: TChart[] = useMemo(() => {
    const studentsChartData = [];
    for (const [key, value] of Object.entries(students)) {
      //@ts-ignore
      const progress = value
        .map((item: TStudentProps) => item.Progress)
        .reduce((accumulator: number, currentValue: number) => {
          return accumulator + currentValue;
        }, 0);

      const studentProps = {
        name: key,
        progress,
      };
      studentsChartData.push(studentProps);
    }

    return studentsChartData;
  }, [students]);

  return (
    <div className="App">
      {error && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            height: 500,
            alignItems: "center",
          }}
        >
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            <strong>{error}.</strong>
          </Alert>
        </Box>
      )}

      {loading && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            height: 500,
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {data && !loading && (
        <Stack p={4} flexDirection="row">
          <Box flexBasis="50%">
            <Box display="flex" justifyContent="center">
              <Typography marginBottom={8} variant="h4">
                Student details
              </Typography>
            </Box>

            <Box component="div" marginBottom={5}>
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <DatePicker
                  disableMaskedInput
                  inputFormat="dd-MM-yyyy"
                  orientation="landscape"
                  label="Pick date"
                  value={datePickerValue}
                  onChange={(newValue) =>
                    clickedValueHandler(newValue as DateTime)
                  }
                  renderInput={(params) => (
                    <TextField onKeyDown={onKeyDownHandler} {...params} />
                  )}
                />
              </LocalizationProvider>

              <FormControl
                sx={{
                  minWidth: 200,
                  marginLeft: 3,
                  "@media screen and (max-width: 1024px)": {
                    minWidth: 140,
                  },
                  "@media screen and (max-width: 768px)": {
                    width: "100%",
                    mb: 1,
                  },
                }}
              >
                <InputLabel id="standard-label">
                  Sort student progress
                </InputLabel>
                <Select
                  labelId="standard-label"
                  id="standard"
                  onChange={changeHandler}
                  label="Age"
                  value={filter}
                >
                  <MenuItem value="highest">By high values</MenuItem>
                  <MenuItem value="lowest">By low values</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box width="100%">
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>Student ID</TableCell>
                      <TableCell align="left">
                        What my class worked on today
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRows.map((row: TDataTable) => (
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
          </Box>
          <Box flexBasis="50%">
            <Box display="flex" justifyContent="center">
              <Typography marginBottom={8} variant="h4">
                Student graph
              </Typography>
            </Box>
            <BarChart
              width={900}
              height={600}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="#8884d8" />
            </BarChart>
          </Box>
        </Stack>
      )}
    </div>
  );
}

export default App;
