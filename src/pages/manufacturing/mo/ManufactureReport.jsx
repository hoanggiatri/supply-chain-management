import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import DataTable from "@/components/content-components/DataTable";
import MonthlyBarChart from "@/components/content-components/MonthlyBarChart";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import {
  getManufactureReport,
  getMonthlyManufactureReport,
} from "@/services/manufacturing/MoService";
import dayjs from "dayjs";

const ManufactureReport = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [type, setType] = useState("Tất cả");
  const [monthlyData, setMonthlyData] = useState([]);
  const [tableData, setTableData] = useState([]);

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
    };

    fetchData();
  }, [type, companyId, token, startDate, endDate]);

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
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            BÁO CÁO NHẬP KHO
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              label="Từ ngày"
              type="date"
              value={formatDateLocal(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              color="blue"
            />
            <Input
              label="Đến ngày"
              type="date"
              value={formatDateLocal(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              color="blue"
            />
            <Select
              label="Loại sản xuất"
              color="blue"
              value={type}
              onChange={(val) => setType(val)}
            >
              <Option value="Tất cả">Tất cả</Option>
              <Option value="Sản xuất đại trà">Sản xuất đại trà</Option>
              <Option value="Sản xuất thử nghiệm">Sản xuất thử nghiệm</Option>
            </Select>
          </div>

          <div className="flex justify-center mb-6">
            <MonthlyBarChart
              data={monthlyData}
              metric="totalQuantity"
              label="Tổng số lượng hàng hóa sản xuất"
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
                      {item.itemCode}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {item.itemName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {item.totalQuantity}
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

export default ManufactureReport;
