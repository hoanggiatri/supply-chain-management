import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const registerCompany = async (data) => {
  await axios.post(`${BASE_URL}/auth/register-company`, data);
};

export const sendVerifyOtp = async (email) => {
  await axios.post(`${BASE_URL}/auth/send-verify-otp`, null, {
    params: { email },
  });
};

export const verifyOtp = async (data) => {
  await axios.post(`${BASE_URL}/auth/verify-otp`, data);
};

export const verifyForgotPasswordOtp = async (data) => {
  await axios.post(`${BASE_URL}/auth/verify-otp-forgot-password`, data);
};

export const resetPassword = async (data) => {
  await axios.post(`${BASE_URL}/auth/reset-password`, data);
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