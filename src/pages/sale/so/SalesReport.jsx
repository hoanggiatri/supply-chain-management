import LoadingPaper from "@/components/content-components/LoadingPaper";
import IssueForecast from "@/components/inventory/IssueForecast";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { Combobox } from "@/components/ui/combobox";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import {
  getMonthlySalesReport,
  getSalesReport,
} from "@/services/sale/SoService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const SalesReport = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [monthlyData, setMonthlyData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [chartMetric, setChartMetric] = useState("totalQuantity");
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

  // Options cho combobox loại biểu đồ
  const chartMetricOptions = [
    { label: "Tổng số lượng hàng hóa", value: "totalQuantity" },
    { label: "Số đơn bán hàng", value: "totalOrder" },
    { label: "Tổng giá trị đơn hàng", value: "totalAmount" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthly = await getMonthlySalesReport(companyId, token);
        const detail = await getSalesReport(
          {
            startDate: toLocalDateTimeString(startDate),
            endDate: toLocalDateTimeString(getEndOfDay(endDate)),
          },
          companyId,
          token
        );

        setMonthlyData(monthly);
        setTableData(detail);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, token, startDate, endDate]);

  const columns = [
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
    },
    {
      accessorKey: "totalQuantity",
      header: createSortableHeader("Tổng số lượng bán"),
    },
  ];

  const metricLabels = {
    totalQuantity: { label: "Tổng số lượng hàng hóa", color: "#05518B" },
    totalOrder: { label: "Số đơn bán hàng", color: "#FAAD14" },
    totalAmount: { label: "Tổng giá trị đơn hàng", color: "#389E0D" },
  };

  if (monthlyData.length === 0 && tableData.length === 0 && loading) {
    return <LoadingPaper title="BÁO CÁO BÁN HÀNG" />;
  }

  return (
    <ListPageLayout
      breadcrumbs="Báo cáo"
      title="Báo cáo bán hàng"
    >
      {/* Filters */}
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
        <div />
        <div className="space-y-2">
          <Label>Loại biểu đồ</Label>
          <Combobox
            options={chartMetricOptions}
            value={chartMetric}
            onChange={(selected) => setChartMetric(selected?.value || "totalQuantity")}
            placeholder="Chọn loại biểu đồ"
            searchPlaceholder="Tìm loại..."
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-center mb-8">
        <IssueForecast
          data={monthlyData}
          metric={chartMetric}
          label={metricLabels[chartMetric].label}
          color={metricLabels[chartMetric].color}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={tableData}
        loading={loading}
        exportFileName="Bao_cao_ban_hang"
        exportMapper={(row = {}) => ({
          "Mã hàng hóa": row.itemCode || "",
          "Tên hàng hóa": row.itemName || "",
          "Tổng số lượng bán": row.totalQuantity || 0,
        })}
      />
    </ListPageLayout>
  );
};

export default SalesReport;
