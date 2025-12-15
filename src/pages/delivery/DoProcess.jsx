import FormPageLayout from "@/components/layout/FormPageLayout";
import { getAllDeliveryProcesses } from "@/services/delivery/DoProcessService";
import { getDeliveryOrderById } from "@/services/delivery/DoService";
import toastrService from "@/services/toastrService";
import { CheckCircle, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DoProcess = () => {
  const { doId } = useParams();
  const token = localStorage.getItem("token");

  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProcesses = async () => {
      setLoading(true);
      try {
        const doData = await getDeliveryOrderById(doId, token);
        setDeliveryOrder(doData);
        const data = await getAllDeliveryProcesses(doId, token);
        setProcesses(data);
      } catch (err) {
        toastrService.error(
          err.response?.data?.message || "Không thể tải tiến trình vận chuyển!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, [doId, token]);

  const statusToStepIndex = {
    "Chờ lấy hàng": 0,
    "Đang vận chuyển": 1,
    "Đã hoàn thành": 2,
  };

  const steps = [
    { label: "Chờ lấy hàng", icon: Package },
    { label: "Đang vận chuyển", icon: Truck },
    { label: "Giao hàng thành công", icon: CheckCircle },
  ];

  const activeStep = statusToStepIndex[deliveryOrder?.status] ?? 0;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Đơn vận chuyển", path: "/dos" },
        { label: "Thông tin vận chuyển" },
      ]}
      backLink={`/do/${doId}`}
      backLabel="Quay lại chi tiết"
    >
      {/* Stepper */}
      {deliveryOrder && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              const iconColor = isCompleted || isActive ? "text-gray-900" : "text-gray-400";
              const lineColor = index < activeStep ? "bg-gray-900" : "bg-gray-300";

              return (
                <div key={step.label} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div className={`${iconColor}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isCompleted || isActive ? "text-gray-900" : "text-gray-500"}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${lineColor}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
        </div>
      ) : (
        <div className="relative pl-8 border-l-2 border-gray-300">
          {processes.map((process, index) => (
            <div key={index} className="relative mb-6">
              <div className="absolute -left-[calc(0.5rem+9px)] w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
              <div className="flex items-start gap-4">
                <div className="text-sm text-gray-500 min-w-[140px]">
                  {process.arrivalTime
                    ? new Date(process.arrivalTime).toLocaleString("vi-VN")
                    : ""}
                </div>
                <div className="text-gray-900">{process.location}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FormPageLayout>
  );
};

export default DoProcess;