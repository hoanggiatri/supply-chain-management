import React from "react";
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardHeader,
  Carousel,
} from "@material-tailwind/react";
import {
  RocketLaunchIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  CubeIcon,
  TruckIcon,
  ShoppingCartIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

import imgcard1 from "@assets/img/card/manufacture.png";
import imgcard2 from "@assets/img/card/purchase.png";
import imgcard3 from "@assets/img/card/sale.png";
import imgcard4 from "@assets/img/card/inventory.png";
import imgcard5 from "@assets/img/card/delivery.png";
import imgcard6 from "@assets/img/card/analytic.png";

const features = [
  {
    title: "Quản lý sản xuất",
    description: "Theo dõi và tối ưu quy trình sản xuất từ nguyên liệu đến thành phẩm",
    image: imgcard1,
    icon: WrenchScrewdriverIcon,
    color: "blue",
  },
  {
    title: "Quản lý mua hàng",
    description: "Kiểm soát nhập hàng, nhà cung cấp và đơn đặt hàng hiệu quả",
    image: imgcard2,
    icon: ShoppingCartIcon,
    color: "green",
  },
  {
    title: "Quản lý bán hàng",
    description: "Xử lý đơn hàng, báo giá và chăm sóc khách hàng chuyên nghiệp",
    image: imgcard3,
    icon: ClipboardDocumentListIcon,
    color: "purple",
  },
  {
    title: "Quản lý kho",
    description: "Theo dõi tồn kho realtime và điều chỉnh linh hoạt",
    image: imgcard4,
    icon: BuildingStorefrontIcon,
    color: "orange",
  },
  {
    title: "Quản lý vận chuyển",
    description: "Giao hàng chính xác, nhanh chóng với tracking đầy đủ",
    image: imgcard5,
    icon: TruckIcon,
    color: "red",
  },
  {
    title: "Báo cáo & phân tích",
    description: "Thống kê dữ liệu theo thời gian thực với dashboard trực quan",
    image: imgcard6,
    icon: ChartBarIcon,
    color: "cyan",
  },
];

const benefits = [
  {
    icon: BoltIcon,
    title: "Tăng hiệu suất",
    description: "Tự động hóa quy trình, giảm thời gian xử lý đơn hàng lên đến 60%",
  },
  {
    icon: ChartBarIcon,
    title: "Dữ liệu realtime",
    description: "Theo dõi tình trạng chuỗi cung ứng mọi lúc mọi nơi",
  },
  {
    icon: ShieldCheckIcon,
    title: "Bảo mật cao",
    description: "Mã hóa dữ liệu và phân quyền người dùng chặt chẽ",
  },
  {
    icon: CubeIcon,
    title: "Dễ tích hợp",
    description: "Kết nối dễ dàng với các hệ thống ERP, CRM hiện có",
  },
];

const carouselImages = [
  { image: imgcard1, title: "Sản xuất thông minh" },
  { image: imgcard4, title: "Quản lý kho hiện đại" },
  { image: imgcard6, title: "Phân tích dữ liệu" },
];

const DefaultPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Typography
              variant="h1"
              color="blue-gray"
              className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Hệ Thống Quản Lý{" "}
              <span className="text-blue-600">Chuỗi Cung Ứng</span>
            </Typography>
            <Typography
              variant="lead"
              className="mb-8 text-gray-600 text-lg md:text-xl"
            >
              Giải pháp toàn diện giúp doanh nghiệp tối ưu hóa quản lý sản xuất,
              mua hàng, bán hàng, kho và vận chuyển trong một nền tảng duy nhất.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                color="blue"
                className="flex items-center gap-3 justify-center"
                onClick={() => navigate("/register")}
              >
                <RocketLaunchIcon className="h-5 w-5" />
                Bắt đầu ngay
              </Button>
              <Button
                size="lg"
                variant="outlined"
                color="blue"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="w-full">
            <Carousel
              className="rounded-xl shadow-2xl"
              navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                  {new Array(length).fill("").map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                        activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                      }`}
                      onClick={() => setActiveIndex(i)}
                    />
                  ))}
                </div>
              )}
            >
              {carouselImages.map((item, index) => (
                <div key={index} className="relative h-96">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-end">
                    <Typography
                      variant="h3"
                      color="white"
                      className="p-6 font-bold"
                    >
                      {item.title}
                    </Typography>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Tính Năng Nổi Bật
            </Typography>
            <Typography variant="lead" color="gray" className="max-w-3xl mx-auto">
              Tất cả các công cụ bạn cần để quản lý chuỗi cung ứng hiệu quả
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader
                    floated={false}
                    className="h-56 relative overflow-hidden"
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                      {feature.title}
                    </Typography>
                    <Typography color="gray">{feature.description}</Typography>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Typography variant="h2" color="white" className="mb-4">
              Lợi Ích Khi Sử Dụng
            </Typography>
            <Typography variant="lead" color="white" className="opacity-90">
              Những giá trị mà chúng tôi mang lại cho doanh nghiệp của bạn
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-lg border border-white/20"
                >
                  <CardBody className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <Typography variant="h5" color="white" className="mb-2">
                      {benefit.title}
                    </Typography>
                    <Typography color="white" className="opacity-80">
                      {benefit.description}
                    </Typography>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h2" color="blue-gray" className="mb-4">
            Sẵn Sàng Bắt Đầu?
          </Typography>
          <Typography variant="lead" color="gray" className="mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để trải nghiệm hệ thống quản lý chuỗi cung ứng
            hiện đại và hiệu quả nhất
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              color="blue"
              className="flex items-center gap-3 justify-center"
              onClick={() => navigate("/register")}
            >
              <RocketLaunchIcon className="h-5 w-5" />
              Đăng ký miễn phí
            </Button>
            <Button
              size="lg"
              variant="text"
              color="blue"
              onClick={() => navigate("/login")}
            >
              Đã có tài khoản? Đăng nhập
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="small" className="opacity-80">
            © 2025 Hệ Thống Quản Lý Chuỗi Cung Ứng. All rights reserved.
          </Typography>
        </div>
      </footer>
    </div>
  );
};

export default DefaultPage;
