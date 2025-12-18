import {
  getAllCompanies,
  monthlyCompanyReport,
} from "@/services/general/CompanyService";
import { getAllUsers, monthlyUserReport } from "@/services/general/UserService";
import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  TrendingDown,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// --- Components ---

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      {trend >= 0 ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
      <span
        className={`text-sm font-medium ${
          trend >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {Math.abs(trend)}%
      </span>
      <span className="text-sm text-gray-400">vs tháng trước</span>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
    <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
    {children}
  </div>
);

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-sm">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-medium text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Page Component ---

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    companies: 0,
    newCompanies: 0,
    companyGrowth: 0,
    users: 0,
    newUsers: 0,
    userGrowth: 0,
  });

  const [chartsData, setChartsData] = useState({
    companyType: [],
    companyStatus: [],
    userRole: [],
    userStatus: [],
    monthlyGrowth: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, companyReport, usersRes, userReport] =
          await Promise.all([
            getAllCompanies(token),
            monthlyCompanyReport(token),
            getAllUsers(token),
            monthlyUserReport(token),
          ]);

        const companies = Array.isArray(companiesRes)
          ? companiesRes
          : companiesRes?.data || [];
        const users = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];

        // Calculate Stats
        const currentMonthCompanies =
          companyReport[companyReport.length - 1]?.totalQuantity || 0;
        const lastMonthCompanies =
            companyReport[companyReport.length - 2]?.totalQuantity || 0;
        
        const currentMonthUsers =
          userReport[userReport.length - 1]?.totalQuantity || 0;
        const lastMonthUsers = 
            userReport[userReport.length - 2]?.totalQuantity || 0;

        setStats({
          companies: companies.length,
          newCompanies: currentMonthCompanies,
          companyGrowth: lastMonthCompanies ? ((currentMonthCompanies - lastMonthCompanies) / lastMonthCompanies * 100).toFixed(1) : 100,
          users: users.length,
          newUsers: currentMonthUsers,
          userGrowth: lastMonthUsers ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1) : 100,
        });

        // Prepare Charts Data
        setChartsData({
          companyType: [
            {
              name: "Sản xuất",
              value: companies.filter(
                (c) => c.companyType === "Doanh nghiệp sản xuất"
              ).length,
            },
            {
              name: "Thương mại",
              value: companies.filter(
                (c) => c.companyType === "Doanh nghiệp thương mại"
              ).length,
            },
          ],
          companyStatus: [
            {
              name: "Hoạt động",
              value: companies.filter((c) => 
                ["Đang hoạt động", "active"].includes(c.status)
              ).length,
            },
            {
              name: "Ngừng HĐ",
              value: companies.filter((c) => 
                ["Ngừng hoạt động", "inactive"].includes(c.status)
              ).length,
            },
          ],
          userRole: [
            {
              name: "Sys Admin",
              value: users.filter((u) => 
                ["s-admin", "s_admin"].includes(u.role)
              ).length,
            },
            {
              name: "Comp Admin",
              value: users.filter((u) => 
                ["c-admin", "c_admin"].includes(u.role)
              ).length,
            },
            {
              name: "User",
              value: users.filter((u) => 
                !["s-admin", "s_admin", "c-admin", "c_admin"].includes(u.role)
              ).length,
            },
          ],
          monthlyGrowth: companyReport.map((c, i) => ({
            name: `T${c.month}`,
            companies: c.totalQuantity,
            users: userReport[i]?.totalQuantity || 0,
          })),
        });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 mt-1">
            Theo dõi các chỉ số quan trọng của hệ thống
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng công ty"
          value={stats.companies}
          trend={stats.companyGrowth}
          icon={Building2}
          color="bg-blue-500"
        />
        <StatCard
          title="Tổng người dùng"
          value={stats.users}
          trend={stats.userGrowth}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Công ty mới (Tháng)"
          value={stats.newCompanies}
          trend={100} // Example static trend since we check new vs nothing for simple logic
          icon={Activity}
          color="bg-purple-500"
        />
         <StatCard
          title="Người dùng mới (Tháng)"
          value={stats.newUsers}
          trend={100}
          icon={Activity}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 h-[400px]">
          <ChartCard title="Tăng trưởng hệ thống">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData.monthlyGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                <Area
                  type="monotone"
                  dataKey="companies"
                  name="Công ty mới"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCompanies)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Người dùng mới"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Company Types Pie Chart */}
        <div className="h-[400px]">
          <ChartCard title="Phân loại công ty">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ bottom: 20 }}>
                <Pie
                  data={chartsData.companyType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartsData.companyType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: "20px" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[300px]">
        <ChartCard title="Trạng thái công ty">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData.companyStatus} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} dy={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Số lượng" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>

        <div className="md:col-span-2">
            <ChartCard title="Phân quyền người dùng">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartsData.userRole} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis type="number" axisLine={false} tickLine={false} fontSize={12} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} fontSize={12} dx={-10} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" name="Số lượng" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
