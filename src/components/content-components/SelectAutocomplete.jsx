import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const SelectAutocomplete = ({
  options = [],
  value,
  onChange,
  placeholder,
  error,
  helperText,
  size = "small",
  disabled,
}) => {
  return (
    <Autocomplete
      size={size}
      options={options}
      getOptionLabel={(option) => option.label || ""}
      isOptionEqualToValue={(option, val) =>
        option.value === (val?.value ?? val)
      }
      value={
        typeof value === "object"
          ? value
          : options.find((opt) => opt.value === value) || null
      }
      onChange={(_, newValue) => onChange(newValue)}
      
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          error={!!error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            sx: { height: 41 },
          }}
        />
      )}
      disabled={disabled}
    />
  );
};

export default SelectAutocomplete;
