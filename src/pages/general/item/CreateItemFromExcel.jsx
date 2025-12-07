import React, { useState } from "react";
import useExcelUpload from "@/hooks/useExcelUpload";
import { useNavigate } from "react-router-dom";
import { createItem } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { FileSpreadsheet, Upload, Save, X } from "lucide-react";

const CreateItemFromExcel = () => {
  const navigate = useNavigate();
  const { excelData: initialExcelData, handleExcelUpload } = useExcelUpload();
  const companyId = localStorage.getItem("companyId");
  const token = localStorage.getItem("token");
  const [excelData, setExcelData] = useState(initialExcelData || []);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
    },
    {
      accessorKey: "itemType",
      header: createSortableHeader("Loại hàng hóa"),
    },
    {
      accessorKey: "uom",
      header: createSortableHeader("Đơn vị tính"),
    },
    {
      accessorKey: "technicalSpecifications",
      header: "Thông số kỹ thuật",
    },
    {
      accessorKey: "importPrice",
      header: createSortableHeader("Giá nhập"),
    },
    {
      accessorKey: "exportPrice",
      header: createSortableHeader("Giá xuất"),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    {
      accessorKey: "isSellable",
      header: "Hàng bán",
      cell: ({ getValue }) => {
        const val = getValue();
        return val === 1 || val === "1" || val === true ? "Có" : "Không";
      },
    },
  ];

  const handleDataLoaded = (data) => {
    console.log("Dữ liệu đã được tải lên:", data);

    const mappedData = data.map((item) => ({
      itemName: item["Tên hàng hóa"],
      itemType: item["Loại hàng hóa"],
      uom: item["Đơn vị tính"],
      importPrice: item["Giá nhập"],
      exportPrice: item["Giá xuất"],
      technicalSpecifications: item["Thông số kỹ thuật"],
      description: item["Mô tả"],
      isSellable: item["Hàng bán"],
    }));

    setExcelData(mappedData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      for (const item of excelData) {
        const newItemData = {
          itemName: item.itemName || "",
          itemType: item.itemType || "",
          uom: item.uom || "",
          importPrice: item.importPrice || 0,
          exportPrice: item.exportPrice || 0,
          technicalSpecifications: item.technicalSpecifications || "",
          description: item.description || "",
          isSellable: item.isSellable || false,
        };

        console.log("Thêm item:", newItemData);

        await createItem(companyId, newItemData, token);
      }

      toastrService.success("Thêm tất cả hàng hóa thành công!");
      navigate("/items");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi thêm hàng hóa!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách hàng hóa", path: "/items" },
        { label: "Nhập từ Excel" },
      ]}
      backLink="/items"
      backLabel="Quay lại danh sách"
    >
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              document.getElementById("excel-upload-input").click()
            }
          >
            <Upload className="w-4 h-4" />
            Tải file Excel
          </Button>
          <input
            id="excel-upload-input"
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setFileName(e.target.files[0].name);
                handleExcelUpload(e, handleDataLoaded);
              }
            }}
          />
          {fileName && (
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              {fileName}
            </span>
          )}
        </div>
      </div>

      {excelData.length > 0 && (
        <div className="space-y-6">
          <div className="border rounded-md">
            <DataTable columns={columns} data={excelData} loading={false} />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => navigate("/items")}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Đang xử lý..." : "Thêm tất cả"}
            </Button>
          </div>
        </div>
      )}
    </FormPageLayout>
  );
};

export default CreateItemFromExcel;
