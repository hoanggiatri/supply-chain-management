import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import {
  checkInventory,
  getAllInventory,
  increaseOnDemand,
} from "@/services/inventory/InventoryService";
import { createIssueTicket } from "@/services/inventory/IssueTicketService";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { getBomByItemId } from "@/services/manufacturing/BomService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { getPoById } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import {
  Check,
  Loader2,
  Package,
  Search,
  Warehouse
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
          setSelectedWarehouseId(String(tt.fromWarehouseId));
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
      const allEnough = inventoryResults.every(
        (r) => r.enough === "Đủ" || r.enough === true // Handle both potential return values
      );

      if (allEnough) {
        setLoading(true);
        if (type === "mo") {
          const mo = await getMoById(id, token);
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
                  warehouseId: parseInt(selectedWarehouseId),
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
                  warehouseId: parseInt(selectedWarehouseId),
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

  const breadcrumbItems = [
    { label: "Kiểm kê tồn kho", path: "" },
  ];

  return (
    <FormPageLayout breadcrumbItems={breadcrumbItems} backLink={-1}>
      <div className="space-y-6">
        {/* Header Section in content */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-3 mb-4">
            <Warehouse className="w-6 h-6 text-blue-600" />
            Kiểm tra tồn kho <span className="text-gray-400 font-normal text-base ml-auto">Mã: {id}</span>
          </h2>
        </div>

        <div className="bg-gray-50/50 rounded-lg border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label className="flex items-center text-gray-700">
                <Warehouse className="w-4 h-4 mr-2" />
                {type === "tt" ? 'Kho xuất (từ phiếu chuyển)' : 'Kho xuất'}
              </Label>

              {type === "tt" ? (
                <Input
                  readOnly
                  value={warehouses.find(
                    (w) => String(w.warehouseId) === String(selectedWarehouseId)
                  )
                    ? `${warehouses.find(
                      (w) =>
                        String(w.warehouseId) ===
                        String(selectedWarehouseId)
                    )?.warehouseCode
                    } - ${warehouses.find(
                      (w) =>
                        String(w.warehouseId) ===
                        String(selectedWarehouseId)
                    )?.warehouseName
                    }`
                    : "Không có kho"}
                  className="bg-white"
                />
              ) : (
                <Select
                  value={selectedWarehouseId}
                  onValueChange={setSelectedWarehouseId}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="-- Chọn kho --" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.warehouseId} value={String(wh.warehouseId)}>
                        {wh.warehouseCode} - {wh.warehouseName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button
              onClick={handleCheckInventory}
              disabled={!selectedWarehouseId || loading}
              className="min-w-[180px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Kiểm tra tồn kho
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Kết quả kiểm tra ({inventoryResults.length})</h3>
          </div>

          <div className="border rounded-md overflow-hidden">
            {inventoryResults.length === 0 ? (
              <div className="text-center py-12 bg-gray-50">
                <Package className="mx-auto mb-4 w-12 h-12 text-gray-300" />
                <p className="text-gray-500">
                  {selectedWarehouseId ? 'Nhấn "Kiểm tra tồn kho" để xem kết quả' : 'Vui lòng chọn kho xuất'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="h-10 px-4 py-2 text-left font-medium text-gray-500">Mã hàng hóa</th>
                      <th className="h-10 px-4 py-2 text-left font-medium text-gray-500">Tên hàng hóa</th>
                      <th className="h-10 px-4 py-2 text-right font-medium text-gray-500">Số lượng cần</th>
                      <th className="h-10 px-4 py-2 text-right font-medium text-gray-500">Tồn kho sẵn có</th>
                      <th className="h-10 px-4 py-2 text-center font-medium text-gray-500">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inventoryResults.map((result, index) => {
                      const key = `${result.itemId || result.supplierItemId}-${index}`;
                      return (
                        <tr key={key} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {type === "po" ? result.supplierItemCode : result.itemCode}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {type === "po" ? result.supplierItemName : result.itemName}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-600">
                            {result.enough === "Không có tồn kho" ? "-" : Number(result.quantityNeeded).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-green-600">
                            {result.enough === "Không có tồn kho" ? "-" : Number(result.available).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[result.enough] || "bg-gray-100 text-gray-700"}`}>
                              {statusLabels[result.enough] || result.enough}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {inventoryResults.length > 0 && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Check className="w-4 h-4" />
              Xác nhận
            </Button>
          </div>
        )}
      </div>
    </FormPageLayout>
  );
};

export default CheckInventory;
