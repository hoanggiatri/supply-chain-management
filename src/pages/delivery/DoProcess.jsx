import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Typography, Box, CircularProgress, Stepper, Step, StepLabel } from "@mui/material";
import { getAllDeliveryProcesses } from "@/services/delivery/DoProcessService";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from "@mui/lab";
import { getDeliveryOrderById } from "@/services/delivery/DoService";
import DeliveryStep from "@/components/delivery/DeliveryStep";

const DoProcess = () => {
  const { doId } = useParams();
  const token = localStorage.getItem("token");

  const [deliveryOrder, setDeliveryOrder] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProcesses = async () => {
      setLoading(true);
      try {
        const doData = await getDeliveryOrderById(doId, token);
        setDeliveryOrder(doData);
        const data = await getAllDeliveryProcesses(doId, token);
        setProcesses(data);
      } catch (err) {
        alert(err.response?.data?.message || "Không thể tải tiến trình vận chuyển!");
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, [doId, token]);

  const statusToStepIndex = {
    "Chờ lấy hàng": 0,
    "Đang vận chuyển": 1,
    "Đã hoàn thành": 2,
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN VẬN CHUYỂN
        </Typography>

        {deliveryOrder && (
          <Box my={3}>
            <Stepper
              activeStep={statusToStepIndex[deliveryOrder.status] || 0}
              alternativeLabel
              sx={{
                "& .MuiStepConnector-line": {
                  borderTopWidth: 3,
                },
              }}
            >
              {["Chờ lấy hàng", "Đang vận chuyển", "Giao hàng thành công"].map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={DeliveryStep}
                    sx={{ "& .MuiStepLabel-label": { fontSize: "0.9rem", fontWeight: 500 } }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Timeline>
            {processes.map((process, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent
                  sx={{ flex: 1, textAlign: "right", pr: 2 }}
                >
                  {process.arrivalTime ? new Date(process.arrivalTime).toLocaleString() : ""}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot color="secondary" />
                  {index < processes.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent sx={{ flex: 3 }}>
                  <Typography>{process.location}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Paper>
    </Container>
  );
};

export default DoProcess;