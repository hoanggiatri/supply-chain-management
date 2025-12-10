import { useQuery } from "@tanstack/react-query";
import { getAllInventory } from "@/services/inventory/InventoryService";

export function useInventory(itemId = 0, warehouseId = 0, companyId) {
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: ["inventory", companyId, itemId, warehouseId],
    queryFn: () => getAllInventory(itemId, warehouseId, companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useInventoryWithFilters(companyId) {
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: ["inventory", companyId, "all"],
    queryFn: () => getAllInventory(0, 0, companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
