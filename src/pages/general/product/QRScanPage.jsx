import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { scanQRCode } from "@/services/general/ProductService";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const QRScanPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanError, setScanError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scannerRef.current = scanner;

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText, decodedResult) {
      // Pause scanning to prevent multiple triggers
      scanner.pause();
      handleScan(decodedText);
    }

    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    };
  }, []);

  const handleScan = async (qrCode) => {
    setLoading(true);
    setScanError(null);
    try {
      const product = await scanQRCode(qrCode, token);
      if (product && product.productId) {
        toastrService.success("Quét thành công!");
        navigate(`/product/${product.productId}`);
      } else {
        setScanError("Không tìm thấy sản phẩm!");
        toastrService.error("Không tìm thấy sản phẩm!");
      }
    } catch (error) {
      setScanError("Lỗi khi quét mã hoặc sản phẩm không tồn tại.");
      toastrService.error("Lỗi khi quét mã hoặc sản phẩm không tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode) {
      handleScan(manualCode);
    }
  };

  const handleResetScan = () => {
    setScanError(null);
    setManualCode("");
    if (scannerRef.current) {
      try {
        scannerRef.current.resume();
      } catch (e) {
        // If resume fails (e.g. was cleared), we might need to re-render or reload page
        // Simple fallback: reload page or just let user know
        window.location.reload();
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        className="paper-container"
        elevation={3}
        sx={{ p: 3, mt: 4, textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          QUÉT MÃ QR
        </Typography>

        {loading && <CircularProgress sx={{ mb: 2 }} />}

        {scanError ? (
          <Box mb={3}>
            <Typography color="error" gutterBottom>
              {scanError}
            </Typography>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleResetScan}
            >
              Quét lại
            </Button>
          </Box>
        ) : (
          <Box id="reader" sx={{ width: "100%", minHeight: "300px", mb: 3 }} />
        )}

        <Typography variant="body1" gutterBottom>
          Hoặc nhập mã thủ công:
        </Typography>

        <form onSubmit={handleManualSubmit}>
          <Box display="flex" gap={1} justifyContent="center">
            <TextField
              label="Mã QR String"
              variant="outlined"
              size="small"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              {...getButtonProps("primary")}
              disabled={loading}
            >
              Tìm
            </Button>
          </Box>
        </form>

        <Box mt={3}>
          <Button
            type="button"
            {...getButtonProps("textSecondary")}
            onClick={() => navigate("/products")}
          >
            Quay lại danh sách
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default QRScanPage;
