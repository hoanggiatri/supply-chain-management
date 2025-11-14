import React from "react";
import { Grid, Button, Typography, Box } from "@mui/material";

const StatusSummaryCard = ({
  data = [],
  statusLabels = [],
  getStatus,
  statusColors = {},
  onSelectStatus,
  selectedStatus,
}) => {
  const items = Array.isArray(data) ? data : [];
  const countByStatus = statusLabels.reduce((count, label) => {
    count[label] =
      label === "Tất cả"
        ? items.length
        : items.filter((item) => getStatus(item) === label).length;
    return count;
  }, {});

  return (
    <Grid container spacing={2} mb={3}>
      {statusLabels.map((label) => {
        const isSelected = label === selectedStatus;

        return (
          <Grid item key={label}>
            <Button
              variant={isSelected ? "outlined" : "contained"}
              onClick={() => onSelectStatus?.(label)}
              sx={{
                height: 50,
                justifyContent: "space-between",
                borderColor: statusColors[label],
                color: isSelected ? statusColors[label] : "#fff",
                backgroundColor: isSelected ? "#fff" : statusColors[label],
                borderWidth: "2px",
                borderStyle: "solid",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s ease",
                ...(isSelected
                  ? {
                      "&:hover": {
                        backgroundColor: "#fff",
                        borderWidth: "2px",
                        borderColor: statusColors[label],
                        color: statusColors[label],
                      },
                    }
                  : {
                      "&:hover": {
                        backgroundColor: statusColors[label],
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                      },
                    }),
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                gap={1}
              >
                <Typography variant="h6" fontWeight="bold">
                  {label}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {countByStatus[label] || 0}
                </Typography>
              </Box>
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatusSummaryCard;
