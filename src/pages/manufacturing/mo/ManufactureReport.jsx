import IssueForecast from "@/components/inventory/IssueForecast";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { Combobox } from "@/components/ui/combobox";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  getManufactureReport,
  getMonthlyManufactureReport,
} from "@/services/manufacturing/MoService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ManufactureReport = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [type, setType] = useState("Tất cả");
  const [monthlyData, setMonthlyData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  };

  const getEndOfDay = (date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
  };

  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(new Date());

  const toLocalDateTimeString = (localDateTimeString) => {
    if (!localDateTimeString) return null;
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const formatDateLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Options cho combobox loại sản xuất
  const typeOptions = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Sản xuất đại trà", value: "Sản xuất đại trà" },
    { label: "Sản xuất thử nghiệm", value: "Sản xuất thử nghiệm" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthly = await getMonthlyManufactureReport(companyId, type, token);
        const detail = await getManufactureReport(
          {
            startTime: toLocalDateTimeString(startDate),
            endTime: toLocalDateTimeString(getEndOfDay(endDate)),
            type,
          },
          companyId,
          token
        );

        setMonthlyData(monthly);
        setTableData(detail);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, companyId, token, startDate, endDate]);

  const columns = [
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
      accessorKey: "totalQuantity",
      header: createSortableHeader("Tổng số lượng sản xuất"),
      cell: ({ getValue }) => <span className="font-semibold text-blue-600">{getValue() || 0}</span>
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Sản xuất / Báo cáo sản xuất"
      title="Báo cáo sản xuất"
      description="Thống kê tình hình sản xuất"
    >
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <DatePicker
              value={formatDateLocal(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              placeholder="Chọn ngày bắt đầu"
            />
          </div>
          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <DatePicker
              value={formatDateLocal(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              placeholder="Chọn ngày kết thúc"
            />
          </div>
          <div className="space-y-2">
            <Label>Loại sản xuất</Label>
            <Combobox
              options={typeOptions}
              value={type}
              onChange={(selected) => setType(selected?.value || "Tất cả")}
              placeholder="Chọn loại sản xuất"
              searchPlaceholder="Tìm loại..."
            />
          </div>
          <div />
        </div>

        <div className="flex justify-center mb-6 py-4 border-t border-gray-50">
          <IssueForecast
            data={monthlyData}
            metric="totalQuantity"
            label="Tổng số lượng hàng hóa sản xuất"
            color="#05518B"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        loading={loading}
        emptyMessage="Không có dữ liệu báo cáo"
        exportFileName="Bao_cao_san_xuat"
        exportMapper={(row = {}) => ({
          "Mã hàng hóa": row.itemCode || "",
          "Tên hàng hóa": row.itemName || "",
          "Tổng số lượng sản xuất": row.totalQuantity || 0,
        })}
      />
    </ListPageLayout>
  );
};

export default ManufactureReport;
