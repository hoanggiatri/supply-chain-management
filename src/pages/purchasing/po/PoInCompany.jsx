import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllPosInCompany } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PoInCompany = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPos = async () => {
      setLoading(true);
      try {
        const data = await getAllPosInCompany(companyId, token);
        setPos(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn mua hàng!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPos();
  }, [companyId, token]);

  const filteredPos =
    filterStatus === "Tất cả"
      ? pos
      : pos.filter((po) => po.status === filterStatus);

  const statusLabels = {
    "Chờ xác nhận": "Chờ xác nhận",
    "Đã xác nhận": "Đã xác nhận",
    "Đang vận chuyển": "Đang vận chuyển",
    "Chờ nhập kho": "Chờ nhập kho",
    "Đã hoàn thành": "Đã hoàn thành",
    "Đã hủy": "Đã hủy",
  };

  const statusColors = {
    "Chờ xác nhận": "bg-purple-100 text-purple-700",
    "Đã xác nhận": "bg-blue-100 text-blue-700",
    "Đang vận chuyển": "bg-cyan-100 text-cyan-700",
    "Chờ nhập kho": "bg-amber-100 text-amber-700",
    "Đã hoàn thành": "bg-green-100 text-green-700",
    "Đã hủy": "bg-red-100 text-red-700",
  };

  const columns = [
    {
      accessorKey: "poCode",
      header: createSortableHeader("Mã đơn hàng"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "quotationCode",
      header: createSortableHeader("Mã báo giá"),
    },
    {
      accessorKey: "supplierCompanyCode",
      header: createSortableHeader("Mã NCC"),
    },
    {
      accessorKey: "supplierCompanyName",
      header: createSortableHeader("Tên NCC"),
    },
    {
      accessorKey: "paymentMethod",
      header: createSortableHeader("PTTT"),
    },
    {
      accessorKey: "createdBy",
      header: createSortableHeader("Người tạo"),
    },
    {
      accessorKey: "createdOn",
      header: createSortableHeader("Ngày tạo"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString("vi-VN") : "";
      },
    },
    {
      accessorKey: "status",
      header: createSortableHeader("Trạng thái"),
      cell: ({ getValue }) => {
        const status = getValue();
        const label = statusLabels[status] || status;
        const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

        return (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Đơn mua hàng"
      title="Danh sách đơn mua hàng"
    >
      <div className="mb-6">
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
      </div>

      <DataTable
        columns={columns}
        data={filteredPos}
        loading={loading}
        onRowClick={(row) => navigate(`/po/${row.poId}`)}
        exportFileName="Danh_sach_don_mua_hang"
        exportMapper={(row = {}) => ({
          "Mã đơn hàng": row.poCode || "",
          "Mã báo giá": row.quotationCode || "",
          "Mã NCC": row.supplierCompanyCode || "",
          "Tên NCC": row.supplierCompanyName || "",
          "PTTT": row.paymentMethod || "",
          "Người tạo": row.createdBy || "",
          "Ngày tạo": row.createdOn
            ? new Date(row.createdOn).toLocaleString("vi-VN")
            : "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default PoInCompany;
