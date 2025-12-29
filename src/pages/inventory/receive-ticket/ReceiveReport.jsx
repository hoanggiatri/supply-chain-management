import MonthlyBarChart from "@/components/content-components/MonthlyBarChart";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import {
  getMonthlyReceiveReport,
  getReceiveReport,
} from "@/services/inventory/ReceiveTicketService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const ReceiveReport = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [receiveType, setReceiveType] = useState("Tất cả");
  const [warehouseId, setWarehouseId] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
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

        const monthly = await getMonthlyReceiveReport(
          companyId,
          receiveType,
          warehouseId,
          token
        );
        const detail = await getReceiveReport(
          {
            startTime: toLocalDateTimeString(startDate),
            endTime: toLocalDateTimeString(getEndOfDay(endDate)),
            receiveType,
            warehouseId,
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
  }, [receiveType, warehouseId, companyId, token, startDate, endDate]);

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
      header: createSortableHeader("Tổng số lượng nhập kho"),
      cell: ({ getValue }) => <span className="font-semibold text-blue-600">{getValue() || 0}</span>
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Kho / Báo cáo nhập kho"
      title="Báo cáo nhập kho"
      description="Thống kê và dự báo tình hình nhập kho"
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
            <Label>Loại nhập kho</Label>
            <Select value={receiveType} onValueChange={setReceiveType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Chọn loại nhập" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tất cả">Tất cả</SelectItem>
                <SelectItem value="Sản xuất">Sản xuất</SelectItem>
                <SelectItem value="Mua hàng">Mua hàng</SelectItem>
                <SelectItem value="Chuyển kho">Chuyển kho</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Kho</Label>
            <Select value={String(warehouseId)} onValueChange={(val) => setWarehouseId(val === "0" ? 0 : Number(val))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Chọn kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w.warehouseId} value={String(w.warehouseId)}>
                    {w.warehouseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center mb-6 py-4 border-t border-gray-50">
          <MonthlyBarChart
            data={monthlyData}
            metric="totalQuantity"
            label="Tổng số lượng hàng hóa nhập kho"
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

export default ReceiveReport;
