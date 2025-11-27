import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { useNavigate } from "react-router-dom";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const WarehouseInCompany = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("warehouseName");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoading(true);
      try {
        const result = await getAllWarehousesInCompany(companyId, token);
        setWarehouses(result);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách kho!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchWarehouses();
    }
  }, [companyId, token]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const statusLabels = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
    closed: "Đã đóng",
  };

  const statusColorMap = {
    active: "green",
    inactive: "amber",
    closed: "red",
  };

  const columns = [
    { id: "warehouseCode", label: "Mã kho" },
    { id: "warehouseName", label: "Tên kho" },
    { id: "description", label: "Mô tả" },
    { id: "maxCapacity", label: "Sức chứa tối đa (m³)" },
    { id: "warehouseType", label: "Loại kho" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              DANH SÁCH KHO HÀNG
            </Typography>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={() => navigate("/create-warehouse")}
            >
              Thêm mới
            </Button>
          </div>

          <DataTable
            rows={warehouses}
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
            loading={loading}
            renderRow={(
              warehouse,
              index,
              page,
              rowsPerPage,
              renderStatusCell
            ) => {
              const isLast = index === warehouses.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={warehouse.id}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/warehouse/${warehouse.warehouseId}`)
                  }
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {warehouse.warehouseCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {warehouse.warehouseName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {warehouse.description || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {warehouse.maxCapacity || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {warehouse.warehouseType || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[warehouse.status] || warehouse.status || "",
                      statusColorMap[warehouse.status]
                    )}
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

export default WarehouseInCompany;
