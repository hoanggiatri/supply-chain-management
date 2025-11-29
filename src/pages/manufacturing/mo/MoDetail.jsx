/* global globalThis */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import MoForm from "@/components/manufacturing/MoForm";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import {
  getAllProcessesInMo,
  updateProcess,
} from "@/services/manufacturing/ProcessService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import { createReceiveTicket } from "@/services/inventory/ReceiveTicketService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import ProcessCard from "@/components/content-components/ProcessCard";
import dayjs from "dayjs";
import toastrService from "@/services/toastrService";
import BackButton from "@/components/common/BackButton";
import { getButtonProps } from "@/utils/buttonStyles";

const MoDetail = () => {
  const { moId } = useParams();
  const [mo, setMo] = useState(null);
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [hasRequestedReceive, setHasRequestedReceive] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchMo = async () => {
      try {
        const data = await getMoById(moId, token);
        setMo(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin công lệnh!"
        );
      }
    };

    fetchMo();
  }, [moId, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsData = await getAllItemsInCompany(companyId, token);
        setItems(itemsData);

        const linesData = await getAllLinesInCompany(companyId, token);
        setLines(linesData);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy dữ liệu!"
        );
      }
    };

    fetchData();
  }, [companyId, token]);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const data = await getAllProcessesInMo(moId, token);
        const sorted = data.sort(
          (a, b) => a.stageDetailOrder - b.stageDetailOrder
        );
        setProcesses(sorted);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy process!"
        );
      }
    };

    if (moId && token) {
      fetchProcesses();
    }
  }, [moId, token, mo?.status]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getAllWarehousesInCompany(companyId, token);
        setWarehouses(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể tải danh sách kho!"
        );
      }
    };
    fetchWarehouses();
  }, [companyId, token]);

  const handleConfirm = (type, id) => {
    navigate(`/check-inventory/${type}/${id}`);
  };

  const toISO8601String = (dateString) => {
    if (!dateString) return null;
    return dayjs(dateString).toISOString();
  };

  const handleCancelMo = async () => {
    const confirmFn =
      typeof globalThis !== "undefined" &&
      typeof globalThis.confirm === "function"
        ? globalThis.confirm.bind(globalThis)
        : null;
    if (
      confirmFn &&
      !confirmFn("Bạn có chắc chắn muốn hủy công lệnh này không?")
    ) {
      return;
    }

    try {
      // Only send allowed fields, exclude read-only and computed fields
      const request = {
        itemId: Number(mo.itemId),
        lineId: Number(mo.lineId),
        type: mo.type,
        quantity: mo.quantity,
        estimatedStartTime: toISO8601String(mo.estimatedStartTime),
        estimatedEndTime: toISO8601String(mo.estimatedEndTime),
        status: "Đã hủy",
      };
      await updateMo(moId, request, token);
      toastrService.success("Đã hủy công lệnh!");

      setMo((prev) => ({
        ...prev,
        status: "Đã hủy",
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi hủy công lệnh!"
      );
    }
  };

  const handleEditClick = () => {
    if (mo.status === "Chờ xác nhận") {
      navigate(`/mo/${moId}/edit`);
    } else {
      toastrService.warning(
        "Chỉ công lệnh ở trạng thái 'Chờ xác nhận' mới được chỉnh sửa!"
      );
    }
  };

  const handleCompleteProcess = async (currentProcess) => {
    const now = dayjs().format("YYYY-MM-DDTHH:mm:ss");

    try {
      // Validate process data
      if (!currentProcess.id) {
        toastrService.error("Không tìm thấy ID của process!");
        return;
      }

      // Convert moId to number if needed
      const moIdNum = Number(moId);
      if (Number.isNaN(moIdNum)) {
        toastrService.error("ID công lệnh không hợp lệ!");
        return;
      }

      // If process hasn't started yet, start it first
      const startedOn = currentProcess.startedOn || now;
      const isFirstProcess = currentProcess.stageDetailOrder === 1;
      const isStartingFirstProcess =
        !currentProcess.startedOn && isFirstProcess;

      // If starting the first process and MO is "Chờ sản xuất", update MO to "Đang sản xuất"
      if (isStartingFirstProcess && mo.status === "Chờ sản xuất") {
        await updateMo(
          moIdNum,
          {
            itemId: Number(mo.itemId),
            lineId: Number(mo.lineId),
            type: mo.type,
            quantity: mo.quantity,
            estimatedStartTime: toISO8601String(mo.estimatedStartTime),
            estimatedEndTime: toISO8601String(mo.estimatedEndTime),
            status: "Đang sản xuất",
          },
          token
        );

        setMo((prevMo) => ({
          ...prevMo,
          status: "Đang sản xuất",
        }));
      }

      // Update current process to completed
      await updateProcess(
        currentProcess.id,
        {
          moId: moIdNum,
          stageDetailId: currentProcess.stageDetailId,
          startedOn: startedOn,
          finishedOn: now,
          status: "Đã hoàn thành",
        },
        token
      );

      const currentIndex = processes.findIndex(
        (p) => p.id === currentProcess.id
      );
      const nextProcess = processes[currentIndex + 1];

      if (nextProcess) {
        // Start next process
        if (!nextProcess.id) {
          toastrService.error("Không tìm thấy ID của process tiếp theo!");
          return;
        }

        await updateProcess(
          nextProcess.id,
          {
            moId: moIdNum,
            stageDetailId: nextProcess.stageDetailId,
            startedOn: now,
            status: "Đang thực hiện",
          },
          token
        );
      } else {
        // All processes completed, update MO status
        // Only send allowed fields, exclude read-only and computed fields
        await updateMo(
          moIdNum,
          {
            itemId: Number(mo.itemId),
            lineId: Number(mo.lineId),
            type: mo.type,
            quantity: mo.quantity,
            estimatedStartTime: toISO8601String(mo.estimatedStartTime),
            estimatedEndTime: toISO8601String(mo.estimatedEndTime),
            status: "Chờ nhập kho",
          },
          token
        );

        setMo((prevMo) => ({
          ...prevMo,
          status: "Chờ nhập kho",
        }));
      }

      // Refresh processes list
      const updatedProcesses = await getAllProcessesInMo(moIdNum, token);
      const sorted = updatedProcesses.sort(
        (a, b) => a.stageDetailOrder - b.stageDetailOrder
      );
      setProcesses(sorted);

      toastrService.success("Cập nhật process thành công!");
    } catch (error) {
      console.error("Error updating process:", error);
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi cập nhật process!"
      );
    }
  };

  const handleCreateReceiveTicket = async () => {
    if (!selectedWarehouseId) {
      toastrService.warning("Vui lòng chọn kho nhập.");
      return;
    }

    const employeeName = localStorage.getItem("employeeName");
    const receiveTicketRequest = {
      companyId: Number(companyId),
      warehouseId: Number(selectedWarehouseId),
      reason: "Nhập kho sau sản xuất",
      receiveType: "Sản xuất",
      referenceCode: mo.moCode,
      status: "Chờ xác nhận",
      receiveDate: new Date().toISOString(),
      createdBy: employeeName,
    };

    try {
      await createReceiveTicket(receiveTicketRequest, token);
      toastrService.success("Yêu cầu nhập kho thành công!");
      setHasRequestedReceive(true);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Không thể tạo phiếu nhập kho!"
      );
    }
  };

  const readOnlyFields = {
    moCode: true,
    status: true,
    itemId: true,
    lineId: true,
    type: true,
    quantity: true,
    estimatedStartTime: true,
    estimatedEndTime: true,
  };

  if (!mo) {
    return <LoadingPaper title="THÔNG TIN CÔNG LỆNH" />;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÔNG TIN CÔNG LỆNH
            </Typography>
            <BackButton to="/mos" label="Quay lại danh sách" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <Button
              type="button"
              {...getButtonProps("secondary")}
              onClick={() => navigate(`/bom/${mo.itemId}`)}
            >
              Xem BOM
            </Button>

            {mo.status === "Chờ xác nhận" && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  {...getButtonProps("success")}
                  onClick={() => handleConfirm("mo", mo.moId)}
                >
                  Xác nhận
                </Button>
                <Button
                  type="button"
                  {...getButtonProps("danger")}
                  onClick={handleCancelMo}
                >
                  Hủy
                </Button>
              </div>
            )}
          </div>

          {mo.status === "Chờ nhập kho" && !hasRequestedReceive && (
            <div className="border border-blue-gray-100 rounded-lg p-4 mb-6">
              <Typography variant="h5" color="blue-gray" className="mb-4">
                Chọn kho để nhập thành phẩm
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Kho nhập"
                    color="blue"
                    value={selectedWarehouseId}
                    onChange={(val) => setSelectedWarehouseId(val)}
                    className="w-full"
                  >
                    {warehouses.map((wh) => (
                      <Option key={wh.warehouseId} value={wh.warehouseId}>
                        {wh.warehouseCode} - {wh.warehouseName}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center">
                  <Button
                    type="button"
                    {...getButtonProps("primary")}
                    onClick={handleCreateReceiveTicket}
                    disabled={!selectedWarehouseId}
                    className="disabled:opacity-60"
                  >
                    Yêu cầu nhập kho
                  </Button>
                </div>
              </div>
            </div>
          )}

          <MoForm
            mo={mo}
            onChange={() => {}}
            errors={{}}
            readOnlyFields={readOnlyFields}
            items={items}
            lines={lines}
            setMo={setMo}
          />

          {mo.status === "Chờ xác nhận" && (
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                {...getButtonProps("primary")}
                onClick={handleEditClick}
              >
                Sửa
              </Button>
            </div>
          )}

          {mo.status !== "Chờ xác nhận" && mo.status !== "Đã hủy" && (
            <>
              <Typography variant="h5" color="blue-gray" className="mt-6 mb-4">
                QUÁ TRÌNH SẢN XUẤT
              </Typography>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {processes.map((process) => (
                  <div key={process.stageDetailOrder} className="min-w-[240px]">
                    <ProcessCard
                      process={process}
                      onComplete={(p) => handleCompleteProcess(p)}
                      moStatus={mo?.status}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MoDetail;
