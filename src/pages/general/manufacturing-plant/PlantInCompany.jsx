import React, { useEffect, useState } from "react";
import DataTable from "@components/content-components/DataTable";
import { useNavigate } from "react-router-dom";
import { getAllPlantsInCompany } from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";
import { Button, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const PlantInCompany = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("plantName");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const result = await getAllPlantsInCompany(companyId, token);
        setPlants(result);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách xưởng!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchPlants();
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
    { id: "plantCode", label: "Mã xưởng" },
    { id: "plantName", label: "Tên xưởng" },
    { id: "description", label: "Mô tả" },
  ];

  return (
    <div className="p-4">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-4">
          DANH SÁCH XƯỞNG SẢN XUẤT
        </Typography>
        <div className="mb-4">
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate("/create-plant")}
          >
            Thêm mới
          </Button>
        </div>
      </div>
      <DataTable
        rows={plants}
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
        renderRow={(plant, index, page, rowsPerPage) => {
          const isLast = index === plants.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
          return (
            <tr
              key={plant.plantId}
              className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/plant/${plant.plantId}`)}
            >
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {plant.plantCode || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {plant.plantName || ""}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {plant.description || ""}
                </Typography>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default PlantInCompany;
