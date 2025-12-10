import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Select,
  Option,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { DataTable } from "@/components/ui/data-table";
import {
  getAllInventory,
  checkInventory,
  increaseOnDemand,
} from "@/services/inventory/InventoryService";
import { getBomByItemId } from "@/services/manufacturing/BomService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { createIssueTicket } from "@/services/inventory/IssueTicketService";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { getPoById } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@/components/common/BackButton";
import dayjs from "dayjs";
import { createSortableHeader, createStatusBadge } from "@/components/ui/data-table";

const CheckInventory = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [bomDetails, setBomDetails] = useState([]);
  const [ttDetails, setTtDetails] = useState([]);
  const [poDetails, setPoDetails] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [inventoryResults, setInventoryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");
  const navigate = useNavigate();
  const { type, id } = useParams();

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

  useEffect(() => {
    const fetchDataByType = async () => {
      try {
        if (type === "mo") {
          const mo = await getMoById(id, token);
          setQuantity(mo.quantity);
          const bom = await getBomByItemId(mo.itemId, token);
          setBomDetails(bom.bomDetails);
        }

        if (type === "tt") {
          const tt = await getTransferTicketById(id, token);
          setTtDetails(tt.transferTicketDetails);
          setSelectedWarehouseId(tt.fromWarehouseId);
        }

        if (type === "po") {
          const po = await getPoById(id, token);
          setPoDetails(po.purchaseOrderDetails);
        }
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể tải dữ liệu!"
        );
      }
    };
    fetchDataByType();
  }, [type, id, token]);

  const handleWarehouseChange = (e) => {
    setSelectedWarehouseId(e.target.value);
  };

  const handleCheckInventory = async () => {
    if (!selectedWarehouseId) {
      toastrService.warning("Vui lòng chọn kho!");
      return;
    }

    setLoading(true);
    try {
      let results = [];

      if (type === "mo") {
        results = await Promise.all(
          bomDetails.map(async (detail) => {
            const inventories = await getAllInventory(
              detail.itemId,
              selectedWarehouseId,
              companyId,
              token
            );
            const amountAvailabled =
              inventories[0]?.quantity - inventories[0]?.onDemandQuantity || 0;
            const amountNeeded = detail.quantity * quantity;
            const check = await checkInventory(
              detail.itemId,
              selectedWarehouseId,
              amountNeeded,
              token
            );
            return {
              ...detail,
              quantityNeeded: amountNeeded,
              available: amountAvailabled,
              enough: check,
            };
          })
        );
      }

      if (type === "tt") {
        results = await Promise.all(
          ttDetails.map(async (detail) => {
            const inventories = await getAllInventory(
              detail.itemId,
              selectedWarehouseId,
              companyId,
              token
            );
            const amountAvailabled =
              inventories[0]?.quantity - inventories[0]?.onDemandQuantity || 0;
            const amountNeeded = detail.quantity;
            const check = await checkInventory(
              detail.itemId,
              selectedWarehouseId,
              amountNeeded,
              token
            );
            return {
              ...detail,
              quantityNeeded: amountNeeded,
              available: amountAvailabled,
              enough: check,
            };
          })
        );
      }

      if (type === "po") {
        results = await Promise.all(
          poDetails.map(async (detail) => {
            const inventories = await getAllInventory(
              detail.supplierItemId,
              selectedWarehouseId,
              companyId,
              token
            );
            const amountAvailabled =
              inventories[0]?.quantity - inventories[0]?.onDemandQuantity || 0;
            const amountNeeded = detail.quantity;
            const check = await checkInventory(
              detail.supplierItemId,
              selectedWarehouseId,
              amountNeeded,
              token
            );
            return {
              ...detail,
              quantityNeeded: amountNeeded,
              available: amountAvailabled,
              enough: check,
            };
          })
        );
      }

      setInventoryResults(results);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tải tồn kho!"
      );
    } finally {
      setLoading(false);
    }
  };

  const toISO8601String = (dateString) => {
    if (!dateString) return null;
    return dayjs(dateString).toISOString();
  };

  const handleConfirm = async () => {
    if (inventoryResults.length === 0) {
      toastrService.warning("Vui lòng kiểm tra tồn kho trước!");
      return;
    }

    try {
      const allEnough = inventoryResults.every((r) => r.enough);
      if (allEnough) {
        if (type === "mo") {
          const mo = await getMoById(id, token);
          // Only send allowed fields, exclude read-only and computed fields
          const updatedMo = {
            itemId: Number(mo.itemId),
            lineId: Number(mo.lineId),
            type: mo.type,
            quantity: mo.quantity,
            estimatedStartTime: toISO8601String(mo.estimatedStartTime),
            estimatedEndTime: toISO8601String(mo.estimatedEndTime),
            status: "Chờ sản xuất",
          };
          await updateMo(id, updatedMo, token);

          const issueTicketRequest = {
            companyId: companyId,
            warehouseId: parseInt(selectedWarehouseId),
            reason: "Xuất kho để sản xuất",
            issueType: "Sản xuất",
            referenceCode: mo.moCode,
            status: "Chờ xác nhận",
            createdBy: employeeName,
            issueDate: new Date().toISOString(),
          };
          await createIssueTicket(issueTicketRequest, token);

          await Promise.all(
            inventoryResults.map((r) =>
              increaseOnDemand(
                {
                  warehouseId: selectedWarehouseId,
                  itemId: r.itemId,
                  onDemandQuantity: r.quantityNeeded,
                },
                token
              )
            )
          );

          toastrService.success("Đã xác nhận công lệnh sản xuất!");
          navigate(-1);
        }

        if (type === "tt") {
          const tt = await getTransferTicketById(id, token);
          console.log("tt", tt);
          const updatedTt = {
            companyId: companyId,
            status: "Chờ xuất kho",
            reason: tt?.reason,
            fromWarehouseId: parseInt(tt?.fromWarehouseId),
            toWarehouseId: parseInt(tt?.toWarehouseId),
            createdBy: employeeName,
            transferTicketDetails: (tt?.transferTicketDetails || []).map(
              (d) => ({
                itemId: parseInt(d.itemId),
                quantity: parseFloat(d.quantity),
                note: d.note,
              })
            ),
          };
          await updateTransferTicket(id, updatedTt, token);

          const issueTicketRequest = {
            companyId: companyId,
            warehouseId: parseInt(selectedWarehouseId),
            reason: "Xuất kho để chuyển kho",
            issueType: "Chuyển kho",
            referenceCode: tt.ticketCode,
            status: "Chờ xác nhận",
            createdBy: employeeName,
            issueDate: new Date().toISOString(),
          };

          await createIssueTicket(issueTicketRequest, token);

          await Promise.all(
            inventoryResults.map((r) =>
              increaseOnDemand(
                {
                  warehouseId: selectedWarehouseId,
                  itemId: r.itemId,
                  onDemandQuantity: r.quantityNeeded,
                },
                token
              )
            )
          );

          toastrService.success("Đã xác nhận phiếu chuyển kho!");
          navigate(-1);
        }

        if (type === "po") {
          localStorage.setItem("poWarehouseId", selectedWarehouseId);
          navigate(`/create-so/${id}`);
        }
      } else {
        toastrService.warning("Có nguyên liệu không đủ số lượng!");
      }
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi xác nhận tồn kho!"
      );
    } finally {
      setLoading(false);
    }
  };

  const getCheckInventoryColumns = () => [
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
      cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
      cell: ({ getValue }) => <span>{getValue() || ""}</span>
    },
    {
      accessorKey: "quantityNeeded",
      header: createSortableHeader("Số lượng cần"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value !== "-" ? (
          <span className="font-semibold text-blue-600">
            {Number(value).toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "available",
      header: createSortableHeader("Tồn kho sẵn có"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value !== "-" ? (
          <span className="font-semibold text-green-600">
            {Number(value).toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: "enough",
      header: createSortableHeader("Đủ hàng"),
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors = {
          "Đủ": "bg-green-100 text-green-800",
          "Không đủ": "bg-red-100 text-red-800",
          "Không có tồn kho": "bg-orange-100 text-orange-800"
        };
        
        const statusLabels = {
          "Đủ": "✔️ Đủ",
          "Không đủ": "❌ Không đủ",
          "Không có tồn kho": "⚠️ Không có tồn kho"
        };
        
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColors[status] || "bg-gray-100 text-gray-700"}`}>
            {statusLabels[status] || status}
          </span>
        );
      },
    },
  ];

  const columns = getCheckInventoryColumns();

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" className="page-title">
          KIỂM TRA TỒN KHO
        </Typography>
        <BackButton />
      </div>

      <Card className="mb-4 shadow-sm">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <Typography variant="small" className="mb-1 font-medium">
                Kho xuất
              </Typography>
              {type === "tt" ? (
                <Typography className="border border-blue-gray-100 rounded-lg px-3 py-2 bg-blue-gray-50 text-sm">
                  {warehouses.find(
                    (w) => String(w.warehouseId) === String(selectedWarehouseId)
                  )
                    ? `${
                        warehouses.find(
                          (w) =>
                            String(w.warehouseId) ===
                            String(selectedWarehouseId)
                        )?.warehouseCode
                      } - ${
                        warehouses.find(
                          (w) =>
                            String(w.warehouseId) ===
                            String(selectedWarehouseId)
                        )?.warehouseName
                      }`
                    : "Không có kho"}
                </Typography>
              ) : (
                <Select
                  value={selectedWarehouseId || ""}
                  onChange={(value) => setSelectedWarehouseId(value)}
                  color="blue"
                  className="w-full"
                  label="Kho xuất"
                >
                  {warehouses.map((wh) => (
                    <Option key={wh.warehouseId} value={wh.warehouseId}>
                      {wh.warehouseCode} - {wh.warehouseName}
                    </Option>
                  ))}
                </Select>
              )}
            </div>

            <div className="flex md:justify-end">
              <Button
                type="button"
                {...getButtonProps("primary")}
                onClick={handleCheckInventory}
                disabled={!selectedWarehouseId || loading}
              >
                Kiểm tra tồn kho
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <DataTable
        columns={columns}
        data={inventoryResults}
        loading={loading}
        emptyMessage="Chưa có dữ liệu kiểm tra tồn kho"
        height="calc(100vh - 500px)"
        renderRow={(row, index) => {
          const key = `${row.itemId || row.supplierItemId}-${index}`;
          const statusLabels = {
            "Đủ": "✔️ Đủ",
            "Không đủ": "❌ Không đủ",
            "Không có tồn kho": "⚠️ Không có tồn kho"
          };
          
          return (
            <tr key={key} className="group even:bg-[#F8F9FC] odd:bg-white">
              <td className="px-6 py-4 text-sm font-medium">
                {type === "po" ? row.supplierItemCode : row.itemCode}
              </td>
              <td className="px-6 py-4 text-sm">
                {type === "po" ? row.supplierItemName : row.itemName}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                {row.enough === "Không có tồn kho" ? "-" : Number(row.quantityNeeded).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-green-600">
                {row.enough === "Không có tồn kho" ? "-" : Number(row.available).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm">
                {statusLabels[row.enough] || row.enough}
              </td>
            </tr>
          );
        }}
      />

      {inventoryResults.length > 0 && (
        <div className="mt-4 flex justify-end gap-3">
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={handleConfirm}
            disabled={loading}
          >
            Xác nhận
          </Button>
          <BackButton label="Hủy" />
        </div>
      )}
    </div>
  );
};

export default CheckInventory;
