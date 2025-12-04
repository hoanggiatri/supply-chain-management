import axios from "axios";
import { API_BASE_URL as BASE_URL } from "../../config/api";

export const registerCompany = async (data) => {
  await axios.post(`${BASE_URL}/auth/register`, data);
};

export const sendVerifyOtp = async (email) => {
  await axios.post(`${BASE_URL}/auth/send-verify-otp`, null, {
    params: { email },
  });
};

export const verifyOtp = async (data) => {
  await axios.post(`${BASE_URL}/auth/verify-otp`, data);
};

// Gửi email để nhận OTP quên mật khẩu
export const forgotPassword = async (email) => {
  await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
};

// Xác thực OTP quên mật khẩu (có thể cần endpoint riêng, tạm thời giữ nguyên)
export const verifyForgotPasswordOtp = async (data) => {
  await axios.post(`${BASE_URL}/auth/forgot-password`, data);
};

// Reset password sau khi đã verify OTP
export const resetPassword = async (data) => {
  await axios.post(`${BASE_URL}/auth/reset-password`, {
    email: data.email,
    newPassword: data.newPassword,
  });
};

export const login = async (data) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, data);
  return res.data;
};

export const adminLogin = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/sysadmin-login`, null, {
    params: { email, password }
  });
  return res.data;
};

export const adminVerifyOtp = async (email, otp) => {
  const res = await axios.post(`${BASE_URL}/auth/sysadmin-verify-otp`, null, {
    params: { email, otp }
  });
  return res.data;
};