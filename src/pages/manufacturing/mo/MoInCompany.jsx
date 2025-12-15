import { AddButton } from "@/components/common/ActionButtons";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllMosInCompany } from "@/services/manufacturing/MoService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MoInCompany = () => {
  const [mos, setMos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchMos = async () => {
      setLoading(true);
      try {
        const data = await getAllMosInCompany(companyId, token);
        setMos(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy danh sách công lệnh!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMos();
  }, [companyId, token]);

  const filteredMos =
    !filterStatus || filterStatus === "Tất cả"
      ? mos
      : mos.filter((mo) => mo.status === filterStatus);

  const statusLabels = {
    "Chờ xác nhận": "Chờ xác nhận",
    "Chờ sản xuất": "Chờ sản xuất",
    "Đang sản xuất": "Đang sản xuất",
    "Chờ nhập kho": "Chờ nhập kho",
    "Đã hoàn thành": "Đã hoàn thành",
    "Đã hủy": "Đã hủy",
  };

  const statusColors = {
    "Chờ xác nhận": "bg-purple-100 text-purple-700",
    "Chờ sản xuất": "bg-blue-100 text-blue-700",
    "Đang sản xuất": "bg-cyan-100 text-cyan-700",
    "Chờ nhập kho": "bg-amber-100 text-amber-700",
    "Đã hoàn thành": "bg-green-100 text-green-700",
    "Đã hủy": "bg-red-100 text-red-700",
  };

  const columns = [
    {
      accessorKey: "moCode",
      header: createSortableHeader("Mã MO"),
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
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
    },
    {
      accessorKey: "lineCode",
      header: createSortableHeader("Mã chuyền"),
    },
    {
      accessorKey: "type",
      header: createSortableHeader("Loại"),
    },
    {
      accessorKey: "quantity",
      header: createSortableHeader("Số lượng"),
    },
    {
      accessorKey: "estimatedStartTime",
      header: createSortableHeader("Ngày bắt đầu"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString("vi-VN") : "";
      },
    },
    {
      accessorKey: "estimatedEndTime",
      header: createSortableHeader("Ngày kết thúc"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString("vi-VN") : "";
      },
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
      breadcrumbs="Công lệnh sản xuất"
      title="Danh sách công lệnh sản xuất"
      actions={
        <AddButton
          onClick={() => navigate("/create-mo")}
          label="Thêm mới"
        />
      }
    >
      <div className="mb-6">
        <StatusSummaryCard
          data={mos}
          statusLabels={[
            "Tất cả",
            "Chờ xác nhận",
            "Chờ sản xuất",
            "Đang sản xuất",
            "Chờ nhập kho",
            "Đã hoàn thành",
            "Đã hủy",
          ]}
          getStatus={(mo) => mo.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": "#9c27b0",
            "Chờ sản xuất": "#2196f3",
            "Đang sản xuất": "#00bcd4",
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
        data={filteredMos}
        loading={loading}
        onRowClick={(row) => navigate(`/mo/${row.moId}`)}
        exportFileName="Danh_sach_cong_lenh"
        exportMapper={(row = {}) => ({
          "Mã MO": row.moCode || "",
          "Mã hàng hóa": row.itemCode || "",
          "Mã chuyền": row.lineCode || "",
          "Loại": row.type || "",
          "Số lượng": row.quantity || "",
          "Ngày bắt đầu": row.estimatedStartTime
            ? new Date(row.estimatedStartTime).toLocaleString("vi-VN")
            : "",
          "Ngày kết thúc": row.estimatedEndTime
            ? new Date(row.estimatedEndTime).toLocaleString("vi-VN")
            : "",
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

export default MoInCompany;
