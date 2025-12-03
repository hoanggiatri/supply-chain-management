import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  CubeIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  QrCodeIcon,
  PlusIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const companyType = localStorage.getItem("companyType");

  const quickStats = [
    {
      title: "Sản phẩm",
      value: "120",
      icon: CubeIcon,
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
      path: "/products",
    },
    {
      title: "Công lệnh SX",
      value: "5",
      icon: ClipboardDocumentListIcon,
      color: "green",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
      path: "/mos",
    },
    {
      title: "Đơn mua hàng",
      value: "8",
      icon: ShoppingCartIcon,
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
      path: "/pos",
    },
    {
      title: "Đơn bán hàng",
      value: "12",
      icon: ShoppingBagIcon,
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
      path: "/sos",
    },
  ];

  const quickActions = [
    {
      title: "Tạo hàng hóa mới",
      description: "Thêm hàng hóa vật tư vào kho",
      icon: CubeIcon,
      path: "/items",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Tạo công lệnh SX",
      description: "Lập kế hoạch sản xuất mới",
      icon: ClipboardDocumentListIcon,
      path: "/mos",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Quét mã QR",
      description: "Tra cứu thông tin sản phẩm nhanh",
      icon: QrCodeIcon,
      path: "/product/scan",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <Typography variant="h3" color="blue-gray" className="font-bold dark:text-dark-text mb-2">
          Xin chào, 
        </Typography>
        <Typography color="gray" className="font-normal dark:text-dark-muted text-lg">
          Chào mừng bạn quay trở lại hệ thống quản lý chuỗi cung ứng.
        </Typography>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
        {quickStats.map((stat, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 border border-transparent dark:border-dark-border dark:bg-dark-surface ${stat.bgColor}`}
            onClick={() => navigate(stat.path)}
          >
            <CardBody className="p-6 flex items-center justify-between">
              <div>
                <Typography variant="small" className="font-medium text-blue-gray-600 dark:text-dark-muted mb-1">
                  {stat.title}
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold dark:text-dark-text">
                  {stat.value}
                </Typography>
              </div>
              <div className={`p-3 rounded-full bg-white/60 dark:bg-white/10 ${stat.textColor}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <Typography variant="h5" color="blue-gray" className="font-bold mb-6 dark:text-dark-text">
          Thao tác nhanh
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-blue-gray-50 dark:border-dark-border dark:bg-dark-surface group"
              onClick={() => navigate(action.path)}
            >
              <CardBody className="p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color} dark:bg-opacity-10`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <Typography variant="h6" color="blue-gray" className="font-bold mb-2 dark:text-dark-text group-hover:text-blue-600 transition-colors">
                  {action.title}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal dark:text-dark-muted">
                  {action.description}
                </Typography>
                <div className="mt-4 flex items-center text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  Thực hiện ngay <ArrowRightIcon className="h-4 w-4 ml-1" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
