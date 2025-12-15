import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllPosInSupplierCompany } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PoInSupplierCompany = () => {
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
        const data = await getAllPosInSupplierCompany(companyId, token);
        const filteredData = data.filter(
          (po) => po.status === "Chờ xác nhận" || po.status === "Đã xác nhận"
        );
        setPos(filteredData);
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
  };

  const statusColors = {
    "Chờ xác nhận": "bg-blue-100 text-blue-700",
    "Đã xác nhận": "bg-green-100 text-green-700",
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
      accessorKey: "companyCode",
      header: createSortableHeader("Mã KH"),
    },
    {
      accessorKey: "companyName",
      header: createSortableHeader("Tên khách hàng"),
    },
    {
      accessorKey: "paymentMethod",
      header: createSortableHeader("PTTT"),
    },
    {
      accessorKey: "createdOn",
      header: createSortableHeader("Ngày đặt hàng"),
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
      breadcrumbs="Đơn đặt hàng"
      title="Danh sách đơn đặt hàng"
    >
      <div className="mb-6">
        <StatusSummaryCard
          data={pos}
          statusLabels={["Tất cả", "Chờ xác nhận", "Đã xác nhận"]}
          getStatus={(po) => po.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": "#2196f3",
            "Đã xác nhận": "#4caf50",
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredPos}
        loading={loading}
        onRowClick={(row) => navigate(`/supplier-po/${row.poId}`)}
        exportFileName="Danh_sach_don_dat_hang"
        exportMapper={(row = {}) => ({
          "Mã đơn hàng": row.poCode || "",
          "Mã báo giá": row.quotationCode || "",
          "Mã KH": row.companyCode || "",
          "Tên khách hàng": row.companyName || "",
          "PTTT": row.paymentMethod || "",
          "Ngày đặt hàng": row.createdOn
            ? new Date(row.createdOn).toLocaleString("vi-VN")
            : "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default PoInSupplierCompany;
