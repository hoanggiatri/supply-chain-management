import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import DataTable from "@components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllTransferTicketsInCompany } from "@/services/inventory/TransferTicketService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const TransferTicketInCompany = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllTransferTicketsInCompany(companyId, token);
        setTickets(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy danh sách phiếu chuyển kho!"
        );
      }
    };

    fetchTickets();
  }, [companyId, token]);

  const filteredTickets =
    !filterStatus || filterStatus === "Tất cả"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filterStatus);

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
    { id: "ticketCode", label: "Mã phiếu" },
    { id: "fromWarehouseCode", label: "Mã kho xuất" },
    { id: "fromWarehouseName", label: "Tên kho xuất" },
    { id: "toWarehouseCode", label: "Mã kho nhập" },
    { id: "toWarehouseName", label: "Tên kho nhập" },
    { id: "reason", label: "Lý do" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật" },
    { id: "status", label: "Trạng thái" },
  ];

  const statusLabels = {
    "Chờ xác nhận": "Chờ xác nhận",
    "Chờ xuất kho": "Chờ xuất kho",
    "Chờ nhập kho": "Chờ nhập kho",
    "Đã hoàn thành": "Đã hoàn thành",
    "Đã hủy": "Đã hủy",
  };

  const statusColorMap = {
    "Chờ xác nhận": "purple",
    "Chờ xuất kho": "blue",
    "Chờ nhập kho": "amber",
    "Đã hoàn thành": "green",
    "Đã hủy": "red",
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              DANH SÁCH PHIẾU CHUYỂN KHO
            </Typography>
            <Button
              {...getButtonProps("primary")}
              onClick={() => navigate("/create-transfer-ticket")}
            >
              Thêm mới
            </Button>
          </div>

          <StatusSummaryCard
            data={tickets}
            statusLabels={[
              "Tất cả",
              "Chờ xác nhận",
              "Chờ xuất kho",
              "Chờ nhập kho",
              "Đã hoàn thành",
              "Đã hủy",
            ]}
            getStatus={(ticket) => ticket.status}
            statusColors={{
              "Tất cả": "#000",
              "Chờ xác nhận": "#9c27b0",
              "Chờ xuất kho": "#2196f3",
              "Chờ nhập kho": "#ff9800",
              "Đã hoàn thành": "#4caf50",
              "Đã hủy": "#f44336",
            }}
            onSelectStatus={(status) => setFilterStatus(status)}
            selectedStatus={filterStatus}
          />

          <DataTable
            rows={filteredTickets}
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
            renderRow={(ticket, index, page, rowsPerPage, renderStatusCell) => {
              const isLast = index === filteredTickets.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={ticket.ticketCode}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/transfer-ticket/${ticket.ticketId}`)
                  }
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.ticketCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.fromWarehouseCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.fromWarehouseName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.toWarehouseCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.toWarehouseName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.reason || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.createdBy || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.createdOn
                        ? new Date(ticket.createdOn).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ticket.lastUpdatedOn
                        ? new Date(ticket.lastUpdatedOn).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[ticket.status] || ticket.status || "",
                      statusColorMap[ticket.status]
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

export default TransferTicketInCompany;
