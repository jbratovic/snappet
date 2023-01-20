import React from "react";
import { Stack, Box, Typography } from "@mui/material";

function App() {
  return (
    <div className="App">
      <Stack
        p={4}
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ height: "calc(100vh - 80px)" }}
      >
        <Box component="div">
          <Typography>Snappet Challenge</Typography>
        </Box>
      </Stack>
    </div>
  );
}

export default App;
