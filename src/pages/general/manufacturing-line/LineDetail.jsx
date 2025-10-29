import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import LineForm from "@components/general/LineForm";
import { getLineById } from "@/services/general/ManufactureLineService";
import LoadingPaper from "@/components/content-components/LoadingPaper";

const LineDetail = () => {
  const { lineId } = useParams();
  const [line, setLine] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLine = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getLineById(lineId, token);
        setLine(data);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin dây chuyền!");
      }
    };

    fetchLine();
  }, [lineId]);

  const readOnlyFields = {
    plantId: true,
    lineCode: true,
    lineName: true,
    description: true,
  };

  if (!line) {
    return <LoadingPaper title="THÔNG TIN DÂY CHUYỀN SẢN XUẤT" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN DÂY CHUYỀN SẢN XUẤT
        </Typography>

        <LineForm
          line={line}
          onChange={() => { }}
          errors={{}}
          readOnlyFields={readOnlyFields}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={() => navigate(`/line/${lineId}/edit`)}>
            Sửa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LineDetail;
