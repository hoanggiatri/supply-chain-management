import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { DataTable } from "@/components/ui/data-table";
import StatusSummaryCard from "@/components/common/StatusSummaryCard";
import { BarChart } from "@/components/common/UniversalChart";
import { getAllIssueTicketsInCompany, getMonthlyIssueReport, getIssueForecast } from "@/services/inventory/IssueTicketService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { createSortableHeader, createStatusBadge } from "@/components/ui/data-table";

const ItInCompany = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [monthlyData, setMonthlyData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const data = await getAllIssueTicketsInCompany(companyId, token);
        setTickets(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy danh sách phiếu xuất!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [companyId, token]);

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        const monthly = await getMonthlyIssueReport(companyId, "Tất cả", 0, token);
        const forecast = await getIssueForecast(companyId, "Tất cả", 0, token);
        setMonthlyData(monthly);
        setForecastData(forecast);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy dữ liệu biểu đồ!"
        );
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [companyId, token]);

  const filteredTickets =
    !filterStatus || filterStatus === "Tất cả"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filterStatus);

  const getIssueTicketColumns = () => [
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
      accessorKey: "issueDate",
      header: createSortableHeader("Ngày xuất"),
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
      accessorKey: "issueType",
      header: createSortableHeader("Loại xuất kho"),
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
        "Chờ xuất kho": "bg-orange-100 text-orange-800", 
        "Đã hoàn thành": "bg-green-100 text-green-800"
      })
    },
  ];

  const columns = getIssueTicketColumns();

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH PHIẾU XUẤT KHO
          </Typography>

          <StatusSummaryCard
            data={tickets}
            statusLabels={[
              "Tất cả",
              "Chờ xác nhận",
              "Chờ xuất kho",
              "Đã hoàn thành",
            ]}
            getStatus={(ticket) => ticket.status}
            statusColors={{
              "Tất cả": "#000",
              "Chờ xác nhận": "#9c27b0",
              "Chờ xuất kho": "#ff9800",
              "Đã hoàn thành": "#4caf50",
            }}
            onSelectStatus={(status) => setFilterStatus(status)}
            selectedStatus={filterStatus}
          />

          <BarChart
            title="Xuất kho theo tháng"
            data={monthlyData}
            dataKey="totalQuantity"
            xAxisKey="month"
            color="#ff6b6b"
            height={250}
            loading={chartLoading}
            className="mb-6"
          />

          <DataTable
            columns={columns}
            data={filteredTickets}
            loading={loading}
            emptyMessage="Chưa có phiếu xuất kho nào"
            onRowClick={(ticket) => navigate(`/issue-ticket/${ticket.ticketId}`)}
            defaultSorting={[{ id: "createdOn", desc: true }]}
            exportFileName="Danh_sach_phieu_xuat_kho"
            exportMapper={(ticket = {}) => ({
              "Mã phiếu": ticket.ticketCode || "",
              "Mã kho": ticket.warehouseCode || "",
              "Tên kho": ticket.warehouseName || "",
              "Ngày xuất": ticket.issueDate ? new Date(ticket.issueDate).toLocaleString() : "",
              "Lý do": ticket.reason || "",
              "Loại xuất kho": ticket.issueType || "",
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

export default ItInCompany;
