import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { useNavigate } from "react-router-dom";
import { getAllLinesInCompany } from "@/services/general/ManufactureLineService";
import toastrService from "@/services/toastrService";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const LineInCompany = () => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("lineName");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchLines = async () => {
      setLoading(true);
      try {
        const result = await getAllLinesInCompany(companyId, token);
        setLines(result);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách dây chuyền!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchLines();
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

  const columns = [
    { id: "lineCode", label: "Mã dây chuyền" },
    { id: "lineName", label: "Tên dây chuyền" },
    { id: "plantName", label: "Tên xưởng" },
    { id: "capacity", label: "Công suất" },
    { id: "description", label: "Mô tả" },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              DANH SÁCH DÂY CHUYỀN SẢN XUẤT
            </Typography>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={() => navigate("/create-line")}
            >
              Thêm mới
            </Button>
          </div>

          <DataTable
            rows={lines}
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
            renderRow={(line, index, page, rowsPerPage) => {
              const isLast = index === lines.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={line.id}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/line/${line.lineId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {line.lineCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {line.lineName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {line.plantName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {line.capacity || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {line.description || ""}
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

export default LineInCompany;
