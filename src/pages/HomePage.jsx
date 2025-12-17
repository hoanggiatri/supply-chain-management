import {
  ArrowRight,
  BarChart3,
  Box, Building2,
  ClipboardList,
  Factory,
  Package,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("employeeName") || "Người dùng";
  const companyName = localStorage.getItem("companyName") || "SCMS";
  const departmentName = localStorage.getItem("departmentName") || "Bộ phận";
  const role = localStorage.getItem("role") || "user";

  const features = [
    {
      icon: Building2,
      title: "Quản lý Công ty",
      description: "Quản lý thông tin công ty, bộ phận, nhân viên và phân quyền",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Factory,
      title: "Quản lý Sản xuất",
      description: "Theo dõi quy trình sản xuất và tối ưu hóa năng suất",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: ShoppingCart,
      title: "Quản lý Mua hàng",
      description: "Xử lý đơn mua hàng và quản lý nhà cung cấp",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: ClipboardList,
      title: "Quản lý Bán hàng",
      description: "Quản lý đơn bán hàng và theo dõi doanh thu",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Truck,
      title: "Quản lý Vận chuyển",
      description: "Theo dõi đơn vận chuyển và quản lý giao nhận",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      icon: BarChart3,
      title: "Báo cáo & Phân tích",
      description: "Phân tích dữ liệu và tạo báo cáo kinh doanh",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  const stats = [
    { label: "Mô-đun", value: "6+", icon: Box, bgColor: "bg-blue-50", iconColor: "text-blue-500", textColor: "text-blue-600" },
    { label: "Tính năng", value: "50+", icon: Sparkles, bgColor: "bg-green-50", iconColor: "text-green-500", textColor: "text-green-600" },
    { label: "Người dùng", value: "100+", icon: Users, bgColor: "bg-purple-50", iconColor: "text-purple-500", textColor: "text-purple-600" },
    { label: "Doanh nghiệp", value: "20+", icon: Building2, bgColor: "bg-orange-50", iconColor: "text-orange-500", textColor: "text-orange-600" },
  ];

  const quickActions = [
    { label: "Quản lý sản xuất", icon: Factory, href: "/mos", color: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { label: "Quản lý kho", icon: Package, href: "/inventory", color: "bg-gradient-to-r from-green-500 to-green-600" },
    { label: "Quản lý mua hàng", icon: ShoppingCart, href: "/pos", color: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { label: "Quản lý bán hàng", icon: ClipboardList, href: "/sos", color: "bg-gradient-to-r from-orange-500 to-orange-600" },
    { label: "Quản lý vận chuyển", icon: Truck, href: "/dos", color: "bg-gradient-to-r from-red-500 to-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">👋</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Xin chào, {userName}!
                </h1>
              </div>
              <p className="text-gray-500">
                {role === "c_admin" ? "Quản trị" : departmentName} • {companyName}
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-green-50 border border-green-100">
              <Zap className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium text-sm">Hệ thống hoạt động bình thường</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Thao tác nhanh
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.href)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl ${action.color} text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
                >
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tính năng nổi bật
            </h2>
            <p className="text-gray-500">
              Hệ thống cung cấp đầy đủ các tính năng quản lý chuỗi cung ứng từ đầu đến cuối
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Khám phá
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 md:p-10 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Về hệ thống quản lý chuỗi cung ứng
              </h2>
              <p className="text-blue-100 mb-4 leading-relaxed">
                Hệ thống quản lý chuỗi cung ứng là giải pháp toàn diện giúp doanh nghiệp
                số hóa và tối ưu hóa toàn bộ quy trình từ sản xuất, mua hàng, bán hàng
                đến vận chuyển và phân phối.
              </p>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Với giao diện thân thiện, dễ sử dụng và các tính năng mạnh mẽ, hệ thống
                giúp doanh nghiệp nâng cao hiệu quả hoạt động.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {/* Buttons removed as per user request */}
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img
                src="https://blog.cedarmanagement.co.uk/wp-content/uploads/2020/04/Supply-chain-blog-cover-desktop-size-15-04.png"
                alt="Supply Chain Management"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
