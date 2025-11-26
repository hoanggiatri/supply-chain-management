import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllMosInCompany } from "@/services/manufacturing/MoService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const MoInCompany = () => {
  const [mos, setMos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchMos = async () => {
      try {
        const data = await getAllMosInCompany(companyId, token);
        setMos(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy danh sách công lệnh!"
        );
      }
    };

    fetchMos();
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

  const filteredMos =
    !filterStatus || filterStatus === "Tất cả"
      ? mos
      : mos.filter((mo) => mo.status === filterStatus);

  const statusLabels = {
    "Chờ xác nhận": "Chờ xác nhận",
    "Chờ sản xuất": "Chờ sản xuất",
    "Đang sản xuất": "Đang sản xuất",
    "Chờ nhập kho": "Chờ nhập kho",
    "Đã hoàn thành": "Đã hoàn thành",
    "Đã hủy": "Đã hủy",
  };

  const statusColorMap = {
    "Chờ xác nhận": "purple",
    "Chờ sản xuất": "blue",
    "Đang sản xuất": "cyan",
    "Chờ nhập kho": "amber",
    "Đã hoàn thành": "green",
    "Đã hủy": "red",
  };

  const columns = [
    { id: "moCode", label: "Mã MO" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "lineCode", label: "Mã chuyền" },
    { id: "type", label: "Loại" },
    { id: "quantity", label: "Số lượng" },
    { id: "estimatedStartTime", label: "Ngày bắt đầu" },
    { id: "estimatedEndTime", label: "Ngày kết thúc" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-4">
          DANH SÁCH CÔNG LỆNH SẢN XUẤT
        </Typography>

        <StatusSummaryCard
          data={mos}
          statusLabels={[
            "Tất cả",
            "Chờ xác nhận",
            "Chờ sản xuất",
            "Đang sản xuất",
            "Chờ nhập kho",
            "Đã hoàn thành",
            "Đã hủy",
          ]}
          getStatus={(mo) => mo.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xác nhận": "#9c27b0",
            "Chờ sản xuất": "#2196f3",
            "Đang sản xuất": "#00bcd4",
            "Chờ nhập kho": "#ff9800",
            "Đã hoàn thành": "#4caf50",
            "Đã hủy": "#f44336",
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />

        <div className="mb-4">
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate("/create-mo")}
          >
            Thêm mới
          </Button>
        </div>
      </div>

      <DataTable
        rows={filteredMos}
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
        renderRow={(mo, index, page, rowsPerPage, renderStatusCell) => {
          const isLast = index === filteredMos.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
          return (
            <tr
              key={mo.moId}
              className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/mo/${mo.moId}`)}
            >
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.moCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.itemCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.lineCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.type || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.quantity}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.estimatedStartTime
                    ? new Date(mo.estimatedStartTime).toLocaleString()
                    : ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.estimatedEndTime
                    ? new Date(mo.estimatedEndTime).toLocaleString()
                    : ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.createdBy || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.createdOn ? new Date(mo.createdOn).toLocaleString() : ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {mo.lastUpdatedOn
                    ? new Date(mo.lastUpdatedOn).toLocaleString()
                    : ""}
                </Typography>
              </td>
              <td className={classes}>
                {renderStatusCell(
                  statusLabels[mo.status] || mo.status || "",
                  statusColorMap[mo.status]
                )}
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default MoInCompany;
