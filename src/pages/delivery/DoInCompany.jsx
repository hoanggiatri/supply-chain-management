import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllDeliveryOrdersInCompany } from "@/services/delivery/DoService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoInCompany = () => {
  const [dos, setDos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDos = async () => {
      setLoading(true);
      try {
        const data = await getAllDeliveryOrdersInCompany(companyId, token);
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.content)
          ? data.content
          : [];
        setDos(normalized);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn vận chuyển!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDos();
  }, [companyId, token]);

  const filteredDos =
    filterStatus === "Tất cả"
      ? Array.isArray(dos)
        ? dos
        : []
      : Array.isArray(dos)
      ? dos.filter((ord) => ord.status === filterStatus)
      : [];

  const statusLabels = {
    "Chờ xác nhận": "Chờ xác nhận",
    "Chờ lấy hàng": "Chờ lấy hàng",
    "Đang vận chuyển": "Đang vận chuyển",
    "Đã hoàn thành": "Đã hoàn thành",
  };

  const statusColors = {
    "Chờ xác nhận": "bg-red-100 text-red-700",
    "Chờ lấy hàng": "bg-orange-100 text-orange-700",
    "Đang vận chuyển": "bg-blue-100 text-blue-700",
    "Đã hoàn thành": "bg-green-100 text-green-700",
  };

  const columns = [
    {
      accessorKey: "doCode",
      header: createSortableHeader("Mã đơn vận chuyển"),
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
      accessorKey: "soCode",
      header: createSortableHeader("Mã đơn bán"),
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
      accessorKey: "lastUpdatedOn",
      header: createSortableHeader("Cập nhật gần nhất"),
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
      breadcrumbs="Vận chuyển"
      title="Danh sách đơn vận chuyển"
    >
      <div className="mb-6">
        <StatusSummaryCard
          data={dos}
          statusLabels={[
            "Tất cả",
            "Chờ xác nhận",
            "Chờ lấy hàng",
            "Đang vận chuyển",
            "Đã hoàn thành",
          ]}
          getStatus={(ord) => ord.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": "#f44336",
            "Chờ lấy hàng": "#ff9800",
            "Đang vận chuyển": "#2196f3",
            "Đã hoàn thành": "#4caf50",
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredDos}
        loading={loading}
        onRowClick={(row) => navigate(`/do/${row.doId}`)}
        exportFileName="Danh_sach_don_van_chuyen"
        exportMapper={(row = {}) => ({
          "Mã đơn vận chuyển": row.doCode || "",
          "Mã đơn bán": row.soCode || "",
          "Người tạo": row.createdBy || "",
          "Ngày tạo": row.createdOn
            ? new Date(row.createdOn).toLocaleString("vi-VN")
            : "",
          "Cập nhật gần nhất": row.lastUpdatedOn
            ? new Date(row.lastUpdatedOn).toLocaleString("vi-VN")
            : "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default DoInCompany;
