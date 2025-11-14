import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  TextField,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  getAllDeliveryProcesses,
  createDeliveryProcess,
} from "@/services/delivery/DoProcessService";
import { getDeliveryOrderById } from "@/services/delivery/DoService";
import DeliveryStep from "@/components/delivery/DeliveryStep";
import dayjs from "dayjs";
import StepLine from "@/components/delivery/StepLine";
import { getSoById } from "@/services/sale/SoService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";

const UpdateDoProcess = () => {
  const { doId } = useParams();
  const token = localStorage.getItem("token");

  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [so, setSo] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [newMidLocation, setNewMidLocation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doData = await getDeliveryOrderById(doId, token);
        setDeliveryOrder(doData);
        const processData = await getAllDeliveryProcesses(doId, token);
        setProcesses(processData);
        const soData = await getSoById(doData.soId, token);
        setSo(soData);
      } catch (err) {
        toastrService.error(
          err.response?.data?.message || "Không thể tải tiến trình vận chuyển!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doId, token]);

  const statusToStepIndex = {
    "Chờ lấy hàng": 0,
    "Đang vận chuyển": 1,
    "Đã hoàn thành": 2,
  };

  const fromProcess = processes.find(p => p.note === "from");
  const middleProcesses = processes.filter(p => !p.note);

  const handleAddMidProcess = async () => {
    if (!newMidLocation.trim()) return;
    try {
      await createDeliveryProcess({
        doId,
        location: newMidLocation.trim(),
        arrivalTime: dayjs().format("YYYY-MM-DDTHH:mm:ss")
      }, token);
      const updated = await getAllDeliveryProcesses(doId, token);
      setProcesses(updated);
      setIsEditing(false);
      setNewMidLocation("");
    } catch (err) {
      toastrService.error(
        err.response?.data?.message || "Không thể thêm điểm dừng!"
      );
    }
  };

  if (!deliveryOrder || !so || !processes) return <LoadingPaper title="THÔNG TIN VẬN CHUYỂN" />;

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
              connector={<StepLine />}
              sx={{
                "& .MuiStepLabel-label": { fontSize: "0.9rem", fontWeight: 500 }
              }}
            >
              {["Chờ lấy hàng", "Đang vận chuyển", "Giao hàng thành công"].map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={DeliveryStep} >{label}</StepLabel>
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

            {fromProcess && (
              <TimelineItem>
                <TimelineOppositeContent sx={{ flex: 1, textAlign: "right", pr: 2 }}>
                  {fromProcess.arrivalTime ? new Date(fromProcess.arrivalTime).toLocaleString() : ""}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="secondary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ flex: 3 }}>
                  <Typography>{fromProcess.location}</Typography>
                </TimelineContent>
              </TimelineItem>
            )}

            {middleProcesses.map((process, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent sx={{ flex: 1, textAlign: "right", pr: 2 }}>
                  {process.arrivalTime ? new Date(process.arrivalTime).toLocaleString() : ""}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="secondary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ flex: 3 }}>
                  <Typography>{process.location}</Typography>
                </TimelineContent>
              </TimelineItem>
            ))}

            <TimelineItem>
              <TimelineOppositeContent />
              <TimelineSeparator>
                <TimelineDot color="default" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ flex: 3 }}>
                {isEditing ? (
                  <TextField
                    autoFocus
                    size="small"
                    value={newMidLocation}
                    onChange={(e) => setNewMidLocation(e.target.value)}
                    onBlur={handleAddMidProcess}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddMidProcess();
                      if (e.key === "Escape") {
                        setIsEditing(false);
                        setNewMidLocation("");
                      }
                    }}
                    placeholder="Nhập điểm dừng"
                    fullWidth
                    variant="standard"
                    color="default"
                  />
                ) : (
                  <Typography
                    sx={{ cursor: "pointer", color: "default.main", fontStyle: "italic" }}
                    onClick={() => setIsEditing(true)}
                  >
                    + Thêm điểm dừng
                  </Typography>
                )}
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="secondary" />
              </TimelineSeparator>
              <TimelineContent sx={{ flex: 3 }}>
                <Typography>{so.deliveryToAddress}</Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        )}
      </Paper>
    </Container>
  );
};

export default UpdateDoProcess;
