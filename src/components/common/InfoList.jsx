import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/**
 * InfoList Component
 * Displays a list of information with optional editing capabilities.
 * 
 * @param {string} title - Title of the section
 * @param {object} data - Data object containing values
 * @param {array} fields - Array of field definitions: { key, label, type, editable, options }
 * @param {function} onSave - Callback when a field is saved: (key, value) => Promise<void>
 * @param {string} color - Theme color (blue, green, orange, etc.)
 */
const InfoList = ({
  title,
  data,
  fields,
  onSave,
  color = "blue",
  className = "",
}) => {
  // State to track which field is currently being edited
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = {
    blue: "bg-blue-600 from-blue-600 to-blue-400",
    green: "bg-green-600 from-green-600 to-green-400",
    orange: "bg-orange-600 from-orange-600 to-orange-400",
    purple: "bg-purple-600 from-purple-600 to-purple-400",
    red: "bg-red-600 from-red-600 to-red-400",
    gray: "bg-gray-800 from-gray-800 to-gray-700",
  };

  const handleEditClick = (field) => {
    if (!field.editable) return;
    setEditingField(field.key);
    setEditValue(data[field.key] || "");
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSave = async (key) => {
    setLoading(true);
    try {
      await onSave(key, editValue);
      setEditingField(null);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderValue = (field) => {
    const value = data[field.key];
    if (field.type === "select" && field.options) {
      const option = field.options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  return (
    <Card className={`w-full shadow-sm border border-blue-gray-50 dark:border-dark-border dark:bg-dark-surface ${className}`}>
      <CardHeader
        variant="gradient"
        color={color}
        className={`mb-4 grid h-16 place-items-center ${colors[color] || colors.blue}`}
      >
        <Typography variant="h5" color="white" className="font-bold uppercase tracking-wide">
          {title}
        </Typography>
      </CardHeader>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.key} className="relative group">
              {editingField === field.key ? (
                <div className="flex items-start gap-2 animate-fade-in">
                  <div className="flex-grow">
                    {field.type === "select" ? (
                      <Select
                        label={field.label}
                        value={editValue}
                        onChange={(val) => setEditValue(val)}
                        color={color}
                        disabled={loading}
                      >
                        {field.options?.map((opt) => (
                          <Option key={opt.value} value={opt.value}>
                            {opt.label}
                          </Option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        type={field.type || "text"}
                        label={field.label}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        color={color}
                        disabled={loading}
                      />
                    )}
                  </div>
                  <div className="flex gap-1">
                    <IconButton
                      size="sm"
                      color="green"
                      variant="text"
                      onClick={() => handleSave(field.key)}
                      disabled={loading}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton
                      size="sm"
                      color="red"
                      variant="text"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </IconButton>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => handleEditClick(field)}
                  className={`p-3 rounded-lg border border-transparent transition-all duration-200 ${
                    field.editable
                      ? "cursor-pointer hover:bg-blue-gray-50 dark:hover:bg-white/5 hover:border-blue-gray-100 dark:hover:border-dark-border group"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography
                        variant="small"
                        className="font-medium text-blue-gray-500 dark:text-dark-muted mb-1"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Typography>
                      <Typography
                        variant="paragraph"
                        className="font-semibold text-blue-gray-900 dark:text-dark-text min-h-[1.5rem]"
                      >
                        {renderValue(field) || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                      </Typography>
                    </div>
                    {field.editable && (
                      <PencilSquareIcon className="h-4 w-4 text-blue-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default InfoList;
