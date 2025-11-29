import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { CheckIcon } from "@heroicons/react/24/outline";

const STATUS_COLORS = {
  "Đang thực hiện": "bg-green-500",
  "Đã hoàn thành": "bg-blue-900",
  default: "bg-blue-gray-300",
};

const ProcessCard = ({ process, onComplete, moStatus }) => {
  const statusClass = STATUS_COLORS[process.status] || STATUS_COLORS.default;

  // Show check button if:
  // 1. Process status is "Đang thực hiện", OR
  // 2. Process is the first one (stageDetailOrder === 1) and MO is in production status
  //    and process hasn't been started yet (no startedOn)
  const canComplete =
    process.status === "Đang thực hiện" ||
    (process.stageDetailOrder === 1 &&
      (moStatus === "Đang sản xuất" || moStatus === "Chờ sản xuất") &&
      !process.startedOn &&
      process.status !== "Đã hoàn thành");

  return (
    <Card className="border border-blue-gray-100 shadow-md h-full flex flex-col">
      <div
        className={`flex items-center justify-between px-3 py-2 text-white ${statusClass}`}
      >
        <Typography variant="h6" className="font-semibold text-white">
          {process.stageDetailOrder}. {process.stageDetailName}
        </Typography>
        {canComplete && (
          <IconButton
            variant="text"
            color="white"
            onClick={() => onComplete?.(process)}
            aria-label={`Hoàn thành công đoạn ${process.stageDetailOrder}: ${process.stageDetailName}`}
            title={`Hoàn thành công đoạn ${process.stageDetailOrder}: ${process.stageDetailName}`}
          >
            <CheckIcon className="h-5 w-5 text-white" />
          </IconButton>
        )}
      </div>
      <CardBody className="flex flex-col gap-2 flex-1">
        <Typography variant="small" color="blue-gray">
          Trạng thái: {process.status}
        </Typography>
        <Typography variant="small" color="blue-gray">
          Bắt đầu:{" "}
          {process.startedOn
            ? new Date(process.startedOn).toLocaleString()
            : "Chưa"}
        </Typography>
        <Typography variant="small" color="blue-gray">
          Kết thúc:{" "}
          {process.finishedOn
            ? new Date(process.finishedOn).toLocaleString()
            : "Chưa"}
        </Typography>
      </CardBody>
    </Card>
  );
};

ProcessCard.propTypes = {
  process: PropTypes.object.isRequired,
  onComplete: PropTypes.func,
  moStatus: PropTypes.string,
};

export default ProcessCard;
