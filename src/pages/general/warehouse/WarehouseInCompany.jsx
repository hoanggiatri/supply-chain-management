import { AddButton, EditButton } from "@/components/common/ActionButtons";
import QuickViewModal from "@/components/common/QuickViewModal";
import WarehouseForm from "@/components/general/WarehouseForm";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import {
  getAllWarehousesInCompany,
  updateWarehouse,
} from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WarehouseInCompany = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      try {
        const result = await getAllWarehousesInCompany(companyId, token);
        setWarehouses(result);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách kho!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchWarehouses();
    }
  }, [companyId, token]);

  const columns = [
    {
      accessorKey: "warehouseCode",
      header: createSortableHeader("Mã kho"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "warehouseName",
      header: createSortableHeader("Tên kho"),
    },
    {
      accessorKey: "description",
      header: createSortableHeader("Mô tả"),
    },
    {
      accessorKey: "maxCapacity",
      header: createSortableHeader("Sức chứa tối đa (m³)"),
    },
    {
      accessorKey: "warehouseType",
      header: createSortableHeader("Loại kho"),
    },
    {
      accessorKey: "status",
      header: createSortableHeader("Trạng thái"),
      cell: ({ getValue }) => {
        const status = getValue();
        const statusLabels = {
          active: "Đang hoạt động",
          inactive: "Ngừng hoạt động",
          closed: "Đã đóng",
        };
        const statusColors = {
          active: "bg-green-100 text-green-700",
          inactive: "bg-amber-100 text-amber-700",
          closed: "bg-red-100 text-red-700",
        };

        const label = statusLabels[status] || status;
        const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

        return (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedWarehouse(row.original);
            setFormData(row.original);
            setEditMode(true);
            setModalOpen(true);
          }}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Chỉnh sửa"
        >
          <PencilIcon className="h-5 w-5 text-green-600" />
        </button>
      ),
    },
  ];

  return (
    <>
      <ListPageLayout
        breadcrumbs="Kho hàng"
        title="Danh sách kho hàng"
        description="Quản lý các kho hàng trong hệ thống"
        actions={
          <AddButton
            onClick={() => navigate("/create-warehouse")}
            label="Thêm mới"
          />
        }
      >
        <DataTable
          columns={columns}
          data={warehouses}
          loading={loading}
          onRowClick={(row) => {
            setSelectedWarehouse(row);
            setFormData(row);
            setEditMode(false);
            setModalOpen(true);
          }}
        exportFileName="Danh_sach_kho"
        exportMapper={(row = {}) => ({
          "Mã kho": row.warehouseCode || "",
          "Tên kho": row.warehouseName || "",
          "Mô tả": row.description || "",
          "Sức chứa tối đa (m³)": row.maxCapacity ?? "",
          "Loại kho": row.warehouseType || "",
          "Trạng thái":
            row.status === "active"
              ? "Đang hoạt động"
              : row.status === "inactive"
              ? "Ngừng hoạt động"
              : row.status === "closed"
              ? "Đã đóng"
              : row.status || "",
        })}
        />
      </ListPageLayout>

      {/* Modal */}
      <QuickViewModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditMode(false);
          setErrors({});
        }}
        title={editMode ? "CHỈNH SỬA KHO" : "CHI TIẾT KHO"}
      >
        {selectedWarehouse && (
          <div className="space-y-4">
            {!editMode ? (
              /* View Mode */
              <>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Mã kho:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedWarehouse.warehouseCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tên kho:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {selectedWarehouse.warehouseName}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Loại kho:</span>
                    <span className="ml-2 text-sm text-gray-700">
                      {selectedWarehouse.warehouseType || "---"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Sức chứa:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {selectedWarehouse.maxCapacity
                        ? `${selectedWarehouse.maxCapacity} m³`
                        : "---"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Trạng thái:</span>
                    <span className="ml-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                          selectedWarehouse.status === "active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }`}
                      >
                        {selectedWarehouse.status === "active"
                          ? "Hoạt động"
                          : "Ngừng hoạt động"}
                      </span>
                    </span>
                  </div>
                  {selectedWarehouse.description && (
                    <div>
                      <span className="text-sm text-gray-500">Mô tả:</span>
                      <p className="mt-1 text-sm text-gray-700">
                        {selectedWarehouse.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <EditButton
                    onClick={() => setEditMode(true)}
                    label="Chỉnh sửa"
                    className="flex-1 justify-center"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Đóng
                  </Button>
                </div>
              </>
            ) : (
              /* Edit Mode */
              <>
                <WarehouseForm
                  warehouse={formData}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  errors={errors}
                  readOnlyFields={{ warehouseCode: true }}
                />
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const {
                          warehouseId,
                          companyId,
                          warehouseCode,
                          ...payload
                        } = formData;
                        
                        // Ensure maxCapacity is a number
                        if (payload.maxCapacity !== undefined) {
                          payload.maxCapacity = Number(payload.maxCapacity);
                        }
                        
                        await updateWarehouse(
                          selectedWarehouse.warehouseId,
                          payload,
                          token
                        );
                        toastrService.success("Cập nhật kho thành công!");
                        setModalOpen(false);
                        setEditMode(false);
                        // Refresh data
                        const result = await getAllWarehousesInCompany(
                          companyId,
                          token
                        );
                        setWarehouses(result);
                      } catch (error) {
                        toastrService.error(
                          error.response?.data?.message ||
                            "Lỗi khi cập nhật kho!"
                        );
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Đang lưu..." : "Lưu"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      setFormData(selectedWarehouse);
                      setErrors({});
                    }}
                    disabled={saving}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </QuickViewModal>
    </>
  );
};

export default WarehouseInCompany;
