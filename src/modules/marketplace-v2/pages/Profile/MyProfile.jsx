import { getUserByEmployeeId, updatePassword, updateUser } from '@/services/general/UserService';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  Camera,
  Edit3,
  Key,
  LogOut,
  Mail,
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
 * Shows user information with edit and logout functionality
 */
const MyProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Ref to prevent duplicate API calls in Strict Mode
  const hasFetched = useRef(false);

  // Fetch user data
  useEffect(() => {
    // Prevent duplicate calls
    if (hasFetched.current) return;
    
    const fetchUser = async () => {
      if (!employeeId || !token) {
        setIsLoading(false);
        return;
      }
      hasFetched.current = true;
      try {
        const data = await getUserByEmployeeId(employeeId, token);
        setUser(data);
        setEditForm({
          email: data.email || '',
          username: data.username || ''
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Không thể tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [employeeId, token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!user?.userId) return;
    setIsSaving(true);
    try {
      await updateUser(user.userId, editForm, token);
      setUser(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
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
    <div className="max-w-3xl mx-auto space-y-6">
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
            Quản lý thông tin tài khoản
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

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mp-glass-card p-6"
      >
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b" style={{ borderColor: 'var(--mp-border-light)' }}>
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--mp-primary-500), var(--mp-secondary-500))'
              }}
            >
              {user?.employeeName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Camera size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold" style={{ color: 'var(--mp-text-primary)' }}>
              {localStorage.getItem('employeeName') || 'Người dùng'}
            </h2>
            <p className="text-sm flex items-center justify-center sm:justify-start gap-2 mt-1" style={{ color: 'var(--mp-text-secondary)' }}>
              <Shield size={14} />
              {localStorage.getItem('role') || 'User'}
            </p>
            <p className="text-sm flex items-center justify-center sm:justify-start gap-2 mt-1" style={{ color: 'var(--mp-text-tertiary)' }}>
              <Building2 size={14} />
              {localStorage.getItem('departmentName') || 'N/A'}
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: 'var(--mp-text-primary)' }}>Thông tin tài khoản</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Edit3 size={16} />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-sm rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveProfile}
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
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
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
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="mp-input w-full"
                />
              ) : (
                <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>{user?.email || 'N/A'}</p>
              )}
            </div>
          </div>

          {/* Change Password Button */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--mp-border-light)' }}>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Key size={16} />
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </motion.div>

      {/* Additional Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mp-glass-card p-6"
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--mp-text-primary)' }}>Thông tin công ty</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--mp-text-tertiary)' }}>Phòng ban</label>
            <p className="font-medium" style={{ color: 'var(--mp-text-primary)' }}>
              {user?.departmentName || localStorage.getItem('departmentName') || 'N/A'}
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
