import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import StatusSummaryCard from "@/components/content-components/StatusSummaryCard";
import { getAllQuotationsInCompany } from "@/services/sale/QuotationService";
import toastrService from "@/services/toastrService";

const QuotationInCompany = () => {
  const [quotations, setQuotations] = useState([]);
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
    const fetchQuotations = async () => {
      try {
        const data = await getAllQuotationsInCompany(companyId, token);
        setQuotations(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể lấy danh sách báo giá!"
        );
      }
    };
    fetchQuotations();
  }, [companyId, token]);

  const filteredQuotations =
    !filterStatus || filterStatus === "Tất cả"
      ? quotations
      : quotations.filter((q) => q.status === filterStatus);

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
    { id: "quotationCode", label: "Mã báo giá" },
    { id: "rfqCode", label: "Mã yêu cầu" },
    { id: "createdBy", label: "Người báo giá" },
    { id: "createdOn", label: "Ngày báo giá" },
    { id: "status", label: "Trạng thái" },
  ];

  const statusLabels = {
    "Đã báo giá": "Đã báo giá",
    "Đã chấp nhận": "Đã chấp nhận",
    "Đã từ chối": "Đã từ chối",
  };

  const statusColorMap = {
    "Đã báo giá": "blue",
    "Đã chấp nhận": "green",
    "Đã từ chối": "red",
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-6 font-bold">
            DANH SÁCH BÁO GIÁ
          </Typography>

          <StatusSummaryCard
            data={quotations}
            statusLabels={[
              "Tất cả",
              "Đã báo giá",
              "Đã chấp nhận",
              "Đã từ chối",
            ]}
            getStatus={(quotation) => quotation.status}
            statusColors={{
              "Tất cả": "#000",
              "Đã báo giá": "#2196f3",
              "Đã từ chối": "#f44336",
              "Đã chấp nhận": "#4caf50",
            }}
            onSelectStatus={setFilterStatus}
            selectedStatus={filterStatus}
          />

          <DataTable
            rows={filteredQuotations}
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
            renderRow={(q, index, page, rowsPerPage, renderStatusCell) => {
              const isLast = index === filteredQuotations.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr
                  key={q.quotationId}
                  className="hover:bg-blue-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/quotation/${q.rfqId}`)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {q.quotationCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {q.rfqCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {q.createdBy || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {q.createdOn
                        ? new Date(q.createdOn).toLocaleString()
                        : ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    {renderStatusCell(
                      statusLabels[q.status] || q.status || "",
                      statusColorMap[q.status]
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

export default QuotationInCompany;
