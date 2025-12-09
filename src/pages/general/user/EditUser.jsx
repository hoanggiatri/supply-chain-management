import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "@components/general/UserForm";
import UpdatePasswordForm from "@components/general/UpdatePasswordForm";
import { getUserById, updateUser } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const EditUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId, token);
        setUser(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin người dùng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const { email } = user;

    if (!email?.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await updateUser(userId, user, token);
      toastrService.success("Cập nhật tài khoản thành công!");
      navigate(`/user/${userId}`);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi cập nhật tài khoản!"
      );
    }
  };

  if (loading) {
    return (
      <FormPageLayout
        breadcrumbItems={[
          { label: "Danh sách tài khoản", path: "/users" },
          { label: "Chỉnh sửa" },
        ]}
        backLink="/users"
      >
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </FormPageLayout>
    );
  }

  if (!user) return null;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách tài khoản", path: "/users" },
        { label: "Chỉnh sửa" },
      ]}
      backLink="/my-profile"
      backLabel="Trở lại"
    >
      <div className="flex flex-col gap-8">
        {/* Form Section */}
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>👤</span> Thông tin tài khoản
          </h2>

          <UserForm
            user={user}
            onChange={handleChange}
            errors={errors}
            role={role}
          />
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          {!showPasswordForm ? (
            <Button
              type="button"
              variant="secondary"
              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              onClick={() => setShowPasswordForm(true)}
            >
              Thay đổi mật khẩu
            </Button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/user/${userId}`)}
            >
              Hủy
            </Button>

            <Button
              type="button"
              className="font-semibold"
              onClick={handleSave}
            >
              Lưu
            </Button>
          </div>
        </div>

        {/* Password Form */}
        {showPasswordForm && (
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
            <UpdatePasswordForm
              userId={userId}
              onSuccess={() => setShowPasswordForm(false)}
            />
          </div>
        )}
      </div>
    </FormPageLayout>
  );
};

export default EditUser;
