import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAllPlantsInCompany } from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";

const LineForm = ({
  line,
  onChange,
  errors = {},
  readOnlyFields = {},
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

  const plantOptions = plants.map((plant) => ({
    value: plant.plantId,
    label: `${plant.plantCode} - ${plant.plantName}`,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Xưởng sản xuất */}
      <div className="space-y-2">
        <Label htmlFor="plantId">
          Xưởng sản xuất <span className="text-red-500">*</span>
        </Label>
        <Combobox
          options={plantOptions}
          value={line.plantId}
          onChange={(option) => handleSelectChange("plantId", option?.value)}
          placeholder="Chọn xưởng sản xuất"
          searchPlaceholder="Tìm xưởng sản xuất..."
          emptyText="Không tìm thấy xưởng sản xuất"
          disabled={isFieldReadOnly("plantId")}
          className={errors.plantId ? "border-red-500" : ""}
        />
        {errors.plantId && (
          <p className="text-sm text-red-500">{errors.plantId}</p>
        )}
      </div>

      {/* Tên dây chuyền */}
      <div className="space-y-2">
        <Label htmlFor="lineName">
          Tên dây chuyền <span className="text-red-500">*</span>
        </Label>
        <Input
          id="lineName"
          name="lineName"
          value={line.lineName || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("lineName")}
          className={errors.lineName ? "border-red-500" : ""}
          placeholder="Nhập tên dây chuyền"
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
          placeholder="Nhập công suất"
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
          placeholder="Nhập mô tả"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default LineForm;
