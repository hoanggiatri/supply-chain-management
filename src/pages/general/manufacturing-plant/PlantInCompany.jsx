import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllPlantsInCompany,
  updatePlant,
} from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { AddButton } from "@/components/common/ActionButtons";
import ListPageLayout from "@/components/layout/ListPageLayout";
import QuickViewModal from "@/components/common/QuickViewModal";
import PlantForm from "@/components/general/PlantForm";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Edit2, X, Save } from "lucide-react";

const PlantInCompany = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const result = await getAllPlantsInCompany(companyId, token);
        setPlants(result);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách xưởng!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchPlants();
    }
  }, [companyId, token]);

  const columns = [
    {
      accessorKey: "plantCode",
      header: createSortableHeader("Mã xưởng"),
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
      accessorKey: "plantName",
      header: createSortableHeader("Tên xưởng"),
    },
    {
      accessorKey: "description",
      header: createSortableHeader("Mô tả"),
      cell: ({ getValue }) => getValue() || "-",
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPlant(row.original);
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
        breadcrumbs="Xưởng sản xuất"
        title="Danh sách xưởng sản xuất"
        description="Quản lý các xưởng sản xuất trong hệ thống"
        actions={
          <AddButton
            onClick={() => navigate("/create-plant")}
            label="Thêm mới"
          />
        }
      >
        <DataTable
          columns={columns}
          data={plants}
          loading={loading}
          onRowClick={(row) => {
            setSelectedPlant(row);
            setFormData(row);
            setEditMode(false);
            setModalOpen(true);
          }}
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
        title={editMode ? "CHỈNH SỬA XƯỞNG" : "CHI TIẾT XƯỞNG"}
      >
        {selectedPlant && (
          <div className="space-y-4">
            {!editMode ? (
              /* View Mode */
              <>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Mã xưởng:</span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedPlant.plantCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tên xưởng:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {selectedPlant.plantName}
                    </span>
                  </div>
                  {selectedPlant.description && (
                    <div>
                      <span className="text-sm text-gray-500">Mô tả:</span>
                      <p className="mt-1 text-sm text-gray-700">
                        {selectedPlant.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setEditMode(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                  </Button>
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
                <PlantForm
                  plant={formData}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  errors={errors}
                  readOnlyFields={{ plantCode: true }}
                />
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const { plantId, companyId, plantCode, ...payload } =
                          formData;
                        await updatePlant(
                          selectedPlant.plantId,
                          payload,
                          token
                        );
                        toastrService.success("Cập nhật xưởng thành công!");
                        setModalOpen(false);
                        setEditMode(false);
                        // Refresh data
                        const result = await getAllPlantsInCompany(
                          companyId,
                          token
                        );
                        setPlants(result);
                      } catch (error) {
                        toastrService.error(
                          error.response?.data?.message ||
                            "Lỗi khi cập nhật xưởng!"
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
                      setFormData(selectedPlant);
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

export default PlantInCompany;
