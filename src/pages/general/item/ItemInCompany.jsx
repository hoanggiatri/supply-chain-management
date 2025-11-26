import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const ItemInCompany = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        setItems(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách hàng hóa!"
        );
      }
    };

    fetchItems();
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

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "itemType", label: "Loại hàng hóa" },
    { id: "uom", label: "Đơn vị tính" },
    { id: "technicalSpecifications", label: "Thông số kỹ thuật" },
    { id: "importPrice", label: "Giá nhập" },
    { id: "exportPrice", label: "Giá xuất" },
    { id: "description", label: "Mô tả" },
    { id: "isSellable", label: "Hàng bán" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-4">
          DANH SÁCH HÀNG HÓA
        </Typography>
        <div className="mb-4">
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate("/create-item")}
          >
            Thêm mới
          </Button>
        </div>
      </div>
      <DataTable
        rows={items}
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
        renderRow={(item, index, page, rowsPerPage) => {
          const isLast = index === items.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
          return (
            <tr
              key={item.itemId}
              className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/item/${item.itemId}`)}
            >
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.itemCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.itemName || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.itemType || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.uom || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.technicalSpecifications || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.importPrice !== null
                    ? item.importPrice.toLocaleString()
                    : ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.exportPrice !== null
                    ? item.exportPrice.toLocaleString()
                    : ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.description || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {item.isSellable ? "Có" : "Không"}
                </Typography>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default ItemInCompany;
