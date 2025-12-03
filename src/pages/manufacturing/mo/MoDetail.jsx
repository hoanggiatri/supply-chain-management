import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Select,
  Option,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Spinner,
} from "@material-tailwind/react";
import { Grid } from "@mui/material";
import {
  QrCodeIcon,
  ListBulletIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import MoForm from "@/components/manufacturing/MoForm";
import {
  getMoById,
  updateMo,
  completeMo,
} from "@/services/manufacturing/MoService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import {
  getAllProcessesInMo,
  updateProcess,
} from "@/services/manufacturing/ProcessService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import {
  createReceiveTicket,
  getAllReceiveTicketsInCompany,
} from "@/services/inventory/ReceiveTicketService";
import { downloadQRPDF } from "@/services/general/ProductService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import ProcessCard from "@/components/content-components/ProcessCard";
import dayjs from "dayjs";
import toastrService from "@/services/toastrService";
import BackButton from "@/components/common/BackButton";
import { getButtonProps } from "@/utils/buttonStyles";
import StatusBadge from "@/components/common/StatusBadge";

const MoDetail = () => {
  const { moId } = useParams();
  const [mo, setMo] = useState(null);
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [hasRequestedReceive, setHasRequestedReceive] = useState(false);
  const [receiveTicketId, setReceiveTicketId] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completedQuantity, setCompletedQuantity] = useState(0);
  const [isCompletingMo, setIsCompletingMo] = useState(false);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    setHasRequestedReceive(false);
    setReceiveTicketId(null);
    const checkExistingReceiveTicket = async () => {
      if (!mo || mo.status !== "Chờ nhập kho") {
        setLoading(false);
        return;
      }

      try {
        const allTickets = await getAllReceiveTicketsInCompany(
          companyId,
          token
        );
        const existingTicket = allTickets.find(
          (ticket) =>
            ticket.receiveType === "Sản xuất" &&
            ticket.referenceId === parseInt(moId) &&
            (ticket.status === "Chờ xác nhận" ||
              ticket.status === "Chờ nhập kho")
        );

        if (existingTicket) {
          setHasRequestedReceive(true);
          setReceiveTicketId(existingTicket.ticketId);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra phiếu nhập kho:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingReceiveTicket();
  }, [mo, moId, companyId, token]);

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
    if (!window.confirm("Bạn có chắc chắn muốn hủy công lệnh này không?")) {
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
      const result = await createReceiveTicket(receiveTicketRequest, token);
      toastrService.success("Yêu cầu nhập kho thành công!");
      setHasRequestedReceive(true);
      setReceiveTicketId(result.ticketId);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Không thể tạo phiếu nhập kho!"
      );
    }
  };

  const handleCompleteMo = async () => {
    if (!completedQuantity || completedQuantity <= 0) {
      toastrService.error("Số lượng hoàn thành phải lớn hơn 0!");
      return;
    }

    if (completedQuantity > mo.quantity) {
      toastrService.warning("Số lượng hoàn thành vượt quá số lượng kế hoạch!");
    }

    setIsCompletingMo(true);

    try {
      const result = await completeMo(moId, completedQuantity, token);

      toastrService.success("Hoàn thành công lệnh thành công!");

      if (result.productsGenerated) {
        toastrService.info(
          `Đã tạo ${completedQuantity} sản phẩm với QR codes!`
        );
      }

      const updatedMo = await getMoById(moId, token);
      setMo(updatedMo);
      setShowCompleteModal(false);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi hoàn thành công lệnh!"
      );
    } finally {
      setIsCompletingMo(false);
    }
  };

  const handleDownloadBatchQR = async () => {
    if (!mo.batchNo) {
      toastrService.error("Không tìm thấy batch number!");
      return;
    }

    try {
      toastrService.info("Đang tạo file PDF...");
      const blob = await downloadQRPDF(mo.batchNo, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_Batch_${mo.batchNo}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toastrService.success("Tải QR codes thành công!");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tải QR codes!"
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

  const allProcessesCompleted =
    processes.length > 0 &&
    processes.every((p) => p.status === "Đã hoàn thành");

  if (!mo) {
    return <LoadingPaper title="THÔNG TIN CÔNG LỆNH" />;
  }

  if (loading) {
    return null;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Typography variant="h4" color="blue-gray" className="font-bold">
                THÔNG TIN CÔNG LỆNH
              </Typography>
              <StatusBadge status={mo.status} />
            </div>
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

            {mo.status === "Đã nhập kho" && (
              <Button
                {...getButtonProps("success")}
                onClick={() => {
                  setCompletedQuantity(mo.quantity);
                  setShowCompleteModal(true);
                }}
              >
                Hoàn thành công lệnh
              </Button>
            )}
          </div>

          {mo.status === "Đã hoàn thành" && mo.batchNo && (
            <Card className="mb-6 border border-blue-gray-100">
              <CardBody>
                <div className="flex items-center gap-2 mb-4">
                  <QrCodeIcon className="h-6 w-6 text-blue-500" />
                  <Typography variant="h5" color="blue-gray">
                    Thông tin sản phẩm đã tạo
                  </Typography>
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="small" color="gray">
                      Batch Number
                    </Typography>
                    <Typography variant="h6">{mo.batchNo}</Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="small" color="gray">
                      Số lượng sản phẩm
                    </Typography>
                    <Typography variant="h6">
                      {mo.completedQuantity} sản phẩm
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        {...getButtonProps("primary")}
                        onClick={() =>
                          navigate(`/products?batch=${mo.batchNo}`)
                        }
                      >
                        <ListBulletIcon className="mr-2 h-5 w-5" />
                        Xem danh sách sản phẩm
                      </Button>

                      <Button
                        {...getButtonProps("secondary")}
                        onClick={handleDownloadBatchQR}
                      >
                        <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                        Tải QR Codes (PDF)
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          )}

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

          {hasRequestedReceive &&
            receiveTicketId &&
            mo.status === "Chờ nhập kho" && (
              <Card className="mb-6 bg-green-50">
                <CardBody>
                  <Typography variant="h6" color="green" className="mb-2">
                    Đã tạo phiếu nhập kho thành công!
                  </Typography>
                  <Typography variant="small" color="gray" className="mb-4">
                    Vui lòng chuyển đến trang nhập kho để xác nhận.
                  </Typography>
                  <Button
                    {...getButtonProps("primary")}
                    onClick={() =>
                      navigate(`/receive-ticket/${receiveTicketId}`)
                    }
                  >
                    Đến trang nhập kho
                  </Button>
                </CardBody>
              </Card>
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

      <Dialog
        open={showCompleteModal}
        handler={() => setShowCompleteModal(false)}
      >
        <DialogHeader>Hoàn thành công lệnh sản xuất</DialogHeader>
        <DialogBody>
          <Input
            label="Số lượng hoàn thành"
            type="number"
            color="blue"
            size="lg"
            value={completedQuantity}
            onChange={(e) => setCompletedQuantity(Number(e.target.value))}
            className="w-full"
          />
          <Typography variant="small" color="gray" className="mt-2">
            Số lượng kế hoạch: {mo.quantity}
          </Typography>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button
            {...getButtonProps("secondary")}
            onClick={() => setShowCompleteModal(false)}
          >
            Hủy
          </Button>
          <Button
            {...getButtonProps("success")}
            onClick={handleCompleteMo}
            disabled={isCompletingMo}
          >
            {isCompletingMo ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default MoDetail;
