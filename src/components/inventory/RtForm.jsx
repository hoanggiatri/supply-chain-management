import React from "react";
import { Grid, TextField } from "@mui/material";

const RtForm = ({ ticket }) => {
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Mã phiếu" value={ticket.ticketCode} InputProps={{ readOnly: true }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Mã tham chiếu" value={ticket.referenceCode} InputProps={{ readOnly: true }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Mã kho" value={ticket.warehouseCode} InputProps={{ readOnly: true }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Tên kho" value={ticket.warehouseName} InputProps={{ readOnly: true }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Ngày nhập kho" type="datetime-local" InputLabelProps={{ shrink: true }} value={formatDateTimeLocal(ticket.receiveDate)} InputProps={{ readOnly: true }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Lý do" value={ticket.reason} InputProps={{ readOnly: true }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Loại nhập kho" value={ticket.receiveType} InputProps={{ readOnly: true }} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Trạng thái" value={ticket.status} InputProps={{ readOnly: true }} /></Grid>
    </Grid>
  );
};

export default RtForm;
