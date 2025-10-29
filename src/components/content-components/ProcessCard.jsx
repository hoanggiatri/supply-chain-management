import React from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { Check } from "@mui/icons-material";

const ProcessCard = ({ process, onComplete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Đang thực hiện":
        return "#4caf50";
      case "Đã hoàn thành":
        return "#05518b";
      default:
        return "#bdbdbd";
    }
  };

  const statusColor = getStatusColor(process.status);

  return (
    <Paper
      elevation={process.status === "Đang thực hiện" ? 6 : 2}
      sx={{
        p: 0,
        border: `2px solid ${statusColor}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ backgroundColor: statusColor, color: "#ffffff", px: 1, py: 1 }}
      >
        <Typography fontWeight="bold" sx={{pt:1, pb:1}}>
          {process.stageDetailOrder}. {process.stageDetailName}
        </Typography>

        {process.status === "Đang thực hiện" && (
          <IconButton size="small" onClick={() => onComplete && onComplete(process)}>
            <Check sx={{ color: "#ffffff" }} />
          </IconButton>
        )}
      </Box>

      <Box p={1} flexGrow={1}>
        <Typography mb={0.5}>Trạng thái: {process.status}</Typography>
        <Typography mb={0.5}>
          Bắt đầu: {process.startedOn ? new Date(process.startedOn).toLocaleString() : "Chưa"}
        </Typography>
        <Typography>
          Kết thúc: {process.finishedOn ? new Date(process.finishedOn).toLocaleString() : "Chưa"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProcessCard;
