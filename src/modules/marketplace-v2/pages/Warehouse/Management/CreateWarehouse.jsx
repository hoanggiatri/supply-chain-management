import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '../../../components/ui/BackButton';
import { useCreateWarehouse } from '../../../hooks/useApi';
import WarehouseForm from './WarehouseForm';

const CreateWarehouse = () => {
  const navigate = useNavigate();
  const createWarehouseMutation = useCreateWarehouse();

  const handleSubmit = (formData) => {
    createWarehouseMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Tạo kho thành công!');
        navigate('/marketplace-v2/warehouse/management');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo kho');
      }
    });
  };

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
            Thêm kho mới
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Tạo kho mới để quản lý hàng hóa
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
          onSubmit={handleSubmit} 
          isSubmitting={createWarehouseMutation.isLoading}
        />
      </motion.div>
    </div>
  );
};

export default CreateWarehouse;
