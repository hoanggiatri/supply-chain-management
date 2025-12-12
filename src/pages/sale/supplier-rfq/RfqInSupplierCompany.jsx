import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import DataTable from "@components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllRfqsInRequestedCompany } from "@/services/purchasing/RfqService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";

const RfqInSupplierCompany = () => {
  const [rfqs, setRfqs] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdOn");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const data = await getAllRfqsInRequestedCompany(companyId, token);
        const filteredData = data.filter(
          (rfq) => rfq.status === "Chưa báo giá" || rfq.status === "Đã báo giá"
        );
        setRfqs(filteredData);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy danh sách yêu cầu báo giá!"
        );
      }
    };

    fetchRfqs();
  }, [companyId, token]);

  const filteredRfqs =
    !filterStatus || filterStatus === "Tất cả"
      ? rfqs
      : rfqs.filter((rfq) => rfq.status === filterStatus);

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
    { id: "rfqCode", label: "Mã yêu cầu" },
    { id: "companyName", label: "Công ty yêu cầu" },
    { id: "needByDate", label: "Hạn báo giá" },
    { id: "createdOn", label: "Ngày yêu cầu" },
    { id: "status", label: "Trạng thái" },
  ];

  const statusLabels = {
    "Chưa báo giá": "Chưa báo giá",
    "Đã báo giá": "Đã báo giá",
  };

  const statusColorMap = {
    "Chưa báo giá": "amber",
    "Đã báo giá": "green",
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH YÊU CẦU BÁO GIÁ
          </Typography>
          <StatusSummaryCard
            data={rfqs}
            statusLabels={["Tất cả", "Chưa báo giá", "Đã báo giá"]}
            getStatus={(rfq) => rfq.status}
            statusColors={{
              "Tất cả": "#000",
              "Chưa báo giá": "#ff9800",
              "Đã báo giá": "#4caf50",
            }}
            onSelectStatus={(status) => setFilterStatus(status)}
            selectedStatus={filterStatus}
          />

          <DataTable
            rows={filteredRfqs}
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
            renderRow={(rfq, index, page, rowsPerPage, renderStatusCell) => {
              const isLast = index === filteredRfqs.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={rfq.rfqCode}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/supplier-rfq/${rfq.rfqId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {rfq.rfqCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {rfq.companyName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {rfq.needByDate
                        ? new Date(rfq.needByDate).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {rfq.createdOn
                        ? new Date(rfq.createdOn).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[rfq.status] || rfq.status || "",
                      statusColorMap[rfq.status]
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

export default RfqInSupplierCompany;
