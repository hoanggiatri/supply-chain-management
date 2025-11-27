import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@material-tailwind/react";
import { getCompanyById } from "@/services/general/CompanyService";
import CompanyForm from "@/components/general/CompanyForm";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const companyId = localStorage.getItem("companyId");
      const token = localStorage.getItem("token");
      if (!companyId) return;

      try {
        const data = await getCompanyById(companyId, token);

        if (data.logoUrl) {
          data.logoUrl = `${data.logoUrl}?t=${Date.now()}`;
        }

        setCompany(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi lấy thông tin công ty!"
        );
      }
    };

    fetchCompany();
  }, []);

  if (!company) {
    return (
      <div className="p-6">
        <Card className="shadow-lg">
          <CardBody>
            <Typography
              variant="h4"
              color="blue-gray"
              className="mb-6 font-bold"
            >
              THÔNG TIN CÔNG TY
            </Typography>
            <div className="flex justify-center items-center py-12">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÔNG TIN CÔNG TY
            </Typography>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <img
              src={
                company.logoUrl ||
                "https://cdn-icons-png.freepik.com/512/2774/2774806.png"
              }
              alt="Company Logo"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>

          <CompanyForm
            companyData={company}
            onChange={() => {}}
            errors={{}}
            readOnly
          />

          <div className="mt-6 flex justify-end">
            <Button
              {...getButtonProps("primary")}
              onClick={() => navigate("/company/edit")}
            >
              Sửa
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CompanyDetail;
