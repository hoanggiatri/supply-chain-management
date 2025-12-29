import IssueForecast from "@/components/inventory/IssueForecast";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import {
  getIssueForecast,
  getIssueReport,
  getMonthlyIssueReport,
} from "@services/inventory/IssueTicketService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const IssueReport = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [issueType, setIssueType] = useState("Tất cả");
  const [warehouseId, setWarehouseId] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllWarehousesInCompany(companyId, token);
        setWarehouses(data);

        const monthly = await getMonthlyIssueReport(
          companyId,
          issueType,
          warehouseId,
          token
        );
        const detail = await getIssueReport(
          {
            startTime: toLocalDateTimeString(startDate),
            endTime: toLocalDateTimeString(getEndOfDay(endDate)),
            issueType,
            warehouseId,
          },
          companyId,
          token
        );
        const forecast = await getIssueForecast(
          companyId,
          issueType,
          warehouseId,
          token
        );

        setMonthlyData(monthly);
        setForecastData(forecast);
        setTableData(detail);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [issueType, warehouseId, companyId, token, startDate, endDate]);

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
      header: createSortableHeader("Tổng số lượng xuất kho"),
      cell: ({ getValue }) => <span className="font-semibold text-blue-600">{getValue() || 0}</span>
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Kho / Báo cáo xuất kho"
      title="Báo cáo xuất kho"
      description="Thống kê và dự báo tình hình xuất kho"
    >
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <Input
              type="date"
              value={formatDateLocal(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <Input
              type="date"
              value={formatDateLocal(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Loại xuất kho</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Chọn loại xuất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tất cả">Tất cả</SelectItem>
                <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                <SelectItem value="Bán hàng">Bán hàng</SelectItem>
                <SelectItem value="Chuyển kho">Chuyển kho</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Kho</Label>
            <Select value={String(warehouseId)} onValueChange={(val) => setWarehouseId(Number(val))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Chọn kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w.warehouseId} value={String(w.warehouseId)}>
                    {w.warehouseName} ({w.warehouseCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center mb-6 py-4 border-t border-gray-50">
          <IssueForecast
            data={monthlyData}
            forecastData={forecastData}
            metric="totalQuantity"
            label="Tổng số lượng hàng hóa xuất kho"
            color="#05518B"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        loading={loading}
        emptyMessage="Không có dữ liệu báo cáo"
      />
    </ListPageLayout>
  );
};

export default IssueReport;
