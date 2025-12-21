import { AddButton, EditButton } from "@/components/common/ActionButtons";
import QuickViewModal from "@/components/common/QuickViewModal";
import LineForm from "@/components/general/LineForm";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import {
  getAllLinesInCompany,
  updateLine,
} from "@/services/general/ManufactureLineService";
import toastrService from "@/services/toastrService";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LineInCompany = () => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchLines = async () => {
      setLoading(true);
      try {
        const result = await getAllLinesInCompany(companyId, token);
        setLines(result);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách dây chuyền!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchLines();
    }
  }, [companyId, token]);

  const columns = [
    {
      accessorKey: "lineCode",
      header: createSortableHeader("Mã dây chuyền"),
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
      accessorKey: "lineName",
      header: createSortableHeader("Tên dây chuyền"),
    },
    {
      accessorKey: "plantName",
      header: createSortableHeader("Tên xưởng"),
      cell: ({ getValue }) => getValue() || "---",
    },
    {
      accessorKey: "capacity",
      header: createSortableHeader("Công suất"),
      cell: ({ getValue }) => {
        const capacity = getValue();
        return capacity ? `${capacity}/h` : "---";
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLine(row.original);
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
        breadcrumbs="Dây chuyền sản xuất"
        title="Danh sách dây chuyền sản xuất"
        description="Quản lý thông tin dây chuyền sản xuất trong công ty"
        actions={
          <AddButton
            onClick={() => navigate("/create-line")}
            label="Thêm mới"
          />
        }
      >
        <DataTable
          columns={columns}
          data={lines}
          loading={loading}
          onRowClick={(line) => {
            setSelectedLine(line);
            setFormData(line);
            setEditMode(false);
            setModalOpen(true);
          }}
          emptyMessage="Chưa có dây chuyền nào"
          exportFileName="Danh_sach_day_chuyen"
          exportMapper={(row = {}) => ({
            "Mã dây chuyền": row.lineCode || "",
            "Tên dây chuyền": row.lineName || "",
            "Tên xưởng": row.plantName || "",
            "Công suất": row.capacity ? `${row.capacity}/h` : "",
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
        title={editMode ? "CHỈNH SỬA DÂY CHUYỀN" : "CHI TIẾT DÂY CHUYỀN"}
      >
        {selectedLine && (
          <div className="space-y-4">
            {!editMode ? (
              /* View Mode */
              <>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">
                      Mã dây chuyền:
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedLine.lineCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Tên dây chuyền:
                    </span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {selectedLine.lineName}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Xưởng:</span>
                    <span
                      className="ml-2 text-sm text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigate(`/plant/${selectedLine.plantId}`)}
                    >
                      {selectedLine.plantName || "---"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Công suất:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {selectedLine.capacity
                        ? `${selectedLine.capacity} sản phẩm/giờ`
                        : "---"}
                    </span>
                  </div>
                  {selectedLine.description && (
                    <div>
                      <span className="text-sm text-gray-500">Mô tả:</span>
                      <p className="mt-1 text-sm text-gray-700">
                        {selectedLine.description}
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
                <LineForm
                  line={formData}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  errors={errors}
                  readOnlyFields={{ lineCode: true }}
                />
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const {
                          lineId,
                          companyId,
                          plantId,
                          plantName,
                          lineCode,
                          ...payload
                        } = formData;
                        
                        // Ensure capacity is a number
                        if (payload.capacity !== undefined) {
                          payload.capacity = Number(payload.capacity);
                        }
                        
                        await updateLine(selectedLine.lineId, payload, token);
                        toastrService.success(
                          "Cập nhật dây chuyền thành công!"
                        );
                        setModalOpen(false);
                        setEditMode(false);
                        // Refresh data
                        const result = await getAllLinesInCompany(
                          companyId,
                          token
                        );
                        setLines(result);
                      } catch (error) {
                        toastrService.error(
                          error.response?.data?.message ||
                            "Lỗi khi cập nhật dây chuyền!"
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
                      setFormData(selectedLine);
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

export default LineInCompany;
