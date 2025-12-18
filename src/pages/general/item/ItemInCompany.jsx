import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable } from "@/components/ui/data-table";
import { useItems } from "@/hooks/useItems";
import toastService from "@/services/toastService";
import { AddButton } from "@components/common/ActionButtons";
import { useNavigate } from "react-router-dom";
import { getItemColumns } from "./itemColumns";

export default function ItemInCompany() {
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");
  const { data: items = [], isLoading, error } = useItems(companyId);

  if (error) {
    toastService.error(
      error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy danh sách hàng hóa!"
    );
  }

  const columns = getItemColumns();

  return (
    <ListPageLayout
      breadcrumbs="Hàng hóa"
      title="Danh sách hàng hóa"
      description="Quản lý thông tin hàng hóa trong công ty"
      actions={
        <AddButton
          onClick={() => navigate("/create-item")}
          label="Thêm Hàng Hóa"
        />
      }
    >
      <DataTable
        columns={columns}
        data={items}
        onRowClick={(item) => navigate(`/item/${item.itemId}`)}
        loading={isLoading}
        emptyMessage="Chưa có hàng hóa nào"
        defaultSorting={[{ id: "itemCode", desc: false }]}
        exportFileName="Danh_sach_hang_hoa"
        exportMapper={(item = {}) => ({
          "Tên hàng hóa": item.itemName || "",
          "Loại hàng hóa": item.itemType || "",
          "Đơn vị tính": item.uom || "",
          "Giá nhập": item.importPrice ?? "",
          "Giá xuất": item.exportPrice ?? "",
          "Thông số kỹ thuật": item.technicalSpecifications || "",
          "Mô tả": item.description || "",
          "Hàng bán": item.isSellable ? "Có" : "Không",
        })}
      />
    </ListPageLayout>
  );
}
