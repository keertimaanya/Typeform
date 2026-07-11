/**
 * TanStack Query hooks for form operations.
 * 
 * WHY TanStack Query over plain useEffect + useState?
 * - Automatic caching (don't re-fetch data you already have)
 * - Background refetching (data stays fresh)
 * - Optimistic updates (UI updates before server confirms)
 * - Loading/error states built-in (no manual isLoading state)
 * - Automatic retry on failure
 * - Deduplication (10 components requesting same data = 1 network call)
 * 
 * useQuery = reading data (GET)
 * useMutation = changing data (POST/PUT/DELETE)
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formService } from "@/services/formService";
import type { FormCreate, FormUpdate } from "@/types/form";

// Query key factory — keeps keys consistent across the app
const formKeys = {
  all: ["forms"] as const,
  detail: (id: number) => ["forms", id] as const,
};

/** Fetch all forms */
export function useForms() {
  return useQuery({
    queryKey: formKeys.all,
    queryFn: formService.getForms,
  });
}

/** Create a new form, then refresh the list */
export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormCreate) => formService.createForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}

/** Update a form (rename, etc.) */
export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormUpdate }) =>
      formService.updateForm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}

/** Delete a form */
export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => formService.deleteForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}

/** Duplicate a form */
export function useDuplicateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => formService.duplicateForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}

/** Publish a form */
export function usePublishForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => formService.publishForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}

/** Unpublish a form */
export function useUnpublishForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => formService.unpublishForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.all });
    },
  });
}
