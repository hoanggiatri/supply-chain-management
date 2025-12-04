import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import DashboardMetricCard from "@/components/marketplace/DashboardMetricCard";
import SkeletonLoader from "@/components/marketplace/SkeletonLoader";
import Breadcrumbs from "@/components/marketplace/Breadcrumbs";

// Simple placeholder data for now – can be wired to real APIs later
const mockMetrics = [
  {
    key: "rfq",
    label: "Tổng yêu cầu báo giá",
    value: "24",
    trend: "up",
    trendValue: "+12% so với tuần trước",
    icon: "📝",
    iconBg: "bg-purple-500",
  },
  {
    key: "quotation",
    label: "Báo giá đang chờ duyệt",
    value: "8",
    trend: "down",
    trendValue: "-5% so với tuần trước",
    icon: "💰",
    iconBg: "bg-amber-500",
  },
  {
    key: "orders",
    label: "Đơn hàng đang xử lý",
    value: "15",
    trend: "up",
    trendValue: "+7% so với tuần trước",
    icon: "📦",
    iconBg: "bg-blue-500",
  },
  {
    key: "revenue",
    label: "Doanh thu tháng này",
    value: "1.2B VNĐ",
    trend: "up",
    trendValue: "+18% so với tháng trước",
    icon: "📈",
    iconBg: "bg-green-500",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleMetricClick = (key) => {
    switch (key) {
      case "rfq":
        navigate("/marketplace/rfqs");
        break;
      case "quotation":
        navigate("/marketplace/quotations");
        break;
      case "orders":
        // Mặc định chuyển tới đơn mua hàng
        navigate("/marketplace/pos");
        break;
      case "revenue":
      default:
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-2" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Typography variant="h4" className="text-blue-gray-900 font-bold">
            Marketplace Dashboard
          </Typography>
          <Typography variant="small" className="text-blue-gray-500 mt-1">
            Tổng quan nhanh về RFQ, báo giá và đơn hàng của bạn.
          </Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            color="blue"
            size="sm"
            onClick={() => navigate("/marketplace/create-rfq")}
          >
            Tạo RFQ mới
          </Button>
          <Button
            variant="outlined"
            color="blue"
            size="sm"
            onClick={() => navigate("/marketplace/supplier-search")}
          >
            Tìm nhà cung cấp
          </Button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((m) => (
          <DashboardMetricCard
            key={m.key}
            icon={m.icon}
            iconBg={m.iconBg}
            label={m.label}
            value={m.value}
            trend={m.trend}
            trendValue={m.trendValue}
            onClick={() => handleMetricClick(m.key)}
          />
        ))}
      </div>

      {/* Trend chart placeholder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="text-blue-gray-900 font-semibold">
            Xu hướng đơn hàng theo thời gian
          </Typography>
          <Typography variant="small" className="text-blue-gray-500">
            Đang chuẩn bị dữ liệu biểu đồ thực tế
          </Typography>
        </div>
        <SkeletonLoader variant="chart" />
      </Card>

      {/* Recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <Typography
            variant="h6"
            className="text-blue-gray-900 font-semibold mb-4"
          >
            Hoạt động gần đây
          </Typography>
          <SkeletonLoader variant="list" count={4} />
        </Card>

        <Card className="p-6">
          <Typography
            variant="h6"
            className="text-blue-gray-900 font-semibold mb-4"
          >
            Hành động nhanh
          </Typography>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outlined"
              color="blue"
              onClick={() => navigate("/marketplace/create-rfq")}
            >
              Tạo RFQ
            </Button>
            <Button
              variant="outlined"
              color="blue"
              onClick={() => navigate("/marketplace/customer-quotations")}
            >
              Xem báo giá từ NCC
            </Button>
            <Button
              variant="outlined"
              color="blue"
              onClick={() => navigate("/marketplace/pos")}
            >
              Đơn mua hàng
            </Button>
            <Button
              variant="outlined"
              color="blue"
              onClick={() => navigate("/marketplace/sos")}
            >
              Đơn bán hàng
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
