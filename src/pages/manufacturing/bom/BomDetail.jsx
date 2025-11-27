/* global globalThis */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import DataTable from "@/components/content-components/DataTable";
import BomForm from "@/components/manufacturing/BomForm";
import { getBomByItemId, deleteBom } from "@/services/manufacturing/BomService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import BackButton from "@/components/common/BackButton";
import { getButtonProps } from "@/utils/buttonStyles";

const BomDetail = () => {
  const { itemId } = useParams();
  const [bom, setBom] = useState(null);
  const [bomDetails, setBomDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchBom = async () => {
      setLoading(true);
      try {
        const data = await getBomByItemId(itemId, token);
        setBom(data);
        setBomDetails(Array.isArray(data.bomDetails) ? data.bomDetails : []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy thông tin BOM!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBom();
  }, [itemId, token]);

  const readOnlyFields = {
    bomCode: true,
    itemCode: true,
    itemName: true,
    description: true,
    status: true,
  };

  const columns = [
    { id: "itemCode", label: "Mã NVL" },
    { id: "itemName", label: "Tên NVL" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
  ];

  const handleDelete = async () => {
    const confirmFn =
      typeof globalThis !== "undefined" &&
      typeof globalThis.confirm === "function"
        ? globalThis.confirm.bind(globalThis)
        : null;
    if (confirmFn && !confirmFn("Bạn có chắc muốn xóa BOM này không?")) {
      return;
    }

    try {
      await deleteBom(bom.bomId, token);
      toastrService.success("Xóa BOM thành công!");
      navigate("/boms");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa BOM!"
      );
    }
  };

  if (!bom) {
    return <LoadingPaper title="THÔNG TIN BOM" />;
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÔNG TIN BOM
            </Typography>
            <BackButton to="/boms" label="Quay lại danh sách" />
          </div>

          <BomForm
            bom={bom}
            onChange={() => {}}
            errors={{}}
            readOnlyFields={readOnlyFields}
            setBom={setBom}
          />

          <Typography variant="h5" color="blue-gray" className="mt-6 mb-4">
            DANH SÁCH NGUYÊN VẬT LIỆU
          </Typography>

          <DataTable
            rows={bomDetails}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={(property) => {
              const isAsc = orderBy === property && order === "asc";
              setOrder(isAsc ? "desc" : "asc");
              setOrderBy(property);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(Number(event.target.value))
            }
            search={search}
            setSearch={setSearch}
            loading={loading}
            renderRow={(detail, index) => {
              const isLast = index === bomDetails.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={`${detail.itemCode}-${index}`}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.itemCode}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.itemName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.quantity}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.note || "-"}
                    </Typography>
                  </td>
                </tr>
              );
            }}
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={() => navigate(`/bom/${bom.itemId}/edit`)}
            >
              Sửa
            </Button>
            <Button
              type="button"
              {...getButtonProps("danger")}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BomDetail;
