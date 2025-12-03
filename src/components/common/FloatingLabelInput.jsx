import React, { useState } from "react";
import { Input } from "@material-tailwind/react";

/**
 * Floating Label Input Component
 * Wrapper around Material Tailwind Input for consistent styling
 */
const FloatingLabelInput = ({ label, error, success, ...props }) => {
  return (
    <div className="w-full">
      <Input
        variant="outlined"
        label={label}
        error={!!error}
        success={success}
        className="!border-blue-gray-200 focus:!border-blue-500 placeholder:opacity-0 focus:placeholder:opacity-100"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        containerProps={{
          className: "min-w-0",
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingLabelInput;
