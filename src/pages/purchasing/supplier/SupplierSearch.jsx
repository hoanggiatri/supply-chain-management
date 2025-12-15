import ListPageLayout from "@/components/layout/ListPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllCompanies } from "@/services/general/CompanyService";
import toastrService from "@/services/toastrService";
import { Building2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <ListPageLayout
      breadcrumbs="Nhà cung cấp"
      title="Tìm kiếm nhà cung cấp"
    >
      {/* Search */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-500">
          Tìm kiếm và chọn nhà cung cấp từ danh sách các công ty trong hệ thống.
        </p>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm nhà cung cấp..."
            className="pl-10"
            value={searchSupplier}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">
          Đang tải danh sách nhà cung cấp...
        </p>
      ) : filteredSuppliers.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          Không tìm thấy nhà cung cấp nào.
        </p>
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
                className="text-left w-full"
              >
                <div className="h-full p-4 border border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200">
                  <div className="flex items-center gap-4">
                    {/* Logo / Avatar */}
                    <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={supplier.companyName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-blue-600" />
                      )}
                    </div>

                    {/* Company name + main industry */}
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {supplier.companyName}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {mainIndustry}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-2 py-4 mt-6">
        <p className="text-sm text-gray-500">
          Trang {page}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={handlePrevious}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Trang trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasMore}
            onClick={handleNext}
            className="gap-1"
          >
            Trang sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </ListPageLayout>
  );
};

export default SupplierSearch;
