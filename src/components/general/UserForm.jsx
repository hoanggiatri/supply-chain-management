import React from "react";
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

const UserForm = ({ user, onChange, errors, role }) => {
  const isReadOnly = role === "USER";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        {(role === "C-ADMIN" || role === "USER") && (
          <TextField fullWidth label="Mã nhân viên" name="employeeCode"
            value={user.employeeCode} required
            InputProps={{ readOnly: true }}
            error={!!errors.employeeCode} helperText={errors.employeeCode}
          />
        )}
        {role === "S-ADMIN" && (
          <TextField fullWidth label="Username" name="username"
            value={user.username} required
            InputProps={{ readOnly: isReadOnly }}
            onChange={isReadOnly ? undefined : onChange}
            error={!!errors.username} helperText={errors.username}
          />
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Email" name="email"
          value={user.email} required
          InputProps={{ readOnly: isReadOnly }}
          onChange={isReadOnly ? undefined : onChange}
          error={!!errors.email} helperText={errors.email}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required disabled={isReadOnly}>
          <InputLabel>Vai trò</InputLabel>
          <Select name="role" value={user.role || ""}
            label="Vai trò" onChange={isReadOnly ? undefined : onChange}
          >
            {role === "s-admin" && (
              <MenuItem value="S-ADMIN">S-ADMIN</MenuItem>
            )}
            <MenuItem value="C-ADMIN">C-ADMIN</MenuItem>
            <MenuItem value="USER">USER</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required disabled={isReadOnly}>
          <InputLabel>Trạng thái</InputLabel>
          <Select name="status" value={user.status || ""}
            label="Trạng thái" onChange={isReadOnly ? undefined : onChange}
          >
            <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
            <MenuItem value="Đã bị khóa">Đã bị khóa</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default UserForm;
