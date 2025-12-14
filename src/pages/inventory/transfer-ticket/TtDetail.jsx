import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import TtForm from "@/components/inventory/TtForm";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TtDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const data = await getTransferTicketById(ticketId, token);
        setTicket(data);
        setDetails(
          Array.isArray(data.transferTicketDetails)
            ? data.transferTicketDetails
            : []
        );
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải phiếu chuyển kho!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId, token]);

  const readOnlyFields = {
    ticketCode: true,
    reason: true,
    fromWarehouseCode: true,
    toWarehouseCode: true,
    fromWarehouseName: true,
    toWarehouseName: true,
    status: true,
  };

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
  ];

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

  const filteredDetails = Array.isArray(details)
    ? details.sort((a, b) => {
        if (orderBy) {
          if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
          if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        }
        return 0;
      })
    : [];

  const paginatedDetails = filteredDetails.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  const handleEditClick = () => {
    if (ticket.status === "Chờ xác nhận") {
      navigate(`/transfer-ticket/${ticket.ticketId}/edit`);
    } else {
      toastrService.warning(
        "Chỉ phiếu chuyển kho ở trạng thái 'Chờ xác nhận' mới được chỉnh sửa!"
      );
    }
  };

  const handleCancel = async () => {
    try {
      // Only send allowed fields - API rejects read-only properties
      const request = {
        companyId: parseInt(ticket.companyId),
        status: 'Đã hủy',
        reason: ticket.reason,
        fromWarehouseId: parseInt(ticket.fromWarehouseId),
        toWarehouseId: parseInt(ticket.toWarehouseId),
        createdBy: ticket.createdBy,
        // Clean transferTicketDetails - remove read-only fields
        transferTicketDetails: (ticket.transferTicketDetails || []).map(d => ({
          itemId: parseInt(d.itemId),
          quantity: parseFloat(d.quantity),
          note: d.note || ''
        }))
      };
      await updateTransferTicket(ticketId, request, token);
      toastrService.success('Đã hủy phiếu chuyển kho!');

      setTicket((prev) => ({
        ...prev,
        status: 'Đã hủy',
      }));
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || 'Có lỗi khi hủy phiếu chuyển kho!'
      );
    }
  };

  const handleConfirm = (type, id) => {
    navigate(`/check-inventory/${type}/${id}`);
  };

  if (!ticket) {
    return <LoadingPaper title="THÔNG TIN PHIẾU CHUYỂN KHO" />;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÔNG TIN PHIẾU CHUYỂN KHO
            </Typography>
            <BackButton to="/transfer-tickets" label="Quay lại danh sách" />
          </div>

          {ticket.status === "Chờ xác nhận" && (
            <div className="flex justify-end gap-2 mb-6">
              <Button
                {...getButtonProps("primary")}
                onClick={() => handleConfirm("tt", ticket.ticketId)}
              >
                Xác nhận
              </Button>
              <Button
                {...getButtonProps("danger")}
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    onConfirm: handleCancel,
                  })
                }
              >
                Hủy
              </Button>
            </div>
          )}

          <TtForm
            ticket={ticket}
            onChange={() => {}}
            errors={{}}
            readOnlyFields={readOnlyFields}
            setTicket={setTicket}
          />

          <Typography variant="h5" className="mt-6 mb-4 font-semibold">
            DANH SÁCH HÀNG HÓA CHUYỂN KHO:
          </Typography>

          <DataTable
            rows={paginatedDetails}
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
            isLoading={loading}
            renderRow={(detail, index) => {
              const isLast = index === paginatedDetails.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.itemCode || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.itemName || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.quantity || ""}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.note || ""}
                    </Typography>
                  </td>
                </tr>
              );
            }}
          />

          <div className="mt-6 flex justify-end">
            <Button {...getButtonProps("primary")} onClick={handleEditClick}>
              Sửa
            </Button>
          </div>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title="Xác nhận hủy"
        message="Bạn có chắc chắn muốn hủy phiếu chuyển kho này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        confirmButtonProps="danger"
      />
    </div>
  );
};

export default TtDetail;
