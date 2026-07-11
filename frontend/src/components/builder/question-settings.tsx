"use client";

import { useState, useEffect } from "react";
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

  const [choices, setChoices] = useState<string[]>((question.settings as any)?.choices || ["Option 1"]);

  // Sync state when active question changes
  useEffect(() => {
    if (question.type === "multiple_choice" || question.type === "dropdown") {
      setChoices((question.settings as any)?.choices || ["Option 1"]);
    }
  }, [question.id, question.type, question.settings]);

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

  const handleChoicesChange = (newChoices: string[]) => {
    updateQuestion.mutate({
      questionId: question.id,
      data: { settings: { ...question.settings, choices: newChoices } },
    });
  };

  const handleMaxRatingChange = (newMax: number) => {
    updateQuestion.mutate({
      questionId: question.id,
      data: { settings: { ...question.settings, max: newMax } },
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#fafafa]">
      <div className="p-4 border-b border-border/40 bg-white">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          {config?.icon} Settings
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        
        {/* General Settings */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">General</h4>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground cursor-pointer" htmlFor="required-toggle">
              Required
            </label>
            <Switch 
              id="required-toggle"
              checked={question.required} 
              onCheckedChange={handleRequiredToggle} 
            />
          </div>
        </div>

        {/* Question-specific Settings */}
        {(question.type === "multiple_choice" || question.type === "dropdown") && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Choices</h4>
            
            <div className="space-y-2">
              {choices.map((choice: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-6 w-6 shrink-0 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <input
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...choices];
                      newChoices[i] = e.target.value;
                      setChoices(newChoices);
                    }}
                    onBlur={(e) => {
                      const currentBackendChoice = ((question.settings as any)?.choices || [])[i];
                      if (e.target.value !== currentBackendChoice) {
                        handleChoicesChange(choices);
                      }
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 text-sm bg-white border border-border focus:border-primary rounded-md px-3 py-1.5 outline-none transition-all shadow-sm"
                  />
                  <button
                    onClick={() => {
                      const newChoices = choices.filter((_, idx) => idx !== i);
                      setChoices(newChoices);
                      handleChoicesChange(newChoices);
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => {
                  const newChoices = [...choices, `Option ${choices.length + 1}`];
                  setChoices(newChoices);
                  handleChoicesChange(newChoices);
                }}
                className="w-full mt-2 py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-colors"
              >
                + Add Choice
              </button>
            </div>
          </div>
        )}

        {question.type === "rating" && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating Scale</h4>
            
            <select
              value={(question.settings as any)?.max || 5}
              onChange={(e) => handleMaxRatingChange(parseInt(e.target.value, 10))}
              className="w-full text-sm border border-border rounded-lg bg-white px-3 py-2 outline-none focus:border-primary cursor-pointer shadow-sm"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>1 to {num}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Footer: Delete Button */}
      <div className="p-4 border-t border-border/40 bg-white">
        <button
          onClick={handleDelete}
          className="w-full py-2.5 px-4 text-sm font-medium text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          Delete Question
        </button>
      </div>
    </div>
  );
}
