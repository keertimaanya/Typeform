"use client";

import { useUpdateQuestion, useDeleteQuestion } from "@/hooks/useBuilder";
import { getQuestionTypeConfig } from "@/lib/question-types";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Question } from "@/types/form";

interface QuestionSettingsProps {
  question: Question;
  formId: number;
}

export function QuestionSettings({ question, formId }: QuestionSettingsProps) {
  const updateQuestion = useUpdateQuestion(formId);
  const deleteQuestion = useDeleteQuestion(formId);
  const config = getQuestionTypeConfig(question.type);

  const handleRequiredToggle = (checked: boolean) => {
    updateQuestion.mutate({ questionId: question.id, data: { required: checked } });
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion.mutateAsync(question.id);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleMaxRatingChange = (newMax: number) => {
    updateQuestion.mutate({
      questionId: question.id,
      data: { settings: { ...question.settings, max: newMax } },
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#fafafa]">
      {/* Header */}
      <div className="p-4 border-b border-border/40 bg-white">
        <h3 className="text-sm font-semibold text-foreground">Answer</h3>
        <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/40">
          {typeof config?.icon === "string" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d={config.icon} />
            </svg>
          ) : (
            <span className="text-muted-foreground">{config?.icon}</span>
          )}
          <span className="text-sm font-medium text-foreground">
            {config?.label || question.type}
          </span>
        </div>
      </div>

      {/* Settings body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Required toggle */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Validation
          </h4>
          <div className="flex items-center justify-between py-2 px-1">
            <div>
              <label
                className="text-sm font-medium text-foreground cursor-pointer"
                htmlFor="required-toggle"
              >
                Required
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Respondents must answer this
              </p>
            </div>
            <Switch
              id="required-toggle"
              checked={question.required}
              onCheckedChange={handleRequiredToggle}
            />
          </div>
        </div>

        {/* Rating scale (only for rating type) */}
        {question.type === "rating" && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rating Scale
            </h4>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Max rating</label>
              <select
                value={(question.settings as any)?.max || 5}
                onChange={(e) => handleMaxRatingChange(parseInt(e.target.value, 10))}
                className="w-full text-sm border border-border rounded-lg bg-white px-3 py-2.5 outline-none focus:border-primary cursor-pointer shadow-sm"
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    1 to {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Info box: hint for MCQ */}
        {(question.type === "multiple_choice" || question.type === "dropdown") && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-xs text-blue-700 font-medium mb-1">Editing choices</p>
            <p className="text-xs text-blue-600">
              Click directly on any option in the workspace to the left to rename or delete it, or use the "Add choice" button below the options.
            </p>
          </div>
        )}
      </div>

      {/* Footer: Delete Button */}
      <div className="p-4 border-t border-border/40 bg-white">
        <button
          onClick={handleDelete}
          className="w-full py-2.5 px-4 text-sm font-medium text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Delete Question
        </button>
      </div>
    </div>
  );
}
