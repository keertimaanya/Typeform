"use client";

import { use, useState } from "react";
import { useFormDetail } from "@/hooks/useBuilder";
import { useResponses, useResponseSummary } from "@/hooks/useResponses";
import { BuilderHeader } from "@/components/builder/builder-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { Question } from "@/types/form";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId: formIdStr } = use(params);
  const formId = parseInt(formIdStr, 10);
  
  const { data: form, isLoading: isLoadingForm } = useFormDetail(formId);
  const { data: responses, isLoading: isLoadingResponses } = useResponses(formId);
  const { data: summary, isLoading: isLoadingSummary } = useResponseSummary(formId);

  const [activeTab, setActiveTab] = useState<"summary" | "table">("summary");
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);

  if (isLoadingForm || isLoadingResponses || isLoadingSummary) {
    return (
      <div className="h-screen flex flex-col bg-muted/10">
        <div className="h-14 border-b border-border/40 flex items-center px-4 gap-3 bg-background">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!form || !responses || !summary) {
    return <div className="p-8 text-center text-muted-foreground">Failed to load results.</div>;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <BuilderHeader form={form} />

      <main className="flex-1 overflow-y-auto bg-muted/10">
        <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">Results</h1>
              <p className="text-muted-foreground mt-1">{summary.total_responses} total responses</p>
            </div>

            <div className="flex p-1 bg-muted rounded-lg border border-border/50">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "summary" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Insights
              </button>
              <button
                onClick={() => setActiveTab("table")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "table" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Responses List
              </button>
            </div>
          </div>

          {activeTab === "summary" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary.questions.map((qSum) => (
                <SummaryCard key={qSum.question_id} summary={qSum} question={form.questions.find((q) => q.id === qSum.question_id)} />
              ))}
              {summary.questions.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-background rounded-2xl border border-dashed">
                  No insights yet. Share your form to get responses!
                </div>
              )}
            </div>
          )}

          {activeTab === "table" && (
            <div className="bg-background border rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[70vh]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground sticky top-0 border-b">
                    <tr>
                      <th className="px-6 py-4 font-medium whitespace-nowrap">Submitted At</th>
                      {form.questions.map((q, i) => (
                        <th key={q.id} className="px-6 py-4 font-medium truncate max-w-[200px]" title={q.title}>
                          {i + 1}. {q.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {responses.length === 0 ? (
                      <tr>
                        <td colSpan={form.questions.length + 1} className="px-6 py-12 text-center text-muted-foreground">
                          No responses yet.
                        </td>
                      </tr>
                    ) : (
                      responses.map((res) => (
                        <tr key={res.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedResponse(res.id)}>
                          <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                            {new Date(res.submitted_at).toLocaleString()}
                          </td>
                          {form.questions.map((q) => {
                            const answer = res.answers.find((a) => a.question_id === q.id);
                            return (
                              <td key={q.id} className="px-6 py-4 truncate max-w-[250px]">
                                {answer?.value || <span className="text-muted-foreground/40">—</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Detail Modal Overlay */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedResponse(null)}>
          <div className="bg-background border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between bg-muted/10">
              <h3 className="font-semibold text-lg">Response Detail</h3>
              <button onClick={() => setSelectedResponse(null)} className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              {(() => {
                const resData = responses.find(r => r.id === selectedResponse);
                if (!resData) return null;
                return form.questions.map((q, i) => {
                  const ans = resData.answers.find(a => a.question_id === q.id);
                  return (
                    <div key={q.id}>
                      <p className="text-sm text-muted-foreground mb-1">{i + 1}. {q.title}</p>
                      <p className="text-base font-medium">{ans?.value || "—"}</p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ summary, question }: { summary: any; question: Question | undefined }) {
  if (!question) return null;

  const totalAnswers = summary.answer_count;

  return (
    <div className="bg-background border rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <h3 className="font-semibold text-foreground line-clamp-2 pr-4">{question.title}</h3>
        <span className="shrink-0 text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground rounded-md">
          {totalAnswers} answer{totalAnswers !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1">
        {question.type === "multiple_choice" || question.type === "dropdown" || question.type === "yes_no" ? (
          <div className="space-y-4">
            {Object.entries(summary.answers).sort((a: any, b: any) => b[1] - a[1]).map(([val, count]: [string, any]) => {
              const percent = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;
              return (
                <div key={val} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate pr-4">{val}</span>
                    <span className="text-muted-foreground shrink-0">{count} ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : question.type === "rating" ? (
          <div className="flex items-center justify-center h-full flex-col">
            <span className="text-5xl font-light text-primary mb-2">
              {summary.answers.average ? Number(summary.answers.average).toFixed(1) : "0"}
            </span>
            <span className="text-sm text-muted-foreground">Average Rating</span>
            
            {/* Show rating distribution if available */}
            {summary.answers.distribution && Object.keys(summary.answers.distribution).length > 0 && (
               <div className="w-full flex gap-1 mt-6 items-end h-24">
                 {Object.entries(summary.answers.distribution).map(([rating, count]: [string, any]) => {
                   const maxCount = Math.max(...Object.values(summary.answers.distribution as Record<string, number>));
                   const height = maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%';
                   return (
                     <div key={rating} className="flex-1 flex flex-col items-center gap-2 group">
                       <div className="w-full bg-primary/20 rounded-t-sm relative group-hover:bg-primary/40 transition-colors" style={{ height: height || '4px' }}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity font-medium">{count}</span>
                       </div>
                       <span className="text-xs text-muted-foreground">{rating}</span>
                     </div>
                   );
                 })}
               </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {(summary.answers.recent_values || []).map((val: any, i: number) => (
              <div key={i} className="p-3 bg-muted/40 rounded-xl text-sm border border-transparent hover:border-border transition-colors">
                {val}
              </div>
            ))}
            {(!summary.answers.recent_values || summary.answers.recent_values.length === 0) && (
              <p className="text-sm text-muted-foreground">No text answers yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
