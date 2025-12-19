import { AddButton } from "@/components/common/ActionButtons";
import StatusSummaryCard from "@/components/common/StatusSummaryCard";
import { createSortableHeader, createStatusBadge, DataTable } from "@/components/ui/data-table";
import { getAllTransferTicketsInCompany } from "@/services/inventory/TransferTicketService";
import toastrService from "@/services/toastrService";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const getTransferTicketColumns = () => [
    {
      accessorKey: "ticketCode",
      header: createSortableHeader("Mã phiếu"),
      cell: ({ getValue }) => <span className="font-medium text-blue-600">{getValue() || ""}</span>
    },
    {
      accessorKey: "fromWarehouseCode",
      header: createSortableHeader("Mã kho xuất"),
      cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
      accessorKey: "fromWarehouseName",
      header: createSortableHeader("Tên kho xuất"),
      cell: ({ getValue }) => <span>{getValue() || ""}</span>
    },
    {
      accessorKey: "toWarehouseCode",
      header: createSortableHeader("Mã kho nhập"),
      cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
      accessorKey: "toWarehouseName",
      header: createSortableHeader("Tên kho nhập"),
      cell: ({ getValue }) => <span>{getValue() || ""}</span>
    },
    {
      accessorKey: "reason",
      header: createSortableHeader("Lý do"),
      cell: ({ getValue }) => <span className="truncate max-w-[150px] block" title={getValue()}>{getValue() || ""}</span>
    },
    {
      accessorKey: "createdBy",
      header: createSortableHeader("Người tạo"),
      cell: ({ getValue }) => <span>{getValue() || ""}</span>
    },
    {
      accessorKey: "createdOn",
      header: createSortableHeader("Ngày tạo"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString() : "";
      },
    },
    {
      accessorKey: "lastUpdatedOn",
      header: createSortableHeader("Cập nhật"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString() : "";
      },
    },
    {
      accessorKey: "status",
      header: createSortableHeader("Trạng thái"),
      cell: createStatusBadge({
        "Chờ xác nhận": "bg-purple-100 text-purple-800",
        "Chờ xuất kho": "bg-blue-100 text-blue-800",
        "Chờ nhập kho": "bg-orange-100 text-orange-800",
        "Đã hoàn thành": "bg-green-100 text-green-800",
        "Đã hủy": "bg-red-100 text-red-800"
      })
    },
  ];

  const columns = getTransferTicketColumns();

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              DANH SÁCH PHIẾU CHUYỂN KHO
            </Typography>
            <AddButton
              onClick={() => navigate("/create-transfer-ticket")}
              label="Thêm mới"
            />
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
            columns={columns}
            data={filteredTickets}
            emptyMessage="Chưa có phiếu chuyển kho nào"
            onRowClick={(ticket) => navigate(`/transfer-ticket/${ticket.ticketId}`)}
            defaultSorting={[{ id: "createdOn", desc: true }]}
            exportFileName="Danh_sach_phieu_chuyen_kho"
            exportMapper={(ticket = {}) => ({
              "Mã phiếu": ticket.ticketCode || "",
              "Mã kho xuất": ticket.fromWarehouseCode || "",
              "Tên kho xuất": ticket.fromWarehouseName || "",
              "Mã kho nhập": ticket.toWarehouseCode || "",
              "Tên kho nhập": ticket.toWarehouseName || "",
              "Lý do": ticket.reason || "",
              "Người tạo": ticket.createdBy || "",
              "Ngày tạo": ticket.createdOn ? new Date(ticket.createdOn).toLocaleString() : "",
              "Cập nhật": ticket.lastUpdatedOn ? new Date(ticket.lastUpdatedOn).toLocaleString() : "",
              "Trạng thái": ticket.status || "",
            })}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default TransferTicketInCompany;
