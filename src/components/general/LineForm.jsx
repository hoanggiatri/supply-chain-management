import React, { useEffect, useState } from "react";
import { Input, Select, Option, Typography } from "@material-tailwind/react";
import { getAllPlantsInCompany } from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";

const LineForm = ({
  line,
  onChange,
  errors = {},
  readOnlyFields = {},
  requireLineCode = true,
}) => {
  const [plants, setPlants] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  const handleSelectChange = (name, value) => {
    onChange({
      target: {
        name,
        value,
      },
    });
  };

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await getAllPlantsInCompany(companyId, token);
        setPlants(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy danh sách xưởng sản xuất!"
        );
      }
    };
    fetchPlants();
  }, [companyId, token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Xưởng sản xuất */}
      <div>
        <Select
          label="Xưởng sản xuất"
          value={line.plantId || ""}
          color="blue"
          onChange={(val) => handleSelectChange("plantId", val)}
          className="w-full placeholder:opacity-100"
          disabled={isFieldReadOnly("plantId")}
        >
          {plants.map((plant) => (
            <Option key={plant.plantId} value={plant.plantId}>
              {plant.plantCode} - {plant.plantName}
            </Option>
          ))}
        </Select>
        {errors.plantId && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.plantId}
          </Typography>
        )}
      </div>

      {/* Mã dây chuyền */}
      <div>
        <Input
          label="Mã dây chuyền"
          name="lineCode"
          color="blue"
          value={line.lineCode || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("lineCode")}
          required={requireLineCode}
        />
        {errors.lineCode && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.lineCode}
          </Typography>
        )}
      </div>

      {/* Tên dây chuyền */}
      <div>
        <Input
          label="Tên dây chuyền"
          name="lineName"
          color="blue"
          value={line.lineName || ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("lineName")}
          required
        />
        {errors.lineName && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.lineName}
          </Typography>
        )}
      </div>

      {/* Công suất */}
      <div>
        <Input
          label="Công suất"
          name="capacity"
          type="number"
          color="blue"
          value={line.capacity ?? ""}
          onChange={onChange}
          className="w-full placeholder:opacity-100"
          readOnly={isFieldReadOnly("capacity")}
        />
        {errors.capacity && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.capacity}
          </Typography>
        )}
      </div>

      {/* Mô tả */}
      <div className="md:col-span-2">
        <Input
          label="Mô tả"
          name="description"
          color="blue"
          value={line.description || ""}
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

export default LineForm;
