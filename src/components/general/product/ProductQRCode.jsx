import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

const ProductQRCode = ({ qrCode, productId }) => {
    const downloadQR = () => {
        const canvas = document.getElementById("qr-gen");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_${productId}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    if (!qrCode) return null;

    return (
        <Paper elevation={3} sx={{ p: 2, textAlign: "center", display: "inline-block" }}>
            <Typography variant="subtitle1" gutterBottom>
                Mã QR Sản Phẩm
            </Typography>
            <Box sx={{ mb: 2 }}>
                <QRCodeCanvas
                    id="qr-gen"
                    value={qrCode}
                    size={200}
                    level={"H"}
                    includeMargin={true}
                />
            </Box>
            <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-all" }}>
                {qrCode}
            </Typography>
            <Button variant="outlined" size="small" onClick={downloadQR}>
                Tải xuống PNG
            </Button>
        </Paper>
    );
};

export default ProductQRCode;
