import React, { useState } from "react";
import useExcelUpload from "@/hooks/useExcelUpload";
import { useNavigate } from "react-router-dom";
import { createItem } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { exportToExcel } from "@/lib/utils";
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

  const handleDownloadTemplate = () => {
    const template = [
      {
        "Tên hàng hóa": "Thép tấm SS400",
        "Loại hàng hóa": "Nguyên vật liệu",
        "Đơn vị tính": "Tấm",
        "Giá nhập": 100000,
        "Giá xuất": 120000,
        "Thông số kỹ thuật": "2mm x 1m x 2m",
        "Mô tả": "Thép cán nóng tiêu chuẩn SS400",
        "Hàng bán": "Có",
      },
    ];

    exportToExcel(template, "Mau_Import_Hang_Hoa");
  };

  const toBoolean = (value) => {
    if (value === true || value === 1 || value === "1") return true;
    if (typeof value === "string") {
      const lower = value.trim().toLowerCase();
      return lower === "có" || lower === "yes" || lower === "true";
    }
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Chuẩn hóa và bỏ qua các dòng thiếu tên hàng
      const normalized = excelData.map((item) => ({
        ...item,
        itemName: (item.itemName || "").toString().trim(),
        itemType: (item.itemType || "").toString().trim(),
        uom: (item.uom || "").toString().trim(),
      }));

      const validItems = normalized.filter((item) => item.itemName);
      const skippedCount = normalized.length - validItems.length;

      if (validItems.length === 0) {
        toastrService.error("Không có hàng hóa hợp lệ (thiếu tên hàng).");
        return;
      }

      const results = await Promise.allSettled(
        validItems.map((item) => {
          const payload = {
            itemName: item.itemName,
            itemType: item.itemType,
            uom: item.uom,
            importPrice: item.importPrice || 0,
            exportPrice: item.exportPrice || 0,
            technicalSpecifications: item.technicalSpecifications || "",
            description: item.description || "",
            isSellable: toBoolean(item.isSellable),
          };

          return createItem(companyId, payload, token);
        })
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failResults = results.filter((r) => r.status === "rejected");

      if (successCount > 0) {
        toastrService.success(
          `Đã thêm ${successCount}/${validItems.length} hàng hóa thành công.${
            skippedCount > 0 ? ` Bỏ qua ${skippedCount} dòng thiếu tên.` : ""
          }`
        );
      }

      if (failResults.length > 0) {
        const firstError =
          failResults[0]?.reason?.response?.data?.message ||
          failResults[0]?.reason?.message ||
          "Không rõ lỗi";
        toastrService.error(
          `Thất bại ${failResults.length}/${validItems.length} hàng hóa. Lý do: ${firstError}`
        );
      }

      if (failResults.length === 0) {
        navigate("/items");
      }
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
        <div className="flex items-center gap-4 flex-wrap">
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
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={handleDownloadTemplate}
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Tải file mẫu
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
