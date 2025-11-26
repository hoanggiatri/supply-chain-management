import React from "react";
import { Input, Typography } from "@material-tailwind/react";

const PlantForm = ({ plant, onChange, errors, readOnlyFields }) => {
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Mã xưởng */}
      <div>
        <Input
          label="Mã xưởng"
          name="plantCode"
          color="blue"
          value={plant.plantCode || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("plantCode")}
          required
        />
        {errors.plantCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.plantCode}
          </Typography>
        )}
      </div>

      {/* Tên xưởng */}
      <div>
        <Input
          label="Tên xưởng"
          name="plantName"
          color="blue"
          value={plant.plantName || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("plantName")}
          required
        />
        {errors.plantName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.plantName}
          </Typography>
        )}
      </div>

      {/* Mô tả */}
      <div className="md:col-span-2">
        <Input
          label="Mô tả"
          name="description"
          color="blue"
          value={plant.description || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("description")}
        />
        {errors.description && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.description}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default PlantForm;
