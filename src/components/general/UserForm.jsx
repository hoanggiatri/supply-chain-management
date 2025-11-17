import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const getRoleLabel = (roleValue) => {
  const roleMap = {
    c_admin: "Quản trị công ty",
    s_admin: "Quản trị hệ thống",
    user: "Nhân viên",
  };
  return roleMap[roleValue] || roleValue;
};

const getStatusLabel = (statusValue) => {
  const statusMap = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
    resigned: "Đã nghỉ",
  };
  return statusMap[statusValue] || statusValue;
};

const UserForm = ({ user, onChange, errors, role, readOnly }) => {
  const isReadOnly = readOnly || role === "USER";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        {(role === "C-ADMIN" || role === "USER") && (
          <TextField
            fullWidth
            label="Mã nhân viên"
            name="employeeCode"
            value={user.employeeCode}
            required
            InputProps={{ readOnly: true }}
            error={!!errors.employeeCode}
            helperText={errors.employeeCode}
          />
        )}
        {role === "S-ADMIN" && (
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={user.username}
            required
            InputProps={{ readOnly: isReadOnly }}
            onChange={isReadOnly ? undefined : onChange}
            error={!!errors.username}
            helperText={errors.username}
          />
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={user.email}
          required
          InputProps={{ readOnly: isReadOnly }}
          onChange={isReadOnly ? undefined : onChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        {isReadOnly ? (
          <TextField
            fullWidth
            label="Vai trò"
            value={getRoleLabel(user.role) || ""}
            InputProps={{ readOnly: true }}
          />
        ) : (
          <FormControl fullWidth required disabled={isReadOnly}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={user.role || ""}
              label="Vai trò"
              onChange={onChange}
            >
              {role === "s-admin" && (
                <MenuItem value="s_admin">Quản trị hệ thống</MenuItem>
              )}
              <MenuItem value="c_admin">Quản trị công ty</MenuItem>
              <MenuItem value="user">Nhân viên</MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        {isReadOnly ? (
          <TextField
            fullWidth
            label="Trạng thái"
            value={getStatusLabel(user.status) || ""}
            InputProps={{ readOnly: true }}
          />
        ) : (
          <FormControl fullWidth required disabled={isReadOnly}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={user.status || ""}
              label="Trạng thái"
              onChange={onChange}
            >
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
              <MenuItem value="resigned">Đã nghỉ</MenuItem>
            </Select>
          </FormControl>
        )}
      </Grid>
    </Grid>
  );
};

export default UserForm;
