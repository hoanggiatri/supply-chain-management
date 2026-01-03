import IssueForecast from "@/components/inventory/IssueForecast";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { Combobox } from "@/components/ui/combobox";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
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

  // Options cho selectbox loại nhập kho
  const receiveTypeOptions = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Sản xuất", value: "Sản xuất" },
    { label: "Mua hàng", value: "Mua hàng" },
    { label: "Chuyển kho", value: "Chuyển kho" },
  ];

  // Options cho selectbox kho
  const warehouseOptions = [
    { label: "Tất cả", value: 0 },
    ...warehouses.map((w) => ({
      label: `${w.warehouseCode} - ${w.warehouseName}`,
      value: w.warehouseId,
    })),
  ];

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
            <Label>Loại nhập kho</Label>
            <Combobox
              options={receiveTypeOptions}
              value={receiveType}
              onChange={(selected) => setReceiveType(selected?.value || "Tất cả")}
              placeholder="Chọn loại nhập"
              searchPlaceholder="Tìm loại nhập..."
            />
          </div>
          <div className="space-y-2">
            <Label>Kho</Label>
            <Combobox
              options={warehouseOptions}
              value={warehouseId}
              onChange={(selected) => setWarehouseId(selected?.value ?? 0)}
              placeholder="Chọn kho"
              searchPlaceholder="Tìm kho..."
            />
          </div>
        </div>

        <div className="flex justify-center mb-6 py-4 border-t border-gray-50">
          <IssueForecast
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
