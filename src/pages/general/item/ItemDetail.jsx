import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, deleteItem } from "@/services/general/ItemService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import BackButton from "@components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { EditButton, DeleteButton } from "@components/common/ActionButtons";

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });
  const navigate = useNavigate();

  const fetchItem = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await getItemById(itemId, token);
      setItem(data);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi lấy thông tin hàng hóa!"
      );
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await deleteItem(itemId, token);
      toastrService.success("Xóa hàng hóa thành công!");
      navigate("/items");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa hàng hóa!"
      );
    }
  };

  if (!item) {
    return <LoadingPaper title="THÔNG TIN HÀNG HÓA" />;
  }

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="flex items-start py-2">
      <span className="text-gray-500 w-32 flex-shrink-0 text-sm">{label}</span>
      <span className={`text-gray-900 text-sm ${className}`}>{value || "---"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Breadcrumb area */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate("/items")}>Danh sách</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Chi tiết hàng hóa</span>
            </div>
            <BackButton to="/items" label="Trở lại" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Image */}
              <div className="w-full md:w-2/5 flex flex-col gap-4">
                <div className="aspect-square w-full rounded-md overflow-hidden border border-gray-100 bg-gray-50 relative">
                  <img
                    src={
                      item.imageUrl ||
                      "https://cdn-icons-png.freepik.com/512/2774/2774806.png"
                    }
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                  {/* Status Badge Overlay */}
                  <div className={`absolute top-0 left-0 text-white text-xs font-bold px-2 py-1 rounded-br-md ${item.isSellable ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {item.isSellable ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                  </div>
                </div>

                {/* Thumbnail placeholders (simulated) */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[1, 2, 3, 4].map((_, idx) => (
                    <div key={idx} className="w-20 h-20 flex-shrink-0 border border-gray-200 rounded-sm cursor-pointer hover:border-orange-500 opacity-60 hover:opacity-100 transition-all">
                      <img
                        src={item.imageUrl || "https://cdn-icons-png.freepik.com/512/2774/2774806.png"}
                        className="w-full h-full object-cover"
                        alt="thumb"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="w-full md:w-3/5 flex flex-col">
                {/* Title */}
                <h1 className="text-xl font-medium text-gray-900 mb-2 line-clamp-2">
                  {item.itemName}
                </h1>

                {/* Price Section */}
                <div className="bg-gray-50 p-4 rounded-sm flex items-baseline gap-3 mb-6 mt-4">
                  <span className="text-3xl font-medium text-orange-600">
                    ₫{item.exportPrice?.toLocaleString()}
                  </span>
                </div>

                {/* Details List */}
                <div className="flex-1 space-y-1 mb-8">
                  <InfoRow label="Mã hàng hóa" value={item.itemCode} />
                  <InfoRow label="Loại hàng hóa" value={item.itemType} />
                  <InfoRow label="Đơn vị tính" value={item.uom} />
                  <InfoRow label="Giá nhập" value={`${item.importPrice?.toLocaleString()} ₫`} className="text-gray-500" />
                  <InfoRow label="Thông số" value={item.technicalSpecifications} />
                  <InfoRow label="Mô tả" value={item.description} className="line-clamp-3" />

                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-auto">
                  <EditButton
                    onClick={() => navigate(`/item/${itemId}/edit`)}
                    label="Sửa Hàng Hóa"
                    className="flex-1 h-12 text-base"
                  />
                  <DeleteButton
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        onConfirm: handleDelete,
                      })
                    }
                    label="Xóa Hàng Hóa"
                    className="flex-1 h-12 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm || (() => { })}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa hàng hóa này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmButtonProps="danger"
      />
    </div>
  );
};

export default ItemDetail;
