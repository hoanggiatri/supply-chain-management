import { useQuery } from "@tanstack/react-query";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";

export function useWarehouses(companyId) {
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: ["warehouses", companyId],
    queryFn: () => getAllWarehousesInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes - warehouses don't change often
  });
}
