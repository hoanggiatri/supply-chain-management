import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PlantForm = ({ plant, onChange, errors = {}, readOnlyFields = {} }) => {
  const isFieldReadOnly = (field) => readOnlyFields[field] ?? false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="space-y-2">
        <Label htmlFor="plantName">
          Tên xưởng <span className="text-red-500">*</span>
        </Label>
        <Input
          id="plantName"
          name="plantName"
          value={plant.plantName || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("plantName")}
          className={errors.plantName ? "border-red-500" : ""}
          placeholder="Nhập tên xưởng"
        />
        {errors.plantName && (
          <p className="text-sm text-red-500">{errors.plantName}</p>
        )}
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          name="description"
          value={plant.description || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("description")}
          className={errors.description ? "border-red-500" : ""}
          rows={3}
          placeholder="Nhập mô tả"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default PlantForm;
