import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { getAllBomsInCompany } from "@/services/manufacturing/BomService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const BomInCompany = () => {
  const [boms, setBoms] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchBoms = async () => {
      try {
        const data = await getAllBomsInCompany(companyId, token);
        setBoms(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách Bom!"
        );
      }
    };

    fetchBoms();
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
    active: "Đang sử dụng",
    inactive: "Ngừng sử dụng",
  };

  const statusColorMap = {
    active: "green",
    inactive: "red",
  };

  const columns = [
    { id: "bomCode", label: "Mã BOM" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "description", label: "Mô tả" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              DANH SÁCH BOM
            </Typography>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={() => navigate("/create-bom")}
            >
              Thêm mới
            </Button>
          </div>

          <DataTable
            rows={boms}
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
            renderRow={(bom, index, page, rowsPerPage, renderStatusCell) => {
              const isLast = index === boms.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={bom.bomId}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/bom/${bom.itemId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {bom.bomCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {bom.itemCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {bom.itemName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {bom.description || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[bom.status] || bom.status || "",
                      statusColorMap[bom.status]
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

export default BomInCompany;
