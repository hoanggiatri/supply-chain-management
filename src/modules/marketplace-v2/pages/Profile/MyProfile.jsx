import { getEmployeeById, updateEmployee, updateEmployeeAvatar } from '@/services/general/EmployeeService';
import { getUserByEmployeeId, updatePassword, updateUser } from '@/services/general/UserService';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Briefcase,
    Building2,
    Calendar,
    Camera,
    Edit3,
    Key,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * My Profile Page
 * Shows user and employee information with edit and logout functionality
 */
const MyProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');

  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [accountForm, setAccountForm] = useState({});
  const [employeeForm, setEmployeeForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Avatar upload
  const fileInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Ref to prevent duplicate API calls in Strict Mode
  const hasFetched = useRef(false);

  // Helper function to format gender
  const formatGender = (gender) => {
    if (!gender) return '--';
    return gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác';
  };

  // Fetch user and employee data
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetched.current) return;
    
    const fetchData = async () => {
      if (!employeeId || !token) {
        setIsLoading(false);
        return;
      }
      hasFetched.current = true;
      try {
        // Fetch employee data
        const employeeData = await getEmployeeById(employeeId, token);
        if (employeeData.avatar) {
          employeeData.avatar = `${employeeData.avatar}?t=${Date.now()}`;
        }
        setEmployee({
          ...employeeData,
          gender: employeeData.gender || '',
          address: employeeData.address || '',
          phoneNumber: employeeData.phoneNumber || '',
          dateOfBirth: employeeData.dateOfBirth || '',
        });
        setEmployeeForm({
          employeeName: employeeData.employeeName || '',
          gender: employeeData.gender || '',
          dateOfBirth: employeeData.dateOfBirth || '',
          phoneNumber: employeeData.phoneNumber || '',
          address: employeeData.address || '',
          position: employeeData.position || '',
        });

        // Fetch user data
        const userData = await getUserByEmployeeId(employeeId, token);
        setUser(userData);
        setAccountForm({
          email: userData.email || '',
          username: userData.username || ''
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [employeeId, token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  // Handle save account
  const handleSaveAccount = async () => {
    if (!user?.userId) return;
    setIsSaving(true);
    try {
      await updateUser(user.userId, accountForm, token);
      setUser(prev => ({ ...prev, ...accountForm }));
      setIsEditingAccount(false);
      toast.success('Cập nhật tài khoản thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle save employee
  const handleSaveEmployee = async () => {
    if (!employee?.id) return;
    setIsSaving(true);
    try {
      await updateEmployee(employee.id, employeeForm, token);
      setEmployee(prev => ({ ...prev, ...employeeForm }));
      setIsEditingEmployee(false);
      // Update localStorage with new name
      if (employeeForm.employeeName) {
        localStorage.setItem('employeeName', employeeForm.employeeName);
      }
      toast.success('Cập nhật thông tin nhân viên thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !employee?.id) return;

    setIsUploadingAvatar(true);
    try {
      await updateEmployeeAvatar(employee.id, file, token);
      // Refresh avatar
      const updatedEmployee = await getEmployeeById(employeeId, token);
      setEmployee(prev => ({
        ...prev,
        avatar: `${updatedEmployee.avatar}?t=${Date.now()}`
      }));
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể tải lên ảnh');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setIsChangingPassword(true);
    try {
      await updatePassword(user.userId, {
        password: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, token);
      toast.success('Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Mật khẩu hiện tại không đúng');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-lg flex items-center gap-2" style={{ color: 'var(--mp-text-primary)' }}>
                  <Key size={20} className="text-blue-500" />
                  Đổi mật khẩu
                </h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="mp-input w-full"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="mp-input w-full"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-secondary)' }}>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="mp-input w-full"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? 'Đang lưu...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--mp-text-primary)' }}>
            <User size={28} />
            Hồ sơ của tôi
          </h1>
          <p className="text-sm" style={{ color: 'var(--mp-text-secondary)' }}>
            Quản lý thông tin cá nhân và tài khoản
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
        >
          <LogOut size={18} />
          Đăng xuất
        </motion.button>
      </motion.div>

      {/* Avatar & Basic Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 shadow-xl" style={{ borderColor: 'var(--mp-primary-500)' }}>
              {employee?.avatar ? (
                <img
                  src={employee.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--mp-primary-500), var(--mp-secondary-500))'
                  }}
                >
                  {employee?.employeeName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isUploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={16} className="text-gray-500" />
              )}
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
              {employee?.employeeName || 'Người dùng'}
            </h2>
            <p className="text-sm flex items-center justify-center sm:justify-start gap-2 mt-1" style={{ color: 'var(--mp-text-secondary)' }}>
              <Briefcase size={14} />
              {employee?.position || 'N/A'}
            </p>
            <p className="text-sm flex items-center justify-center sm:justify-start gap-2 mt-1" style={{ color: 'var(--mp-text-secondary)' }}>
              <Shield size={14} />
              {localStorage.getItem('role') || 'User'}
            </p>
            <p className="text-sm flex items-center justify-center sm:justify-start gap-2 mt-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Building2 size={14} />
              {employee?.departmentName || localStorage.getItem('departmentName') || 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Employee Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg" style={{ color: 'var(--mp-text-primary)' }}>Thông tin nhân viên</h3>
          {!isEditingEmployee ? (
            <button
              onClick={() => setIsEditingEmployee(true)}
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Edit3 size={16} />
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingEmployee(false)}
                className="px-3 py-1.5 text-sm rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEmployee}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <User size={14} className="inline mr-1" />
              Họ và tên
            </label>
            {isEditingEmployee ? (
              <input
                type="text"
                value={employeeForm.employeeName || ''}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, employeeName: e.target.value }))}
                className="mp-input w-full"
              />
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{employee?.employeeName || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              Giới tính
            </label>
            {isEditingEmployee ? (
              <select
                value={employeeForm.gender || ''}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, gender: e.target.value }))}
                className="mp-input w-full"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{formatGender(employee?.gender)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Calendar size={14} className="inline mr-1" />
              Ngày sinh
            </label>
            {isEditingEmployee ? (
              <input
                type="date"
                value={employeeForm.dateOfBirth || ''}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="mp-input w-full"
              />
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{employee?.dateOfBirth || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Phone size={14} className="inline mr-1" />
              Số điện thoại
            </label>
            {isEditingEmployee ? (
              <input
                type="tel"
                value={employeeForm.phoneNumber || ''}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="mp-input w-full"
              />
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{employee?.phoneNumber || 'N/A'}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <MapPin size={14} className="inline mr-1" />
              Địa chỉ
            </label>
            {isEditingEmployee ? (
              <input
                type="text"
                value={employeeForm.address || ''}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, address: e.target.value }))}
                className="mp-input w-full"
              />
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{employee?.address || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Briefcase size={14} className="inline mr-1" />
              Chức vụ
            </label>
            {isEditingEmployee ? (
              <input
                type="text"
                value={employeeForm.position || ''}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                className="mp-input w-full"
              />
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{employee?.position || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Building2 size={14} className="inline mr-1" />
              Phòng ban
            </label>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{employee?.departmentName || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              Mã nhân viên
            </label>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{employee?.employeeCode || 'N/A'}</p>
          </div>
        </div>
      </motion.div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mp-glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg" style={{ color: 'var(--mp-text-primary)' }}>Thông tin tài khoản</h3>
          {!isEditingAccount ? (
            <button
              onClick={() => setIsEditingAccount(true)}
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Edit3 size={16} />
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingAccount(false)}
                className="px-3 py-1.5 text-sm rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAccount}
                disabled={isSaving}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <User size={14} className="inline mr-1" />
              Tên đăng nhập
            </label>
            {isEditingAccount ? (
              <input
                type="text"
                value={accountForm.username || ''}
                onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                className="mp-input w-full"
              />
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{user?.username || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Mail size={14} className="inline mr-1" />
              Email
            </label>
            {isEditingAccount ? (
              <input
                type="email"
                value={accountForm.email || ''}
                onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                className="mp-input w-full"
              />
            ) : (
              <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{user?.email || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Shield size={14} className="inline mr-1" />
              Vai trò
            </label>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{localStorage.getItem('role') || 'N/A'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              Trạng thái
            </label>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {user?.status === 'active' ? 'Đang hoạt động' : user?.status || 'N/A'}
            </span>
          </div>
        </div>

        {/* Change Password Button */}
        <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            <Key size={16} />
            Đổi mật khẩu
          </button>
        </div>
      </motion.div>

      {/* Company Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mp-glass-card p-6"
      >
        <h3 className="font-semibold text-lg mb-4" style={{ color: 'var(--mp-text-primary)' }}>Thông tin công ty</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>Tên công ty</label>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              {localStorage.getItem('companyName') || 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>Loại công ty</label>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              {localStorage.getItem('companyType') || 'N/A'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>Địa chỉ công ty</label>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              {localStorage.getItem('companyAddress') || 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
