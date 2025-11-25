import PublicRoute from "../PublicRoute";

import DefaultPage from "@pages/DefaultPage";

import Register from "@pages/authentication/Register";
import OtpVerification from "@pages/authentication/OtpVerification";
import Login from "@pages/authentication/Login";
import ForgotPassword from "@pages/authentication/ForgotPassword";
import OtpForgotPassword from "@pages/authentication/OtpForgotPassword";
import ResetPassword from "@pages/authentication/ResetPassword";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminVerifyOtp from "@/pages/admin/AdminVerifyOtp";

const publicRoutes = [
  { path: "/", element: <DefaultPage /> },
  { path: "/register", element: <PublicRoute element={<Register />} /> },
  {
    path: "/otp-verification",
    element: <PublicRoute element={<OtpVerification />} />,
  },
  { path: "/login", element: <PublicRoute element={<Login />} /> },
  {
    path: "/forgot-password",
    element: <PublicRoute element={<ForgotPassword />} />,
  },
  {
    path: "/verify-forgot-password-otp",
    element: <PublicRoute element={<OtpForgotPassword />} />,
  },
  {
    path: "/reset-password",
    element: <PublicRoute element={<ResetPassword />} />,
  },
  {
    path: "/login-admin",
    element: (
      <PublicRoute element={<AdminLogin />} redirectPath="/admin/dashboard" />
    ),
  },
  { path: "/admin-verify-otp/:email", element: <AdminVerifyOtp /> },
];

export default publicRoutes;

