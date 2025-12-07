import React, { useEffect, useState } from "react";
import { getAllPlantsInCompany } from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
      <div className="space-y-2">
        <Label htmlFor="plantId">Xưởng sản xuất <span className="text-red-500">*</span></Label>
        <Select
          value={line.plantId || ""}
          onValueChange={(val) => handleSelectChange("plantId", val)}
          disabled={isFieldReadOnly("plantId")}
        >
          <SelectTrigger className={errors.plantId ? "border-red-500" : ""}>
            <SelectValue placeholder="Chọn xưởng sản xuất" />
          </SelectTrigger>
          <SelectContent>
            {plants.map((plant) => (
              <SelectItem key={plant.plantId} value={plant.plantId}>
                {plant.plantCode} - {plant.plantName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.plantId && (
          <p className="text-sm text-red-500">{errors.plantId}</p>
        )}
      </div>

      {/* Mã dây chuyền */}
      <div className="space-y-2">
        <Label htmlFor="lineCode">Mã dây chuyền {requireLineCode && <span className="text-red-500">*</span>}</Label>
        <Input
          id="lineCode"
          name="lineCode"
          value={line.lineCode || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("lineCode")}
          disabled={isFieldReadOnly("lineCode")}
          className={errors.lineCode ? "border-red-500" : ""}
        />
        {errors.lineCode && (
          <p className="text-sm text-red-500">{errors.lineCode}</p>
        )}
      </div>

      {/* Tên dây chuyền */}
      <div className="space-y-2">
        <Label htmlFor="lineName">Tên dây chuyền <span className="text-red-500">*</span></Label>
        <Input
          id="lineName"
          name="lineName"
          value={line.lineName || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("lineName")}
          className={errors.lineName ? "border-red-500" : ""}
        />
        {errors.lineName && (
          <p className="text-sm text-red-500">{errors.lineName}</p>
        )}
      </div>

      {/* Công suất */}
      <div className="space-y-2">
        <Label htmlFor="capacity">Công suất</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          value={line.capacity ?? ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("capacity")}
          className={errors.capacity ? "border-red-500" : ""}
        />
        {errors.capacity && (
          <p className="text-sm text-red-500">{errors.capacity}</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          name="description"
          value={line.description || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("description")}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default LineForm;
