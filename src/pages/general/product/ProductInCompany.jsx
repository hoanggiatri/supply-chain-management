import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { getAllProductsByCompany } from "@/services/general/ProductService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const ProductInCompany = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("serialNumber");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsByCompany(companyId, token);
        setProducts(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách sản phẩm!"
        );
      }
    };

    fetchProducts();
  }, [companyId, token]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const statusLabels = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
    sold: "Đã bán",
    damaged: "Hư hỏng",
  };

  const statusColorMap = {
    active: "green",
    inactive: "amber",
    sold: "blue",
    damaged: "red",
  };

  const columns = [
    { id: "serialNumber", label: "Số Serial" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "batchNumber", label: "Số lô (Batch)" },
    { id: "status", label: "Trạng thái" },
    { id: "createdDate", label: "Ngày tạo" },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              DANH SÁCH SẢN PHẨM (QR)
            </Typography>
            <div className="flex gap-2">
              <Button
                type="button"
                {...getButtonProps("primary")}
                onClick={() => navigate("/create-product")}
              >
                Thêm mới
              </Button>
              <Button
                type="button"
                {...getButtonProps("secondary")}
                onClick={() => navigate("/scan-qr")}
              >
                Quét QR
              </Button>
            </div>
          </div>

          <DataTable
            rows={products}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            search={search}
            setSearch={setSearch}
            statusColumn="status"
            statusColors={statusColorMap}
            renderRow={(
              product,
              index,
              page,
              rowsPerPage,
              renderStatusCell
            ) => {
              const isLast = index === products.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={product.productId}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/product/${product.productId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {product.serialNumber || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {product.item?.itemName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {product.batchNumber || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[product.status] ||
                        product.status ||
                        "Active",
                      statusColorMap[product.status]
                    )}
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {product.createdDate
                        ? new Date(product.createdDate).toLocaleDateString()
                        : ""}
                    </Typography>
                  </td>
                </tr>
              );
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductInCompany;
