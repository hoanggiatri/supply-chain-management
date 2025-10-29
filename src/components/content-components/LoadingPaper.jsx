import React from "react";
import { Container, Paper, Typography, CircularProgress, Box } from "@mui/material";

const LoadingPaper = ({ title }) => {
  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          {title}
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <CircularProgress color="default" />
          <Typography variant="h6" mt={2}>
            Đang tải thông tin...
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoadingPaper;
