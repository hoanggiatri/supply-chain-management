import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Input } from "@/components/ui/input";
import {
    createDeliveryProcess,
    getAllDeliveryProcesses,
} from "@/services/delivery/DoProcessService";
import { getDeliveryOrderById } from "@/services/delivery/DoService";
import { getSoById } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";
import dayjs from "dayjs";
import { CheckCircle, Package, Plus, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateDoProcess = () => {
  const { doId } = useParams();
  const token = localStorage.getItem("token");

  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [so, setSo] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [newMidLocation, setNewMidLocation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doData = await getDeliveryOrderById(doId, token);
        setDeliveryOrder(doData);
        const processData = await getAllDeliveryProcesses(doId, token);
        setProcesses(Array.isArray(processData) ? processData : []);
        const soData = await getSoById(doData.soId, token);
        setSo(soData);
      } catch (err) {
        toastrService.error(
          err.response?.data?.message || "Không thể tải tiến trình vận chuyển!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doId, token]);

  const statusToStepIndex = {
    "Chờ lấy hàng": 0,
    "Đang vận chuyển": 1,
    "Đã hoàn thành": 2,
  };

  const processesArray = Array.isArray(processes) ? processes : [];
  const fromProcess = processesArray.find((p) => p.note === "from");
  const middleProcesses = processesArray.filter((p) => !p.note);

  const handleAddMidProcess = async () => {
    if (!newMidLocation.trim()) return;
    try {
      await createDeliveryProcess(
        {
          doId,
          location: newMidLocation.trim(),
          arrivalTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        },
        token
      );
      const updated = await getAllDeliveryProcesses(doId, token);
      setProcesses(Array.isArray(updated) ? updated : []);
      setIsEditing(false);
      setNewMidLocation("");
    } catch (err) {
      toastrService.error(
        err.response?.data?.message || "Không thể thêm điểm dừng!"
      );
    }
  };

  const steps = [
    { label: "Chờ lấy hàng", icon: Package },
    { label: "Đang vận chuyển", icon: Truck },
    { label: "Giao hàng thành công", icon: CheckCircle },
  ];

  const activeStep = statusToStepIndex[deliveryOrder?.status] ?? 0;

  if (!deliveryOrder || !so || !processes) return <LoadingPaper title="THÔNG TIN VẬN CHUYỂN" />;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Đơn vận chuyển", path: "/dos" },
        { label: "Cập nhật vận chuyển" },
      ]}
      backLink={`/do/${doId}`}
      backLabel="Quay lại chi tiết"
    >
      {/* Stepper */}
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

      {/* Timeline */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
        </div>
      ) : (
        <div className="relative pl-8 border-l-2 border-gray-300">
          {/* From process */}
          {fromProcess && (
            <div className="relative mb-6">
              <div className="absolute -left-[calc(0.5rem+9px)] w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
              <div className="flex items-start gap-4">
                <div className="text-sm text-gray-500 min-w-[140px]">
                  {fromProcess.arrivalTime
                    ? new Date(fromProcess.arrivalTime).toLocaleString("vi-VN")
                    : ""}
                </div>
                <div className="text-gray-900">{fromProcess.location}</div>
              </div>
            </div>
          )}

          {/* Middle processes */}
          {middleProcesses.map((process, index) => (
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

          {/* Add new stop */}
          <div className="relative mb-6">
            <div className="absolute -left-[calc(0.5rem+9px)] w-4 h-4 rounded-full bg-gray-400 border-2 border-white" />
            <div className="flex items-start gap-4">
              <div className="text-sm text-gray-500 min-w-[140px]"></div>
              {isEditing ? (
                <Input
                  autoFocus
                  value={newMidLocation}
                  onChange={(e) => setNewMidLocation(e.target.value)}
                  onBlur={handleAddMidProcess}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddMidProcess();
                    if (e.key === "Escape") {
                      setIsEditing(false);
                      setNewMidLocation("");
                    }
                  }}
                  placeholder="Nhập điểm dừng"
                  className="max-w-xs"
                />
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm điểm dừng
                </button>
              )}
            </div>
          </div>

          {/* Destination */}
          <div className="relative">
            <div className="absolute -left-[calc(0.5rem+9px)] w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
            <div className="flex items-start gap-4">
              <div className="text-sm text-gray-500 min-w-[140px]"></div>
              <div className="text-gray-900 font-medium">{so.deliveryToAddress}</div>
            </div>
          </div>
        </div>
      )}
    </FormPageLayout>
  );
};

export default UpdateDoProcess;
