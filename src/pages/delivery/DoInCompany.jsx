import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllDeliveryOrdersInCompany } from "@/services/delivery/DoService";
import toastrService from "@/services/toastrService";

const DoInCompany = () => {
  const [dos, setDos] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDos = async () => {
      try {
        const data = await getAllDeliveryOrdersInCompany(companyId, token);
        setDos(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn vận chuyển!"
        );
      }
    };
    fetchDos();
  }, [companyId, token]);

  const filteredDos =
    filterStatus === "Tất cả"
      ? dos
      : dos.filter((ord) => ord.status === filterStatus);

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
    { id: "doCode", label: "Mã đơn vận chuyển" },
    { id: "soCode", label: "Mã đơn bán" },
    { id: "createdBy", label: "Người tạo" },
    { id: "createdOn", label: "Ngày tạo" },
    { id: "lastUpdatedOn", label: "Cập nhật gần nhất" },
    { id: "status", label: "Trạng thái" },
  ];

  return (
    <div className="h-full p-6">
      <Card className="h-full shadow-lg flex flex-col">
        <CardBody className="flex flex-col flex-1 overflow-hidden">
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH ĐƠN VẬN CHUYỂN
          </Typography>

          <StatusSummaryCard
            data={dos}
            statusLabels={[
              "Tất cả",
              "Chờ xác nhận",
              "Chờ lấy hàng",
              "Đang vận chuyển",
              "Đã hoàn thành",
            ]}
            getStatus={(ord) => ord.status}
            statusColors={{
              "Tất cả": "#000",
              "Chờ xác nhận": "#f44336",
              "Chờ lấy hàng": "#ff9800",
              "Đang vận chuyển": "#2196f3",
              "Đã hoàn thành": "#4caf50",
            }}
            onSelectStatus={setFilterStatus}
            selectedStatus={filterStatus}
          />

          <div className="flex-1 min-h-0">
            <DataTable
              rows={filteredDos}
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
              statusColumn="status"
              statusColors={{
                "Chờ xác nhận": "red",
                "Chờ lấy hàng": "orange",
                "Đang vận chuyển": "blue",
                "Đã hoàn thành": "green",
              }}
              renderRow={(ord, _index, _page, _rowsPerPage, renderStatusCell) => (
                <tr
                  key={ord.doId}
                  className="border-b border-blue-gray-100 hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/do/${ord.doId}`)}
                >
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {ord.doCode}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {ord.soCode}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {ord.createdBy}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {ord.createdOn ? new Date(ord.createdOn).toLocaleString() : ""}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {ord.lastUpdatedOn
                        ? new Date(ord.lastUpdatedOn).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className="p-4">
                    {renderStatusCell ? renderStatusCell(ord.status) : ord.status}
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

export default DoInCompany;
