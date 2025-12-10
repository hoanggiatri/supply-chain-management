import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Loader2,
    Mail,
    MapPin,
    Package,
    Phone,
    Plus,
    Search,
    User
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ItemDetailModal from '../../../../components/ui/ItemDetailModal';
import { useDebounce } from '../../../../hooks';
import { useCompanyById, useItemsByCompany } from '../../../../hooks/useApi';

/**
 * Supplier Detail page - displays company info with logo, items list with search
 */
const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemSearch, setItemSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const debouncedItemSearch = useDebounce(itemSearch, 300);

  // Fetch company details
  const { data: company, isLoading, isError, refetch } = useCompanyById(id);
  
  // Fetch items from this company
  const { data: itemsData, isLoading: itemsLoading } = useItemsByCompany(id);

  // Process items with search filter
  const items = useMemo(() => {
    if (!itemsData) return [];

    let data = [];
    if (Array.isArray(itemsData)) {
      data = itemsData;
    } else if (itemsData.content && Array.isArray(itemsData.content)) {
      data = itemsData.content;
    } else if (itemsData.data && Array.isArray(itemsData.data)) {
      data = itemsData.data;
    }

    // Only show sellable items
    let filtered = data.filter(item => item && item.isSellable === true).map(item => ({
      id: item.itemId,
      name: item.itemName,
      code: item.itemCode,
      type: item.itemType,
      price: item.exportPrice || 0,
      unit: item.uom || 'Cái',
      specs: item.technicalSpecifications,
      description: item.description,
      imageUrl: item.imageUrl
    }));

    // Apply search filter
    if (debouncedItemSearch) {
      const search = debouncedItemSearch.toLowerCase();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(search) ||
        item.code?.toLowerCase().includes(search) ||
        item.type?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [itemsData, debouncedItemSearch]);

  const displayName = company?.companyName || company?.name;
  const phone = company?.phoneNumber || company?.phone;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="mp-glass-card p-6">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !company) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mp-glass-card p-8 text-center">
          <Building2 size={48} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
          <p className="text-red-500 mb-4">Không thể tải thông tin nhà cung cấp</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="mp-btn mp-btn-secondary">
              Quay lại
            </button>
            <button onClick={() => refetch()} className="mp-btn mp-btn-primary">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mp-glass-button p-2 rounded-xl"
        >
          <ArrowLeft size={20} style={{ color: 'var(--mp-text-secondary)' }} />
        </motion.button>
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Chi tiết nhà cung cấp
          </h1>
        </div>
      </motion.div>

      {/* Company Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, hsl(${(company.companyId || id) * 37 % 360}, 70%, 50%), hsl(${((company.companyId || id) * 37 + 40) % 360}, 70%, 40%))`
                }}
              >
                {displayName?.charAt(0)?.toUpperCase() || 'C'}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: 'var(--mp-text-primary)' }}
              >
                {displayName}
              </h2>
              <div className="flex flex-wrap gap-3 mt-2">
                {company.companyCode && (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'var(--mp-bg-secondary)', color: 'var(--mp-text-secondary)' }}
                  >
                    Mã: {company.companyCode}
                  </span>
                )}
                {company.taxCode && (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: 'var(--mp-bg-secondary)', color: 'var(--mp-text-secondary)' }}
                  >
                    MST: {company.taxCode}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {company.email && (
                <div className="flex items-center gap-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  <Mail size={16} style={{ color: 'var(--mp-primary-600)' }} />
                  <span>{company.email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  <Phone size={16} style={{ color: 'var(--mp-primary-600)' }} />
                  <span>{phone}</span>
                </div>
              )}
              {company.representativeName && (
                <div className="flex items-center gap-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  <User size={16} style={{ color: 'var(--mp-primary-600)' }} />
                  <span>Đại diện: {company.representativeName}</span>
                </div>
              )}
              {company.companyType && (
                <div className="flex items-center gap-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  <Briefcase size={16} style={{ color: 'var(--mp-primary-600)' }} />
                  <span>{company.companyType}</span>
                </div>
              )}
              {company.address && (
                <div className="flex items-start gap-2 sm:col-span-2" style={{ color: 'var(--mp-text-secondary)' }}>
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--mp-primary-600)' }} />
                  <span>{company.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t flex flex-wrap gap-3" style={{ borderColor: 'var(--mp-border-light)' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/marketplace-v2/create-rfq', { state: { supplierId: company.companyId || id } })}
            className="mp-btn mp-btn-primary"
          >
            <Plus size={18} />
            Tạo RFQ
          </motion.button>
        </div>
      </motion.div>

      {/* Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Sản phẩm ({items.length})
          </h3>
          
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--mp-text-tertiary)' }}
            />
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="mp-input pl-10 w-full"
            />
          </div>
        </div>

        {/* Items grid with scroll */}
        {itemsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--mp-primary-600)' }} />
            <span className="ml-2" style={{ color: 'var(--mp-text-secondary)' }}>Đang tải sản phẩm...</span>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}
                className="rounded-xl border overflow-hidden cursor-pointer group"
                style={{ 
                  borderColor: 'var(--mp-border-light)', 
                  backgroundColor: 'var(--mp-bg-primary)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedItem(item)}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                    >
                      <Package size={48} style={{ color: 'var(--mp-text-tertiary)' }} />
                    </div>
                  )}
                  
                  {/* Item type badge */}
                  <div 
                    className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.9)', 
                      color: 'white' 
                    }}
                  >
                    {item.type}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <p
                    className="font-medium text-sm line-clamp-2 min-h-[2.5rem]"
                    style={{ color: 'var(--mp-text-primary)' }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--mp-text-tertiary)' }}
                  >
                    {item.code}
                  </p>
                  
                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className="text-lg font-bold"
                      style={{ color: 'var(--mp-primary-600)' }}
                    >
                      {item.price.toLocaleString('vi-VN')}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'var(--mp-text-secondary)' }}
                    >
                      đ/{item.unit}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
            <p style={{ color: 'var(--mp-text-tertiary)' }}>
              {debouncedItemSearch ? 'Không tìm thấy sản phẩm' : 'Nhà cung cấp này chưa có sản phẩm nào'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default SupplierDetail;
