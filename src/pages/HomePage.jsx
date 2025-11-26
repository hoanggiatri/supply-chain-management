import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  ChartBarIcon,
  TruckIcon,
  ShoppingCartIcon,
  CubeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

const HomePage = () => {
  const userName = localStorage.getItem("userName") || "Người dùng";
  const companyName = localStorage.getItem("companyName") || "Công ty";

  const features = [
    {
      icon: BuildingOfficeIcon,
      title: "Quản lý Công ty",
      description: "Quản lý thông tin công ty, bộ phận, nhân viên và phân quyền hệ thống một cách hiệu quả",
      color: "bg-blue-500",
    },
    {
      icon: CubeIcon,
      title: "Quản lý Sản xuất",
      description: "Theo dõi quy trình sản xuất, lệnh sản xuất và tối ưu hóa năng suất sản xuất",
      color: "bg-orange-500",
    },
    {
      icon: ShoppingCartIcon,
      title: "Quản lý Mua hàng",
      description: "Xử lý đơn mua hàng, quản lý nhà cung cấp và tối ưu chi phí mua hàng",
      color: "bg-green-500",
    },
    {
      icon: ClipboardDocumentListIcon,
      title: "Quản lý Bán hàng",
      description: "Quản lý đơn bán hàng, khách hàng và theo dõi doanh thu bán hàng",
      color: "bg-purple-500",
    },
    {
      icon: TruckIcon,
      title: "Quản lý Vận chuyển",
      description: "Theo dõi đơn vận chuyển, tối ưu tuyến đường và quản lý giao nhận",
      color: "bg-red-500",
    },
    {
      icon: ChartBarIcon,
      title: "Báo cáo & Phân tích",
      description: "Phân tích dữ liệu, tạo báo cáo và hỗ trợ ra quyết định kinh doanh",
      color: "bg-indigo-500",
    },
  ];

  const stats = [
    { label: "Mô-đun", value: "6+", color: "text-blue-500" },
    { label: "Tính năng", value: "50+", color: "text-green-500" },
    { label: "Người dùng", value: "100+", color: "text-purple-500" },
    { label: "Doanh nghiệp", value: "20+", color: "text-orange-500" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              Chào mừng trở lại, {userName}! 👋
            </Typography>
            <Typography variant="lead" className="mb-2 text-blue-100">
              {companyName}
            </Typography>
            <Typography variant="paragraph" className="text-blue-100 max-w-3xl mx-auto">
              Hệ thống quản lý chuỗi cung ứng toàn diện - Giải pháp số hóa doanh nghiệp
            </Typography>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardBody className="text-center py-6">
                  <Typography variant="h3" className={`font-bold ${stat.color}`}>
                    {stat.value}
                  </Typography>
                  <Typography variant="small" className="text-white font-medium mt-2">
                    {stat.label}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <Typography variant="h3" color="blue-gray" className="font-bold mb-4">
            Tính năng nổi bật
          </Typography>
          <Typography variant="paragraph" color="gray" className="max-w-2xl mx-auto">
            Hệ thống cung cấp đầy đủ các tính năng quản lý chuỗi cung ứng từ đầu đến cuối
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-blue-gray-100"
            >
              <CardBody className="text-center">
                <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
                  {feature.title}
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  {feature.description}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Typography variant="h3" color="blue-gray" className="font-bold mb-6">
                Về hệ thống quản lý chuỗi cung ứng
              </Typography>
              <Typography variant="paragraph" color="gray" className="mb-4">
                Hệ thống quản lý chuỗi cung ứng là giải pháp toàn diện giúp doanh nghiệp
                số hóa và tối ưu hóa toàn bộ quy trình từ sản xuất, mua hàng, bán hàng
                đến vận chuyển và phân phối.
              </Typography>
              <Typography variant="paragraph" color="gray" className="mb-4">
                Với giao diện thân thiện, dễ sử dụng và các tính năng mạnh mẽ, hệ thống
                giúp doanh nghiệp nâng cao hiệu quả hoạt động, giảm chi phí và tăng
                khả năng cạnh tranh trên thị trường.
              </Typography>
              <div className="flex gap-4 mt-8">
                <Button color="blue" size="lg">
                  Khám phá thêm
                </Button>
                <Button variant="outlined" color="blue" size="lg">
                  Hướng dẫn sử dụng
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://blog.cedarmanagement.co.uk/wp-content/uploads/2020/04/Supply-chain-blog-cover-desktop-size-15-04.png"
                alt="Supply Chain Management"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Typography variant="h3" className="font-bold mb-4">
            Sẵn sàng bắt đầu?
          </Typography>
          <Typography variant="paragraph" className="text-blue-100 mb-8">
            Khám phá các tính năng mạnh mẽ của hệ thống và tối ưu hóa chuỗi cung ứng của bạn ngay hôm nay
          </Typography>
          <Button color="white" size="lg">
            Bắt đầu ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
