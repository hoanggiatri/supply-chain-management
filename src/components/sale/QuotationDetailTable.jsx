import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";

const QuotationDetailTable = ({ quotationDetails, setQuotationDetails }) => {

  const handleDetailChange = (index, field, value, type, maxValue) => {
    let newValue = value;

    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else if (num < 0) {
        newValue = 0;
      } else if (maxValue && num > maxValue) {
        newValue = maxValue;
      }
    }

    setQuotationDetails(prev =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Mã hàng hóa</TableCell>
          <TableCell>Tên hàng hóa</TableCell>
          <TableCell>Số lượng</TableCell>
          <TableCell>Ghi chú</TableCell>
          <TableCell>Đơn giá (VNĐ)</TableCell>
          <TableCell>Chiết khấu (VNĐ)</TableCell>
          <TableCell>Thành tiền (VNĐ)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {quotationDetails.map((d, i) => (
          <TableRow key={i}>
            <TableCell>{d.itemCode}</TableCell>
            <TableCell>{d.itemName}</TableCell>
            <TableCell>{d.quantity}</TableCell>
            <TableCell>{d.note}</TableCell>
            <TableCell>{d.itemPrice.toLocaleString()}</TableCell>
            <TableCell>
              <TextField
                type="number"
                value={d.discount}
                onChange={(e) => handleDetailChange(i, "discount", e.target.value, "number", d.itemPrice * d.quantity)}
                fullWidth
              />
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">
                {(d.itemPrice * d.quantity - d.discount).toLocaleString()}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuotationDetailTable;
