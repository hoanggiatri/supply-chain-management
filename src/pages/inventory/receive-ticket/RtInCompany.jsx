import StatusSummaryCard from "@/components/common/StatusSummaryCard";
import { createSortableHeader, createStatusBadge, DataTable } from "@/components/ui/data-table";
import { getAllReceiveTicketsInCompany, getMonthlyReceiveReport } from "@/services/inventory/ReceiveTicketService";
import toastrService from "@/services/toastrService";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RtInCompany = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("Tất cả");


  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllReceiveTicketsInCompany(companyId, token);
        setTickets(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
          "Có lỗi khi lấy danh sách phiếu nhập!"
        );
      }
    };

    fetchTickets();
  }, [companyId, token]);



  const filteredTickets =
    !filterStatus || filterStatus === "Tất cả"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filterStatus);




  const getReceiveTicketColumns = () => [
    {
      accessorKey: "ticketCode",
      header: createSortableHeader("Mã phiếu"),
      cell: ({ getValue }) => <span className="font-medium text-blue-600">{getValue() || ""}</span>
    },
    {
      accessorKey: "warehouseCode",
      header: createSortableHeader("Mã kho"),
      cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
      accessorKey: "warehouseName",
      header: createSortableHeader("Tên kho"),
      cell: ({ getValue }) => <span>{getValue() || ""}</span>
    },
    {
      accessorKey: "receiveDate",
      header: createSortableHeader("Ngày nhập kho"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString() : "";
      },
    },
    {
      accessorKey: "reason",
      header: createSortableHeader("Lý do"),
      cell: ({ getValue }) => <span className="truncate max-w-[150px] block" title={getValue()}>{getValue() || ""}</span>
    },
    {
      accessorKey: "receiveType",
      header: createSortableHeader("Loại nhập kho"),
      cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
      accessorKey: "referenceCode",
      header: createSortableHeader("Mã tham chiếu"),
      cell: ({ getValue }) => <span className="font-medium text-blue-600">{getValue() || ""}</span>
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
        "Chờ nhập kho": "bg-orange-100 text-orange-800",
        "Đã hoàn thành": "bg-green-100 text-green-800"
      })
    },
  ];

  const columns = getReceiveTicketColumns();

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH PHIẾU NHẬP KHO
          </Typography>

          <StatusSummaryCard
            data={tickets}
            statusLabels={[
              "Tất cả",
              "Chờ xác nhận",
              "Chờ nhập kho",
              "Đã hoàn thành",
            ]}
            getStatus={(ticket) => ticket.status}
            statusColors={{
              "Tất cả": "#000",
              "Chờ xác nhận": "#9c27b0",
              "Chờ nhập kho": "#ff9800",
              "Đã hoàn thành": "#4caf50",
            }}
            onSelectStatus={(status) => setFilterStatus(status)}
            selectedStatus={filterStatus}
          />



          <DataTable
            columns={columns}
            data={filteredTickets}
            emptyMessage="Chưa có phiếu nhập kho nào"
            onRowClick={(ticket) => navigate(`/receive-ticket/${ticket.ticketId}`)}
            defaultSorting={[{ id: "createdOn", desc: true }]}
            exportFileName="Danh_sach_phieu_nhap_kho"
            exportMapper={(ticket = {}) => ({
              "Mã phiếu": ticket.ticketCode || "",
              "Mã kho": ticket.warehouseCode || "",
              "Tên kho": ticket.warehouseName || "",
              "Ngày nhập kho": ticket.receiveDate ? new Date(ticket.receiveDate).toLocaleString() : "",
              "Lý do": ticket.reason || "",
              "Loại nhập kho": ticket.receiveType || "",
              "Mã tham chiếu": ticket.referenceCode || "",
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

export default RtInCompany;
