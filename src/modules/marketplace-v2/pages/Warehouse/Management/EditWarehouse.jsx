import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '../../../components/ui/BackButton';
import { useUpdateWarehouse, useWarehouseById } from '../../../hooks/useApi';
import WarehouseForm from './WarehouseForm';

const EditWarehouse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: warehouse, isLoading } = useWarehouseById(id);
  const updateWarehouseMutation = useUpdateWarehouse();

  const handleSubmit = (formData) => {
    updateWarehouseMutation.mutate({ warehouseId: id, data: formData }, {
      onSuccess: () => {
        toast.success('Cập nhật kho thành công!');
        navigate('/marketplace-v2/warehouse/management');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật kho');
      }
    });
  };

  if (isLoading) {
    return (
       <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Kho không tồn tại hoặc đã bị xóa</p>
        <button 
          onClick={() => navigate('/marketplace-v2/warehouse/management')}
          className="text-blue-600 hover:underline mt-2"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
            Chỉnh sửa kho: {warehouse.warehouseName}
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Cập nhật thông tin chi tiết của kho
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <WarehouseForm 
          initialData={warehouse}
          onSubmit={handleSubmit} 
          isSubmitting={updateWarehouseMutation.isLoading}
          isEdit={true}
        />
      </motion.div>
    </div>
  );
};

export default EditWarehouse;
