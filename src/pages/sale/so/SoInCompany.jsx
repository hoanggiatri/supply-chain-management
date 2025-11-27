import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllSosInCompany } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";

const SoInCompany = () => {
  const [sos, setSos] = useState([]);
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
    const fetchSos = async () => {
      try {
        const data = await getAllSosInCompany(companyId, token);
        setSos(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn bán hàng!"
        );
      }
    };
    fetchSos();
  }, [companyId, token]);

  const filteredSos =
    filterStatus === "Tất cả"
      ? sos
      : sos.filter((so) => so.status === filterStatus);

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
    { id: "soCode", label: "Mã đơn bán" },
    { id: "poCode", label: "Mã đơn mua" },
    { id: "customerCompanyCode", label: "Mã khách hàng" },
    { id: "customerCompanyName", label: "Tên khách hàng" },
    { id: "paymentMethod", label: "Phương thức thanh toán" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "status", label: "Trạng thái" },
  ];

  const statusLabels = {
    "Chờ xuất kho": "Chờ xuất kho",
    "Chờ vận chuyển": "Chờ vận chuyển",
    "Đang vận chuyển": "Đang vận chuyển",
    "Đã hoàn thành": "Đã hoàn thành",
  };

  const statusColorMap = {
    "Chờ xuất kho": "purple",
    "Chờ vận chuyển": "amber",
    "Đang vận chuyển": "blue",
    "Đã hoàn thành": "green",
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH ĐƠN BÁN HÀNG
          </Typography>

          <StatusSummaryCard
            data={sos}
            statusLabels={[
              "Tất cả",
              "Chờ xuất kho",
              "Chờ vận chuyển",
              "Đang vận chuyển",
              "Đã hoàn thành",
            ]}
            getStatus={(so) => so.status}
            statusColors={{
              "Tất cả": "#000",
              "Chờ xuất kho": "#9c27b0",
              "Chờ vận chuyển": "#ff9800",
              "Đang vận chuyển": "#2196f3",
              "Đã hoàn thành": "#4caf50",
            }}
            onSelectStatus={setFilterStatus}
            selectedStatus={filterStatus}
          />

          <DataTable
            rows={filteredSos}
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
            renderRow={(so, index, page, rowsPerPage, renderStatusCell) => {
              const isLast = index === filteredSos.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={so.soId}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/so/${so.soId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {so.soCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {so.poCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {so.customerCompanyCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {so.customerCompanyName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {so.paymentMethod || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {so.createdBy || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {so.createdOn
                        ? new Date(so.createdOn).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[so.status] || so.status || "",
                      statusColorMap[so.status]
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

export default SoInCompany;
