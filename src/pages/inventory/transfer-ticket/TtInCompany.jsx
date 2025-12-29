import { AddButton } from "@/components/common/ActionButtons";
import StatusSummaryCard from "@/components/common/StatusSummaryCard";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { createSortableHeader, createStatusBadge, DataTable } from "@/components/ui/data-table";
import { getAllTransferTicketsInCompany } from "@/services/inventory/TransferTicketService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TtInCompany = () => {
  const [tickets, setTickets] = useState([]);
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

  const columns = [
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

  return (
    <ListPageLayout
      breadcrumbs="Kho / Chuyển kho"
      title="Phiếu chuyển kho"
      description="Quản lý việc chuyển hàng giữa các kho"
      actions={
        <AddButton
          onClick={() => navigate("/create-transfer-ticket")}
          label="Tạo phiếu chuyển"
        />
      }
    >
      <div className="mb-6">
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
      </div>

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
    </ListPageLayout>
  );
};

export default TtInCompany;
