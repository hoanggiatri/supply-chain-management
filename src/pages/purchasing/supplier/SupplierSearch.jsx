import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography,
  Button,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getAllCompanies } from "@/services/general/CompanyService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const PAGE_SIZE = 12;

const SupplierSearch = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const companyId = Number(localStorage.getItem("companyId"));
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem đang ở marketplace context hay không
  const isMarketplaceContext = location.pathname.startsWith("/marketplace/");

  const fetchSuppliers = async (pageToLoad = 1) => {
    setLoading(true);
    try {
      const data = await getAllCompanies(token, {
        page: pageToLoad,
        pageSize: PAGE_SIZE,
      });

      const list = Array.isArray(data?.data) ? data.data : [];
      const filtered = list.filter(
        (company) => Number(company.id) !== Number(companyId)
      );

      setSuppliers(filtered);

      const keyword = searchSupplier.trim().toLowerCase();
      if (keyword) {
        const clientFiltered = filtered.filter((supplier) =>
          Object.values({
            companyName: supplier.companyName,
            companyCode: supplier.companyCode,
            taxCode: supplier.taxCode,
            mainIndustry: supplier.mainIndustry,
            representativeName: supplier.representativeName,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
          }).some((field) =>
            String(field || "")
              .toLowerCase()
              .includes(keyword)
          )
        );
        setFilteredSuppliers(clientFiltered);
      } else {
        setFilteredSuppliers(filtered);
      }

      setHasMore(list.length === PAGE_SIZE);
      setPage(pageToLoad);
    } catch (err) {
      toastrService.error("Lỗi khi tải nhà cung cấp!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, token]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchSupplier(value);

    const keyword = value.trim().toLowerCase();
    if (!keyword) {
      setFilteredSuppliers(suppliers);
      return;
    }

    const filtered = suppliers.filter((supplier) =>
      Object.values({
        companyName: supplier.companyName,
        companyCode: supplier.companyCode,
        taxCode: supplier.taxCode,
        mainIndustry: supplier.mainIndustry,
        representativeName: supplier.representativeName,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      }).some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(keyword)
      )
    );

    setFilteredSuppliers(filtered);
  };

  const handlePrevious = () => {
    if (page > 1) {
      fetchSuppliers(page - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      fetchSuppliers(page + 1);
    }
  };

  const getInitials = (name) => {
    if (!name) return "NC";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography variant="h4" color="blue-gray" className="font-bold">
                TÌM KIẾM NHÀ CUNG CẤP
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="mt-1 font-normal"
              >
                Tìm kiếm và chọn nhà cung cấp từ danh sách các công ty trong hệ
                thống.
              </Typography>
            </div>
            <div className="w-full md:w-80">
              <Input
                color="blue"
                size="lg"
                label="Tìm kiếm nhà cung cấp"
                className="w-full placeholder:opacity-100"
                value={searchSupplier}
                onChange={handleSearch}
                icon={
                  <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-400" />
                }
              />
            </div>
          </div>

          {loading ? (
            <Typography color="gray" className="text-center">
              Đang tải danh sách nhà cung cấp...
            </Typography>
          ) : filteredSuppliers.length === 0 ? (
            <Typography color="gray" className="text-center">
              Không tìm thấy nhà cung cấp nào.
            </Typography>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => {
                const logoUrl = supplier.logoUrl || supplier.logo;
                const mainIndustry =
                  supplier.mainIndustry || "Chưa cập nhật ngành nghề";

                return (
                  <button
                    key={supplier.id}
                    type="button"
                    onClick={() => {
                      const supplierPath = isMarketplaceContext
                        ? `/marketplace/supplier/${supplier.id}`
                        : `/supplier/${supplier.id}`;
                      navigate(supplierPath);
                    }}
                    className="text-left"
                  >
                    <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardBody>
                        <div className="flex items-center gap-4">
                          {/* Logo / Avatar */}
                          <div className="h-16 w-16 rounded-full bg-blue-gray-50 flex items-center justify-center overflow-hidden border border-blue-gray-100 shadow-sm">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={supplier.companyName}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  // Fallback to initials if logo lỗi
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <Typography
                                variant="h6"
                                className="font-bold text-blue-600"
                              >
                                {getInitials(supplier.companyName)}
                              </Typography>
                            )}
                          </div>

                          {/* Company name + main industry */}
                          <div className="space-y-1">
                            <Typography
                              variant="h6"
                              color="blue-gray"
                              className="font-semibold line-clamp-2"
                            >
                              {supplier.companyName}
                            </Typography>
                            <Typography
                              variant="small"
                              className="text-blue-gray-500 line-clamp-1"
                            >
                              {mainIndustry}
                            </Typography>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </button>
                );
              })}
            </div>
          )}
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 px-6 py-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Trang {page}
          </Typography>
          <div className="flex gap-2">
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              size="sm"
              disabled={page === 1}
              onClick={handlePrevious}
            >
              Trang trước
            </Button>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              size="sm"
              disabled={!hasMore}
              onClick={handleNext}
            >
              Trang sau
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SupplierSearch;
