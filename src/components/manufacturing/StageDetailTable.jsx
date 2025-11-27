import React from "react";
import PropTypes from "prop-types";
import {
  Input,
  Textarea,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { getButtonProps } from "@/utils/buttonStyles";

const StageDetailTable = ({
  stageDetails = [],
  setStageDetails,
  errors = [],
  readOnly = false,
}) => {
  const canEdit = !readOnly && typeof setStageDetails === "function";

  const getFieldError = (index, field) =>
    errors?.find((err) => err.index === index && err.field === field);

  const handleDetailChange = (index, field, value, type) => {
    if (!canEdit) return;

    let newValue = value;
    if (type === "number") {
      const num = Number.parseFloat(value);
      if (Number.isNaN(num)) {
        newValue = "";
      } else {
        newValue = Math.max(0, num);
      }
    }

    setStageDetails((prev) =>
      prev.map((detail, i) =>
        i === index ? { ...detail, [field]: newValue } : detail
      )
    );
  };

  const handleAddRow = () => {
    if (!canEdit) return;
    setStageDetails((prev) => [
      ...prev,
      {
        stageName: "",
        stageOrder: prev.length + 1,
        estimatedTime: 0,
        description: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    if (!canEdit) return;
    const updated = stageDetails
      .filter((_, i) => i !== index)
      .map((detail, i) => ({ ...detail, stageOrder: i + 1 }));
    setStageDetails(updated);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-blue-gray-100">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700">
                Thứ tự
              </th>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700">
                Tên công đoạn
              </th>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700">
                Thời gian dự kiến (phút)
              </th>
              <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700">
                Ghi chú
              </th>
              {!readOnly && (
                <th className="bg-blue-gray-50/50 p-3 text-sm font-semibold text-blue-gray-700 text-center">
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {stageDetails.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 4 : 5}
                  className="p-4 text-center text-blue-gray-500"
                >
                  Chưa có công đoạn nào
                </td>
              </tr>
            ) : (
              stageDetails.map((detail, index) => {
                const rowKey = detail.stageOrder
                  ? `stage-detail-${detail.stageOrder}`
                  : `stage-detail-${index}`;
                return (
                  <tr key={rowKey} className="border-b border-blue-gray-50">
                    <td className="p-3 align-top">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {detail.stageOrder}
                      </Typography>
                    </td>

                    <td className="p-3 align-top">
                      {readOnly ? (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {detail.stageName || "-"}
                        </Typography>
                      ) : (
                        <div className="space-y-1">
                          <Input
                            label="Tên công đoạn"
                            value={detail.stageName || ""}
                            onChange={(e) =>
                              handleDetailChange(
                                index,
                                "stageName",
                                e.target.value
                              )
                            }
                            color="blue"
                            className="w-full placeholder:opacity-100"
                          />
                          {getFieldError(index, "stageName") && (
                            <Typography variant="small" color="red">
                              {getFieldError(index, "stageName")?.message}
                            </Typography>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      {readOnly ? (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {detail.estimatedTime}
                        </Typography>
                      ) : (
                        <div className="space-y-1">
                          <Input
                            label="Thời gian (phút)"
                            type="number"
                            min={0}
                            value={detail.estimatedTime ?? ""}
                            onChange={(e) =>
                              handleDetailChange(
                                index,
                                "estimatedTime",
                                e.target.value,
                                "number"
                              )
                            }
                            color="blue"
                            className="w-full placeholder:opacity-100"
                          />
                          {getFieldError(index, "estimatedTime") && (
                            <Typography variant="small" color="red">
                              {getFieldError(index, "estimatedTime")?.message}
                            </Typography>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-3 align-top">
                      {readOnly ? (
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {detail.description || "-"}
                        </Typography>
                      ) : (
                        <Textarea
                          label="Ghi chú"
                          value={detail.description || ""}
                          onChange={(e) =>
                            handleDetailChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          color="blue"
                          className="w-full placeholder:opacity-100"
                        />
                      )}
                    </td>

                    {!readOnly && (
                      <td className="p-3 align-top text-center">
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDeleteRow(index)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {canEdit && (
        <Button
          type="button"
          className="mt-4"
          {...getButtonProps("outlinedSecondary")}
          onClick={handleAddRow}
        >
          Thêm công đoạn
        </Button>
      )}
    </>
  );
};

export default StageDetailTable;

StageDetailTable.propTypes = {
  stageDetails: PropTypes.array,
  setStageDetails: PropTypes.func,
  errors: PropTypes.array,
  readOnly: PropTypes.bool,
};
