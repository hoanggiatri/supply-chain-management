import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import MonthlyBarChart from "@/components/content-components/MonthlyBarChart";
import {
  getMonthlyPurchaseReport,
  getPurchaseReport,
} from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import Breadcrumbs from "@/components/marketplace/Breadcrumbs";

const PurchaseReportMarketplace = () => {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();

  const [monthlyData, setMonthlyData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState("totalQuantity");

  const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  };

  const getEndOfDay = (date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
  };

  const [startDate, setStartDate] = useState(getStartOfMonth());
  const [endDate, setEndDate] = useState(new Date());
  const [search, setSearch] = useState("");

  const toLocalDateTimeString = (localDateTimeString) => {
    if (!localDateTimeString) return null;
    return dayjs(localDateTimeString).format("YYYY-MM-DDTHH:mm:ss");
  };

  const formatDateLocal = (date) => {
    if (!date) return "";
    return dayjs(date).format("YYYY-MM-DD");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [monthly, detail] = await Promise.all([
          getMonthlyPurchaseReport(companyId, token),
          getPurchaseReport(
            {
              startDate: toLocalDateTimeString(startDate),
              endDate: toLocalDateTimeString(getEndOfDay(endDate)),
            },
            companyId,
            token
          ),
        ]);

        setMonthlyData(monthly || []);
        setTableData(detail || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi tải báo cáo mua hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchData();
    }
  }, [companyId, token, startDate, endDate]);

  const filteredItems = tableData.filter(
    (item) =>
      (item.itemCode?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (item.itemName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const metricLabels = {
    totalQuantity: { label: "Tổng số lượng hàng hóa", color: "#05518B" },
    totalOrder: { label: "Số đơn mua hàng", color: "#FAAD14" },
    totalAmount: { label: "Tổng giá trị đơn hàng", color: "#389E0D" },
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-2" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Typography variant="h4" color="blue-gray" className="font-bold">
          BÁO CÁO MUA HÀNG
        </Typography>
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={() => navigate("/marketplace/pos")}
        >
          Xem đơn mua hàng
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardBody className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="date"
                label="Từ ngày"
                value={formatDateLocal(startDate)}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="date"
                label="Đến ngày"
                value={formatDateLocal(endDate)}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <Select
                label="Loại biểu đồ"
                value={chartMetric}
                onChange={(val) => setChartMetric(val)}
              >
                {Object.entries(metricLabels).map(([key, val]) => (
                  <Option key={key} value={key}>
                    {val.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <Input
                label="Tìm kiếm hàng hóa"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Chart */}
      {loading ? (
        <Card className="shadow-lg">
          <CardBody className="p-12">
            <div className="flex items-center justify-center">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardBody className="p-6">
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-4 font-semibold"
            >
              {metricLabels[chartMetric].label} theo tháng
            </Typography>
            <MonthlyBarChart
              data={monthlyData}
              metric={chartMetric}
              label={metricLabels[chartMetric].label}
              color={metricLabels[chartMetric].color}
            />
          </CardBody>
        </Card>
      )}

      {/* Summary Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg border-l-4 border-l-blue-600">
            <CardBody className="p-6">
              <Typography
                variant="small"
                color="gray"
                className="mb-2 font-medium"
              >
                Tổng số lượng mua
              </Typography>
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {formatNumber(
                  filteredItems.reduce(
                    (sum, item) => sum + (item.totalQuantity || 0),
                    0
                  )
                )}
              </Typography>
            </CardBody>
          </Card>
          <Card className="shadow-lg border-l-4 border-l-amber-500">
            <CardBody className="p-6">
              <Typography
                variant="small"
                color="gray"
                className="mb-2 font-medium"
              >
                Số loại hàng hóa
              </Typography>
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {formatNumber(filteredItems.length)}
              </Typography>
            </CardBody>
          </Card>
          <Card className="shadow-lg border-l-4 border-l-green-600">
            <CardBody className="p-6">
              <Typography
                variant="small"
                color="gray"
                className="mb-2 font-medium"
              >
                Tổng giá trị
              </Typography>
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {formatCurrency(
                  filteredItems.reduce(
                    (sum, item) => sum + (item.totalAmount || 0),
                    0
                  )
                )}
              </Typography>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Table */}
      <Card className="shadow-lg">
        <CardBody className="p-6">
          <Typography
            variant="h6"
            color="blue-gray"
            className="mb-4 font-semibold"
          >
            Chi tiết hàng hóa mua
          </Typography>

          {(() => {
            if (loading) {
              return (
                <div className="flex items-center justify-center py-12">
                  <Spinner className="h-12 w-12" color="blue" />
                </div>
              );
            }
            if (filteredItems.length === 0) {
              const emptyMessage = search
                ? "Không tìm thấy hàng hóa phù hợp với từ khóa tìm kiếm"
                : "Chưa có dữ liệu mua hàng trong khoảng thời gian này";
              return (
                <div className="text-center py-12">
                  <Typography color="gray" className="mb-2">
                    Không có dữ liệu
                  </Typography>
                  <Typography variant="small" color="gray">
                    {emptyMessage}
                  </Typography>
                </div>
              );
            }
            return (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Mã hàng hóa
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Tên hàng hóa
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Tổng số lượng
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Tổng giá trị
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr
                        key={item.itemId || index}
                        className="hover:bg-blue-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item.itemCode || "—"}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {item.itemName || "—"}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {formatNumber(item.totalQuantity || 0)}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {formatCurrency(item.totalAmount || 0)}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </CardBody>
      </Card>
    </div>
  );
};

export default PurchaseReportMarketplace;
