import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  FileText,
  Loader2,
  Package,
  Search
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProgress from '../../components/forms/StepProgress';
import { useDebounce } from '../../hooks';
import { useCompanies, useCreateQuotation, useCreateRfq, useItemsByCompany, useProducts } from '../../hooks/useApi';

const steps = [
  { key: 'info', label: 'Thông tin cơ bản', icon: Building2, description: 'Chọn nhà cung cấp' },
  { key: 'items', label: 'Chọn sản phẩm', icon: Package, description: 'Thêm sản phẩm cần mua' },
  { key: 'review', label: 'Xác nhận', icon: FileText, description: 'Kiểm tra và gửi' },
];

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

/**
 * Multi-step form wizard for creating RFQ/Quotations - using real API data
 */
const CreateFormWizard = ({ type = 'rfq' }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Search states
  const [supplierSearch, setSupplierSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const debouncedSupplierSearch = useDebounce(supplierSearch, 300);
  const debouncedItemSearch = useDebounce(itemSearch, 300);

  // Fetch real data
  const { data: companiesData, isLoading: companiesLoading } = useCompanies();
  const { data: productsData, isLoading: productsLoading } = useProducts();

  // Create mutations
  const createRfqMutation = useCreateRfq();
  const createQuotationMutation = useCreateQuotation();
  const createMutation = type === 'rfq' ? createRfqMutation : createQuotationMutation;

  // Process companies data - filter out own company and apply search
  const companies = useMemo(() => {
    if (!companiesData) return [];
    const myCompanyId = localStorage.getItem('companyId');

    // Handle different API response structures
    let data = [];
    if (Array.isArray(companiesData)) {
      data = companiesData;
    } else if (companiesData.content && Array.isArray(companiesData.content)) {
      data = companiesData.content;
    } else if (companiesData.data && Array.isArray(companiesData.data)) {
      data = companiesData.data;
    }

    // Filter out own company and map to consistent structure
    let filtered = data
      .filter(company => company && String(company.companyId || company.id) !== String(myCompanyId))
      .map(company => ({
        id: company.companyId || company.id,
        name: company.companyName || company.name,
        logoUrl: company.logoUrl,
        taxCode: company.taxCode,
        address: company.address,
        email: company.email,
        phone: company.phoneNumber || company.phone,
        type: company.companyType
      }));

    // Apply search filter
    if (debouncedSupplierSearch) {
      const search = debouncedSupplierSearch.toLowerCase();
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(search) ||
        c.taxCode?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [companiesData, debouncedSupplierSearch]);

  // Process products data
  const products = useMemo(() => {
    if (!productsData) return [];

    // Handle different API response structures
    let data = [];
    if (Array.isArray(productsData)) {
      data = productsData;
    } else if (productsData.content && Array.isArray(productsData.content)) {
      data = productsData.content;
    } else if (productsData.data && Array.isArray(productsData.data)) {
      data = productsData.data;
    }

    return data.filter(p => p).map(product => ({
      id: product.id,
      name: product.name || product.productName,
      sku: product.code || product.productCode || product.sku,
      price: product.price || product.unitPrice || 0,
      unit: product.unit || 'Cái'
    }));
  }, [productsData]);

  // Form data
  const [formData, setFormData] = useState({
    requestedCompanyId: '',
    notes: '',
    expectedDate: '',
    items: [], // Each item will have: { itemId, itemName, supplierItemId, supplierItemName, quantity, note }
  });

  // Fetch supplier items based on selected company
  const { data: supplierItemsData, isLoading: supplierItemsLoading } = useItemsByCompany(
    formData.requestedCompanyId || null
  );

  // Process supplier items - only sellable items with search
  const supplierItems = useMemo(() => {
    if (!supplierItemsData) return [];

    let data = [];
    if (Array.isArray(supplierItemsData)) {
      data = supplierItemsData;
    } else if (supplierItemsData.content && Array.isArray(supplierItemsData.content)) {
      data = supplierItemsData.content;
    } else if (supplierItemsData.data && Array.isArray(supplierItemsData.data)) {
      data = supplierItemsData.data;
    }

    // Only show sellable items from supplier
    let items = data.filter(item => item && item.isSellable === true).map(item => ({
      id: item.itemId,
      name: item.itemName,
      code: item.itemCode,
      type: item.itemType,
      price: item.exportPrice || 0,  // Use exportPrice for selling
      unit: item.uom || 'Cái',
      specs: item.technicalSpecifications,
      description: item.description,
      imageUrl: item.imageUrl
    }));

    // Apply search filter
    if (debouncedItemSearch) {
      const search = debouncedItemSearch.toLowerCase();
      items = items.filter(item => 
        item.name?.toLowerCase().includes(search) ||
        item.code?.toLowerCase().includes(search) ||
        item.type?.toLowerCase().includes(search)
      );
    }

    return items;
  }, [supplierItemsData, debouncedItemSearch]);

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.requestedCompanyId) {
        newErrors.requestedCompanyId = 'Vui lòng chọn nhà cung cấp';
      }
    } else if (currentStep === 1) {
      if (formData.items.length === 0) {
        newErrors.items = 'Vui lòng thêm ít nhất 1 sản phẩm';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      const formEl = document.getElementById('step-form');
      formEl?.classList.add('mp-animate-shake');
      setTimeout(() => formEl?.classList.remove('mp-animate-shake'), 500);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      // Build request payload - match API structure
      const companyId = localStorage.getItem('companyId');
      const employeeName = localStorage.getItem('employeeName');

      // Format date as YYYY-MM-DD
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      };

      const rfqPayload = {
        companyId: Number(companyId),
        requestedCompanyId: Number(formData.requestedCompanyId),
        needByDate: formatDate(formData.expectedDate),
        createdBy: employeeName || 'User',
        status: 'Chưa báo giá',
        rfqDetails: formData.items.map(item => ({
          itemId: Number(item.itemId || item.id), // ID hàng hóa của mình (nếu có)
          supplierItemId: Number(item.id), // ID hàng hóa NCC
          quantity: item.quantity,
          note: item.note || ''
        }))
      };

      await createMutation.mutateAsync(rfqPayload);

      setShowSuccess(true);

      // Trigger confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Redirect after animation
      setTimeout(() => {
        navigate(type === 'rfq' ? '/marketplace-v2/rfqs' : '/marketplace-v2/quotations');
      }, 2500);
    } catch (error) {
      console.error('Error creating:', error);
      setErrors({ submit: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo yêu cầu' });
    }
  };

  const handleItemToggle = (product) => {
    setFormData((prev) => {
      const exists = prev.items.find(item => item.id === product.id);
      if (exists) {
        return { ...prev, items: prev.items.filter(item => item.id !== product.id) };
      }
      // Add with default quantity and empty note
      return { ...prev, items: [...prev.items, { ...product, quantity: 1, note: '' }] };
    });
    setErrors({ ...errors, items: undefined });
  };

  const handleQuantityChange = (productId, quantity) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    }));
  };

  const handleNoteChange = (productId, note) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === productId ? { ...item, note } : item
      )
    }));
  };

  const selectedCompany = companies.find(c => c.id.toString() === formData.requestedCompanyId);
  const totalAmount = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Success screen
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
        >
          <Check size={48} className="text-green-500" />
        </motion.div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--mp-text-primary)' }}
        >
          Tạo thành công!
        </h2>
        <p style={{ color: 'var(--mp-text-secondary)' }}>
          {type === 'rfq' ? 'Yêu cầu báo giá' : 'Báo giá'} của bạn đã được gửi đi
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1
          className="text-2xl lg:text-3xl font-bold mb-2"
          style={{ color: 'var(--mp-text-primary)' }}
        >
          {type === 'rfq' ? 'Tạo yêu cầu báo giá mới' : 'Tạo báo giá mới'}
        </h1>
        <p style={{ color: 'var(--mp-text-secondary)' }}>
          Điền thông tin để gửi {type === 'rfq' ? 'yêu cầu đến' : 'báo giá cho'} nhà cung cấp
        </p>
      </motion.div>

      {/* Step Progress */}
      <StepProgress
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      {/* Form Content */}
      <div id="step-form" className="mp-glass-card p-6 lg:p-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--mp-text-primary)' }}
                  >
                    Chọn nhà cung cấp *
                  </label>

                  {/* Search box */}
                  <div className="relative mb-4">
                    <Search 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2" 
                      style={{ color: 'var(--mp-text-tertiary)' }} 
                    />
                    <input
                      type="text"
                      value={supplierSearch}
                      onChange={(e) => setSupplierSearch(e.target.value)}
                      placeholder="Tìm theo tên, MST, email..."
                      className="mp-input pl-10 w-full"
                    />
                  </div>

                  {companiesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--mp-primary-600)' }} />
                      <span className="ml-2" style={{ color: 'var(--mp-text-secondary)' }}>Đang tải danh sách...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto overflow-x-hidden pr-1">
                      {companies.length > 0 ? companies.map((company) => (
                        <motion.button
                          key={company.id}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setFormData({ ...formData, requestedCompanyId: company.id.toString(), items: [] });
                            setItemSearch(''); // Reset item search when changing supplier
                            setErrors({ ...errors, requestedCompanyId: undefined });
                          }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${formData.requestedCompanyId === company.id.toString()
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Company Logo */}
                            {company.logoUrl ? (
                              <img 
                                src={company.logoUrl} 
                                alt={company.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                              >
                                <Building2 size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-medium truncate"
                                style={{ color: 'var(--mp-text-primary)' }}
                              >
                                {company.name}
                              </p>
                              <p
                                className="text-sm truncate"
                                style={{ color: 'var(--mp-text-secondary)' }}
                              >
                                {company.taxCode ? `MST: ${company.taxCode}` : ''} {company.type && `• ${company.type}`}
                              </p>
                            </div>
                            {formData.requestedCompanyId === company.id.toString() && (
                              <Check size={20} className="text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                        </motion.button>
                      )) : (
                        <p className="text-center py-4" style={{ color: 'var(--mp-text-tertiary)' }}>
                          {debouncedSupplierSearch ? 'Không tìm thấy nhà cung cấp' : 'Không có nhà cung cấp nào'}
                        </p>
                      )}
                    </div>
                  )}

                  {errors.requestedCompanyId && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle size={14} />
                      {errors.requestedCompanyId}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--mp-text-primary)' }}
                  >
                    Ngày giao dự kiến
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                    className="mp-input"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'var(--mp-text-primary)' }}
                  >
                    Ghi chú
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mp-input resize-none"
                    placeholder="Thêm ghi chú cho nhà cung cấp..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Select Items from Supplier */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p style={{ color: 'var(--mp-text-secondary)' }}>
                    Đã chọn: <span className="font-semibold">{formData.items.length}</span> sản phẩm từ nhà cung cấp
                  </p>
                </div>

                {/* Search box for items */}
                {formData.requestedCompanyId && (
                  <div className="relative mb-4">
                    <Search 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2" 
                      style={{ color: 'var(--mp-text-tertiary)' }} 
                    />
                    <input
                      type="text"
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      placeholder="Tìm theo tên, mã sản phẩm..."
                      className="mp-input pl-10 w-full"
                    />
                  </div>
                )}

                {!formData.requestedCompanyId ? (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--mp-text-tertiary)' }} />
                    <p style={{ color: 'var(--mp-text-tertiary)' }}>
                      Vui lòng chọn nhà cung cấp trước
                    </p>
                  </div>
                ) : supplierItemsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--mp-primary-600)' }} />
                    <span className="ml-2" style={{ color: 'var(--mp-text-secondary)' }}>Đang tải sản phẩm từ NCC...</span>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto overflow-x-hidden pr-1">
                    {supplierItems.length > 0 ? supplierItems.map((product) => {
                      const selected = formData.items.find(item => item.id === product.id);
                      return (
                        <motion.div
                          key={product.id}
                          whileTap={{ scale: 0.99 }}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${selected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleItemToggle(product)}
                              className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all flex-shrink-0 ${selected
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'border-gray-300 dark:border-gray-600'
                                }`}
                            >
                              {selected && <Check size={14} />}
                            </button>
                            
                            {/* Product Image */}
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                              >
                                <Package size={20} style={{ color: 'var(--mp-text-tertiary)' }} />
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-medium truncate"
                                style={{ color: 'var(--mp-text-primary)' }}
                              >
                                {product.name}
                              </p>
                              <p
                                className="text-sm"
                                style={{ color: 'var(--mp-text-secondary)' }}
                              >
                                {product.code} • {product.type} • {(product.price || 0).toLocaleString('vi-VN')}đ/{product.unit}
                              </p>
                            </div>
                            {selected && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, selected.quantity - 1); }}
                                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={selected.quantity}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center mp-input py-1"
                                  min="1"
                                />
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, selected.quantity + 1); }}
                                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Note input for selected items */}
                          {selected && (
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                              <input
                                type="text"
                                value={selected.note || ''}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleNoteChange(product.id, e.target.value)}
                                placeholder="Ghi chú cho sản phẩm này..."
                                className="mp-input w-full text-sm py-2"
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    }) : (
                      <p className="text-center py-4" style={{ color: 'var(--mp-text-tertiary)' }}>
                        Nhà cung cấp này chưa có sản phẩm nào
                      </p>
                    )}
                  </div>
                )}

                {errors.items && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertCircle size={14} />
                    {errors.items}
                  </motion.p>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--mp-bg-secondary)' }}>
                  <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Nhà cung cấp
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>
                    {selectedCompany?.name || 'Chưa chọn'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                    {selectedCompany?.address || selectedCompany?.email || ''}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--mp-text-tertiary)' }}>
                    Sản phẩm ({formData.items.length})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: 'var(--mp-bg-secondary)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate" style={{ color: 'var(--mp-text-primary)' }}>
                              {item.name}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
                              {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                          <p className="font-semibold ml-4" style={{ color: 'var(--mp-text-primary)' }}>
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                        {/* Note display */}
                        {item.note && (
                          <p className="text-sm mt-2 italic" style={{ color: 'var(--mp-text-tertiary)' }}>
                            📝 {item.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
                  <span className="text-lg" style={{ color: 'var(--mp-text-secondary)' }}>
                    Tổng giá trị ước tính
                  </span>
                  <span className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {errors.submit && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 text-center"
                  >
                    {errors.submit}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={currentStep === 0 ? () => navigate(-1) : handleBack}
          className="mp-btn mp-btn-secondary"
        >
          <ArrowLeft size={18} />
          {currentStep === 0 ? 'Hủy' : 'Quay lại'}
        </motion.button>

        {currentStep < steps.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="mp-btn mp-btn-primary mp-ripple"
          >
            Tiếp theo
            <ArrowRight size={18} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="mp-btn mp-btn-primary mp-ripple"
          >
            {createMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang gửi...
              </span>
            ) : (
              <>
                <Check size={18} />
                Gửi yêu cầu
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CreateFormWizard;
