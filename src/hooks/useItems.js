import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllItemsInCompany } from "@/services/general/ItemService";

export function useItems(companyId) {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["items", companyId],
    queryFn: () => getAllItemsInCompany(companyId, token),
    enabled: !!companyId && !!token,
  });
}
