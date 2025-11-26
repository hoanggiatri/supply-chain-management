import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import { getAllDepartmentsInCompany } from "@/services/general/DepartmentService";
import toastrService from "@/services/toastrService";

const DepartmentInCompany = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("departmentCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartmentsInCompany(companyId, token);
        setDepartments(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách bộ phận!"
        );
      }
    };

    if (companyId && token) {
      fetchDepartments();
    }
  }, [companyId, token]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const columns = [
    { id: "departmentCode", label: "Mã bộ phận" },
    { id: "departmentName", label: "Tên bộ phận" },
  ];

  return (
    <div className="h-full p-6">
      <Card className="h-full shadow-lg flex flex-col">
        <CardBody className="flex flex-col flex-1 overflow-hidden">
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH BỘ PHẬN
          </Typography>
          <div className="flex-1 min-h-0">
            <DataTable
              rows={departments}
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
              height="100%"
              renderRow={(dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-blue-gray-100 hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/department/${dept.id}`)}
                >
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {dept.departmentCode}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {dept.departmentName}
                    </Typography>
                  </td>
                </tr>
              )}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DepartmentInCompany;
