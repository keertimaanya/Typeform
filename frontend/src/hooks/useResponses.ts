import { useQuery } from "@tanstack/react-query";
import { responseService } from "@/services/responseService";

export function useResponses(formId: number) {
  return useQuery({
    queryKey: ["responses", formId],
    queryFn: () => responseService.getResponses(formId),
  });
}

export function useResponseSummary(formId: number) {
  return useQuery({
    queryKey: ["responseSummary", formId],
    queryFn: () => responseService.getResponseSummary(formId),
  });
}
