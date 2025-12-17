import {
  ArrowRight,
  BarChart3,
  Box,
  Check,
  ClipboardList,
  Package,
  Rocket,
  Shield,
  ShoppingCart,
  Star,
  Store,
  Truck,
  Wrench,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import imgcard6 from "@assets/img/card/analytic.png";
import imgcard5 from "@assets/img/card/delivery.png";
import imgcard4 from "@assets/img/card/inventory.png";
import imgcard1 from "@assets/img/card/manufacture.png";
import imgcard2 from "@assets/img/card/purchase.png";
import imgcard3 from "@assets/img/card/sale.png";

const features = [
  {
    title: "Quản lý sản xuất",
    description: "Theo dõi và tối ưu quy trình sản xuất từ nguyên liệu đến thành phẩm",
    image: imgcard1,
    icon: Wrench,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    title: "Quản lý mua hàng",
    description: "Kiểm soát nhập hàng, nhà cung cấp và đơn đặt hàng hiệu quả",
    image: imgcard2,
    icon: ShoppingCart,
    gradient: "from-green-500 to-green-600",
  },
  {
    title: "Quản lý bán hàng",
    description: "Xử lý đơn hàng, báo giá và chăm sóc khách hàng chuyên nghiệp",
    image: imgcard3,
    icon: ClipboardList,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Quản lý kho",
    description: "Theo dõi tồn kho realtime và điều chỉnh linh hoạt",
    image: imgcard4,
    icon: Store,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    title: "Quản lý vận chuyển",
    description: "Giao hàng chính xác, nhanh chóng với tracking đầy đủ",
    image: imgcard5,
    icon: Truck,
    gradient: "from-red-500 to-red-600",
  },
  {
    title: "Báo cáo & phân tích",
    description: "Thống kê dữ liệu theo thời gian thực với dashboard trực quan",
    image: imgcard6,
    icon: BarChart3,
    gradient: "from-cyan-500 to-cyan-600",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Tăng hiệu suất 60%",
    description: "Tự động hóa quy trình, giảm thời gian xử lý",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Dữ liệu realtime",
    description: "Theo dõi tình trạng mọi lúc mọi nơi",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Shield,
    title: "Bảo mật cao",
    description: "Mã hóa dữ liệu và phân quyền chặt chẽ",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Box,
    title: "Dễ tích hợp",
    description: "Kết nối với các hệ thống ERP, CRM",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

const DefaultPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">SCMS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tính năng</a>
            <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Lợi ích</a>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Giải pháp quản lý chuỗi cung ứng #1
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Hệ Thống Quản Lý{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Chuỗi Cung Ứng
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Giải pháp toàn diện giúp doanh nghiệp tối ưu hóa quản lý sản xuất,
                mua hàng, bán hàng, kho và vận chuyển trong một nền tảng duy nhất.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/register")}
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Rocket className="w-5 h-5" />
                  Bắt đầu miễn phí
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* Demo button removed as per user request */}
              </div>
              
              {/* Trust Badges */}
              <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">20+</div>
                  <div className="text-sm text-gray-500">Doanh nghiệp</div>
                </div>
                <div className="w-px h-10 bg-gray-300" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">100+</div>
                  <div className="text-sm text-gray-500">Người dùng</div>
                </div>
                <div className="w-px h-10 bg-gray-300" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">99.9%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right - Feature Preview */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <img
                  src={imgcard1}
                  alt="SCMS Preview"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                
                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Đơn hàng hôm nay</div>
                      <div className="text-2xl font-bold text-gray-800">1,234</div>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
                      +12.5%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tất cả các công cụ bạn cần để quản lý chuỗi cung ứng hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lợi Ích Khi Sử Dụng
            </h2>
            <p className="text-blue-100 text-lg">
              Những giá trị mà chúng tôi mang lại cho doanh nghiệp của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative text-center py-16 px-8 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Sẵn Sàng Bắt Đầu?
              </h2>
              <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
                Đăng ký ngay hôm nay để trải nghiệm hệ thống quản lý chuỗi cung ứng
                hiện đại và hiệu quả nhất
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  <Rocket className="w-5 h-5" />
                  Đăng ký miễn phí
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 rounded-xl border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Đã có tài khoản? Đăng nhập
                </button>
              </div>
              
              {/* Features List */}
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-300" />
                  Miễn phí dùng thử
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-300" />
                  Không cần thẻ tín dụng
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-300" />
                  Hỗ trợ 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">SCMS</span>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2025 Hệ Thống Quản Lý Chuỗi Cung Ứng. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DefaultPage;
