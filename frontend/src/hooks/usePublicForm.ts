import { useQuery, useMutation } from "@tanstack/react-query";
import { publicService, type ResponseSubmit } from "@/services/publicService";

export function usePublicForm(slug: string) {
  return useQuery({
    queryKey: ["publicForm", slug],
    queryFn: () => publicService.getPublicForm(slug),
    retry: false, // Don't retry on 404s
  });
}

export function useSubmitResponse(slug: string) {
  return useMutation({
    mutationFn: (data: ResponseSubmit) => publicService.submitResponse(slug, data),
  });
}
