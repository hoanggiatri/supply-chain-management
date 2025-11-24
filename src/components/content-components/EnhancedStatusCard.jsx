import React from "react";
import { Grid, Button, Typography, Box, Chip } from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from "@mui/icons-material";

const EnhancedStatusCard = ({
  data = [],
  statusLabels = [],
  getStatus,
  statusColors = {},
  onSelectStatus,
  selectedStatus,
  showTrends = false,
  previousData = [],
}) => {
  const items = Array.isArray(data) ? data : [];
  const prevItems = Array.isArray(previousData) ? previousData : [];

  const countByStatus = statusLabels.reduce((count, label) => {
    count[label] =
      label === "Tất cả"
        ? items.length
        : items.filter((item) => getStatus(item) === label).length;
    return count;
  }, {});

  const prevCountByStatus = statusLabels.reduce((count, label) => {
    count[label] =
      label === "Tất cả"
        ? prevItems.length
        : prevItems.filter((item) => getStatus(item) === label).length;
    return count;
  }, {});

  const getTrendIcon = (current, previous) => {
    if (!showTrends || previous === 0) return null;
    const diff = current - previous;
    if (diff > 0) return <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />;
    if (diff < 0) return <TrendingDownIcon fontSize="small" sx={{ color: 'error.main' }} />;
    return <TrendingFlatIcon fontSize="small" sx={{ color: 'text.disabled' }} />;
  };

  const getTrendPercentage = (current, previous) => {
    if (!showTrends || previous === 0) return null;
    const diff = current - previous;
    const percentage = Math.abs((diff / previous) * 100).toFixed(0);
    const color = diff > 0 ? 'success.main' : diff < 0 ? 'error.main' : 'text.disabled';
    return (
      <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
        {diff > 0 ? '+' : ''}{percentage}%
      </Typography>
    );
  };

  return (
    <Grid container spacing={2} mb={3}>
      {statusLabels.map((label) => {
        const isSelected = label === selectedStatus;
        const currentCount = countByStatus[label] || 0;
        const previousCount = prevCountByStatus[label] || 0;

        return (
          <Grid item key={label} xs={12} sm={6} md="auto">
            <Button
              variant="contained"
              onClick={() => onSelectStatus?.(label)}
              sx={{
                height: showTrends ? 85 : 75,
                minWidth: 180,
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                boxShadow: isSelected ? 8 : 3,
                background: isSelected
                  ? `linear-gradient(135deg, ${statusColors[label]} 0%, ${statusColors[label]}dd 100%)`
                  : `linear-gradient(135deg, ${statusColors[label]}15 0%, ${statusColors[label]}08 100%)`,
                border: isSelected ? 'none' : `2px solid ${statusColors[label]}40`,
                color: isSelected ? '#fff' : statusColors[label],
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 4,
                  height: '100%',
                  background: statusColors[label],
                  opacity: isSelected ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.02)',
                  boxShadow: `0 12px 24px ${statusColors[label]}40`,
                  background: `linear-gradient(135deg, ${statusColors[label]} 0%, ${statusColors[label]}dd 100%)`,
                  color: '#fff',
                  '&:before': {
                    opacity: 0,
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {label}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {currentCount}
                </Typography>
              </Box>
              
              {showTrends && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    mt: 0.5,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getTrendIcon(currentCount, previousCount)}
                    {getTrendPercentage(currentCount, previousCount)}
                  </Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    vs kỳ trước
                  </Typography>
                </Box>
              )}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default EnhancedStatusCard;
