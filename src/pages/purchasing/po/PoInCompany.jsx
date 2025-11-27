import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllPosInCompany } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";

const PoInCompany = () => {
  const [pos, setPos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPos = async () => {
      try {
        const data = await getAllPosInCompany(companyId, token);
        setPos(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn mua hàng!"
        );
      }
    };
    fetchPos();
  }, [companyId, token]);

  const filteredPos =
    filterStatus === "Tất cả"
      ? pos
      : pos.filter((po) => po.status === filterStatus);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const columns = [
    { id: "poCode", label: "Mã đơn hàng" },
    { id: "quotationCode", label: "Mã báo giá" },
    { id: "supplierCompanyCode", label: "Mã NCC" },
    { id: "supplierCompanyName", label: "Tên NCC" },
    { id: "paymentMethod", label: "Phương thức thanh toán" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "status", label: "Trạng thái" },
  ];

  const statusLabels = {
    "Chờ xác nhận": "Chờ xác nhận",
    "Đã xác nhận": "Đã xác nhận",
    "Đang vận chuyển": "Đang vận chuyển",
    "Chờ nhập kho": "Chờ nhập kho",
    "Đã hoàn thành": "Đã hoàn thành",
    "Đã hủy": "Đã hủy",
  };

  const statusColorMap = {
    "Chờ xác nhận": "purple",
    "Đã xác nhận": "blue",
    "Đang vận chuyển": "cyan",
    "Chờ nhập kho": "amber",
    "Đã hoàn thành": "green",
    "Đã hủy": "red",
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH ĐƠN MUA HÀNG
          </Typography>

          <StatusSummaryCard
            data={pos}
            statusLabels={[
              "Tất cả",
              "Chờ xác nhận",
              "Đã xác nhận",
              "Đang vận chuyển",
              "Chờ nhập kho",
              "Đã hoàn thành",
              "Đã hủy",
            ]}
            getStatus={(po) => po.status}
            statusColors={{
              "Tất cả": "#000",
              "Chờ xác nhận": "#9c27b0",
              "Đã xác nhận": "#2196f3",
              "Đang vận chuyển": "#00bcd4",
              "Chờ nhập kho": "#ff9800",
              "Đã hoàn thành": "#4caf50",
              "Đã hủy": "#f44336",
            }}
            onSelectStatus={setFilterStatus}
            selectedStatus={filterStatus}
          />

          <DataTable
            rows={filteredPos}
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
            statusColumn="status"
            statusColors={statusColorMap}
            renderRow={(po, index, page, rowsPerPage, renderStatusCell) => {
              const isLast = index === filteredPos.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={po.poId}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/po/${po.poId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {po.poCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {po.quotationCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {po.supplierCompanyCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {po.supplierCompanyName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {po.paymentMethod || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {po.createdBy || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {po.createdOn
                        ? new Date(po.createdOn).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[po.status] || po.status || "",
                      statusColorMap[po.status]
                    )}
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

export default PoInCompany;
