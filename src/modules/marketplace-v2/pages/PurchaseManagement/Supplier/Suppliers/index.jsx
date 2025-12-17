import { motion } from 'framer-motion';
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../../hooks';
import { useCompanies } from '../../../../hooks/useApi';

/**
 * Suppliers list page - displays all available companies
 */
const Suppliers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: companiesData, isLoading, isError, refetch } = useCompanies();

  // Get current user's companyId to exclude from supplier list
  const myCompanyId = useMemo(() => {
    return localStorage.getItem('companyId');
  }, []);

  // Filter companies - exclude own company and apply search
  const suppliers = useMemo(() => {
    if (!companiesData) return [];

    // Handle different API response structures
    let data = [];
    if (Array.isArray(companiesData)) {
      data = companiesData;
    } else if (companiesData.content && Array.isArray(companiesData.content)) {
      data = companiesData.content;
    } else if (companiesData.data && Array.isArray(companiesData.data)) {
      data = companiesData.data;
    }

    return data
      .filter(company => {
        // Filter out own company using companyId from localStorage
        const companyIdStr = String(company.companyId || company.id);
        return company && companyIdStr !== String(myCompanyId);
      })
      .filter(company => {
        if (!debouncedSearch) return true;
        const searchLower = debouncedSearch.toLowerCase();
        return (
          (company.companyName || company.name)?.toLowerCase().includes(searchLower) ||
          company.email?.toLowerCase().includes(searchLower) ||
          company.taxCode?.toLowerCase().includes(searchLower) ||
          company.address?.toLowerCase().includes(searchLower)
        );
      });
  }, [companiesData, myCompanyId, debouncedSearch]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1
            className="text-2xl lg:text-3xl font-bold"
            style={{ color: 'var(--mp-text-primary)' }}
          >
            Danh sách nhà cung cấp
          </h1>
          <p
            className="mt-1"
            style={{ color: 'var(--mp-text-secondary)' }}
          >
            {isLoading ? 'Đang tải...' : `${suppliers.length} nhà cung cấp`}
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="mp-btn mp-btn-secondary"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </motion.button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-4"
      >
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--mp-text-tertiary)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên, email, địa chỉ..."
            className="w-full mp-input pl-11"
          />
        </div>
      </motion.div>

      {/* Error State */}
      {isError && (
        <div className="mp-glass-card p-8 text-center">
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
          <button onClick={() => refetch()} className="mp-btn mp-btn-primary">
            Thử lại
          </button>
        </div>
      )}

      {/* Suppliers Grid */}
      {!isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mp-glass-card p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))
          ) : suppliers.length > 0 ? (
            suppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="mp-glass-card p-6 cursor-pointer group"
                onClick={() => navigate(`/marketplace-v2/supplier/${supplier.id}`)}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {supplier.logoUrl ? (
                    <img
                      src={supplier.logoUrl}
                      alt={supplier.companyName || supplier.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                    style={{
                      display: supplier.logoUrl ? 'none' : 'flex',
                      background: `linear-gradient(135deg, hsl(${(supplier.id * 37) % 360}, 70%, 50%), hsl(${(supplier.id * 37 + 40) % 360}, 70%, 40%))`
                    }}
                  >
                    {(supplier.companyName || supplier.name)?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-lg truncate group-hover:text-blue-500 transition-colors"
                      style={{ color: 'var(--mp-text-primary)' }}
                    >
                      {supplier.companyName || supplier.name}
                    </h3>
                    {supplier.taxCode && (
                      <p className="text-sm" style={{ color: 'var(--mp-text-tertiary)' }}>
                        MST: {supplier.taxCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                      <Mail size={14} style={{ color: 'var(--mp-text-tertiary)' }} />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                  {(supplier.phoneNumber || supplier.phone) && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                      <Phone size={14} style={{ color: 'var(--mp-text-tertiary)' }} />
                      <span>{supplier.phoneNumber || supplier.phone}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                      <MapPin size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--mp-text-tertiary)' }} />
                      <span className="line-clamp-2">{supplier.address}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t flex gap-2" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/marketplace-v2/create-rfq', { state: { supplierId: supplier.id } });
                    }}
                    className="flex-1 mp-btn mp-btn-primary text-sm py-2"
                  >
                    <Plus size={16} />
                    Tạo yêu cầu báo giá
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Building2 size={48} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
              <p style={{ color: 'var(--mp-text-tertiary)' }}>
                Không tìm thấy nhà cung cấp nào
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
