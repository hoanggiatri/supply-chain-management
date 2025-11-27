import { useEffect, useState } from "react";
import {
  getReceiveReport,
  getMonthlyReceiveReport,
} from "@services/inventory/ReceiveTicketService";
import {
  Card,
  CardBody,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import DataTable from "@/components/content-components/DataTable";
import MonthlyBarChart from "@/components/content-components/MonthlyBarChart";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import dayjs from "dayjs";
import BackButton from "@/components/common/BackButton";

const ReceiveReport = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [receiveType, setReceiveType] = useState("Tất cả");
  const [warehouseId, setWarehouseId] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

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
    };

    fetchData();
  }, [receiveType, warehouseId, companyId, token, startDate, endDate]);

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "totalQuantity", label: "Tổng số lượng nhập kho" },
  ];

  const filteredItems = tableData.filter(
    (item) =>
      (item.itemCode?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (item.itemName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  if (monthlyData.length === 0 && tableData.length === 0) {
    return <LoadingPaper title="BÁO CÁO NHẬP KHO" />;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              BÁO CÁO NHẬP KHO
            </Typography>
            <BackButton to="/receive-tickets" label="Quay lại danh sách" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              label="Từ ngày"
              type="date"
              value={formatDateLocal(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              color="blue"
              className="w-full placeholder:opacity-100"
            />
            <Input
              label="Đến ngày"
              type="date"
              value={formatDateLocal(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              color="blue"
              className="w-full placeholder:opacity-100"
            />
            <Select
              label="Loại nhập kho"
              value={receiveType}
              onChange={(val) => setReceiveType(val)}
              color="blue"
              className="w-full"
            >
              <Option value="Tất cả">Tất cả</Option>
              <Option value="Sản xuất">Sản xuất</Option>
              <Option value="Mua hàng">Mua hàng</Option>
              <Option value="Chuyển kho">Chuyển kho</Option>
            </Select>
            <Select
              label="Kho"
              value={warehouseId}
              onChange={(val) => setWarehouseId(Number(val))}
              color="blue"
              className="w-full"
            >
              <Option value={0}>Tất cả</Option>
              {warehouses.map((w) => (
                <Option key={w.warehouseId} value={w.warehouseId}>
                  {w.warehouseName}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex justify-center mb-6">
            <MonthlyBarChart
              data={monthlyData}
              metric="totalQuantity"
              label="Tổng số lượng hàng hóa nhập kho"
              color="#05518B"
            />
          </div>

          <DataTable
            rows={filteredItems}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            search={search}
            setSearch={setSearch}
            renderRow={(item, index) => {
              const isLast = index === filteredItems.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={item.itemId}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {item.itemCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {item.itemName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {item.totalQuantity || ""}
                    </Typography>
                  </td>
                </tr>
              );
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ReceiveReport;
