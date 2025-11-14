import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

const FeatureCard = ({ title, description, image }) => {
  return (
    <Card>
      <CardMedia sx={{pt: "40%", backgroundSize: "cover", m: 1}} image={image} alt={title} />
      <CardContent sx={{ py: 0 }}>
        <Typography variant="h5" >
          {title}
        </Typography>
        <Typography color="textSecondary">{description}</Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
