import React from "react";
import { CheckCircle, Inventory, LocalShipping } from "@mui/icons-material";
import { Box } from "@mui/material";

const DeliveryStep = (props) => {
  const { active, completed, icon } = props;

  const icons = {
    1: <Inventory />,
    2: <LocalShipping />,
    3: <CheckCircle />,
  };

  let color = "#9e9e9e";
  if (completed) color = "#000";
  else if (active) color = "#000";

  return (
    <Box sx={{ color }}>
      {React.cloneElement(icons[icon], { sx: { fontSize: 30, color } })}
    </Box>
  );
};
export default DeliveryStep;
