import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { getAllStagesInCompany } from "@/services/manufacturing/StageService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const StageInCompany = () => {
  const [stages, setStages] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("stageCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const data = await getAllStagesInCompany(companyId, token);
        setStages(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách Stage!"
        );
      }
    };

    fetchStages();
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
    { id: "stageCode", label: "Mã Stage" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "description", label: "Mô tả" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-4">
          DANH SÁCH QUY TRÌNH SẢN XUẤT
        </Typography>
        <div className="mb-4">
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate("/create-stage")}
          >
            Thêm mới
          </Button>
        </div>
      </div>
      <DataTable
        rows={stages}
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
        renderRow={(stage, index, page, rowsPerPage, renderStatusCell) => {
          const isLast = index === stages.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
          return (
            <tr
              key={stage.stageId}
              className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/stage/${stage.stageId}`)}
            >
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {stage.stageCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {stage.itemCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {stage.itemName || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {stage.description || ""}
                </Typography>
              </td>
              <td className={classes}>
                {renderStatusCell(
                  statusLabels[stage.status] || stage.status || "",
                  statusColorMap[stage.status]
                )}
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default StageInCompany;
