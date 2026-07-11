"use client";

import { useState } from "react";
import { useAddQuestion, useReorderQuestions } from "@/hooks/useBuilder";
import { QUESTION_TYPES, getQuestionTypeConfig } from "@/lib/question-types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Question } from "@/types/form";

interface BuilderSidebarProps {
  formId: number;
  questions: Question[];
  activeQuestionId: number | null;
  setActiveQuestionId: (id: number) => void;
}

// Menu Item Component for the Add Content Popover
function MenuItem({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick?: () => void, disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${
        disabled 
          ? "opacity-50 cursor-not-allowed grayscale" 
          : "hover:bg-muted cursor-pointer group"
      }`}
    >
      <div className={`h-7 w-7 rounded border shadow-sm flex items-center justify-center text-muted-foreground ${!disabled && "group-hover:text-primary"} bg-background transition-colors`}>
        {typeof icon === "string" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
        ) : (
          icon
        )}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {disabled && (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-primary/40"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
      )}
    </button>
  );
}

// Sortable Item Component
function SortableNavItem({ 
  question, 
  index, 
  isActive, 
  onClick 
}: { 
  question: Question; 
  index: number; 
  isActive: boolean;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = getQuestionTypeConfig(question.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`group relative flex items-center gap-3 p-3 mb-2 rounded-xl cursor-pointer border transition-all ${
        isActive 
          ? "bg-white border-primary/20 shadow-sm" 
          : "bg-transparent border-transparent hover:bg-black/5"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div 
        {...attributes}
        {...listeners}
        className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-1 -ml-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>
      
      <div className="flex-1 truncate">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary">{index + 1}</span>
          <span className="text-sm font-medium truncate text-foreground">
            {question.title || "Empty question"}
          </span>
        </div>
      </div>
      
      {config && (
        <div className="text-muted-foreground flex items-center justify-center">
          {typeof config.icon === "string" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={config.icon} /></svg>
          ) : (
            config.icon
          )}
        </div>
      )}
    </div>
  );
}

export function BuilderSidebar({ formId, questions, activeQuestionId, setActiveQuestionId }: BuilderSidebarProps) {
  const addQuestion = useAddQuestion(formId);
  const updateOrder = useReorderQuestions(formId);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      const newQuestions = arrayMove(questions, oldIndex, newIndex);
      updateOrder.mutate(newQuestions.map((q, index) => ({ question_id: q.id, position: index })));
    }
  };

  const handleAddQuestion = (type: string) => {
    addQuestion.mutate({
      type,
      title: "",
      required: false,
    }, {
      onSuccess: (newQuestion) => {
        setActiveQuestionId(newQuestion.id);
        setIsPopoverOpen(false);
      }
    });
  };

  return (
    <aside className="w-72 bg-[#fafafa] border-r border-border/60 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border/40 bg-white">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger className="w-full flex items-center justify-center gap-2 bg-[#2d2d2d] hover:bg-[#1a1a1a] text-white px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add content
          </PopoverTrigger>
          <PopoverContent side="right" align="start" className="w-[800px] p-6 rounded-2xl shadow-2xl border-border/50 overflow-hidden">
            <div className="flex flex-col h-full max-h-[600px]">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 border-b border-border/40 pb-4">
                <button className="text-sm font-semibold px-3 py-1.5 bg-muted rounded-full">Add form elements</button>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Import questions</button>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Create with AI
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6 w-64">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search form elements" className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm outline-none focus:border-primary transition-colors" />
              </div>

              {/* Grid of Categories */}
              <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-8">
                
                {/* Column 1: Text & Contact */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Text & Contact</h4>
                    <div className="space-y-1">
                      <MenuItem 
                        icon={getQuestionTypeConfig("text")?.icon} 
                        label="Short Text" 
                        onClick={() => handleAddQuestion("text")} 
                      />
                      <MenuItem 
                        icon={getQuestionTypeConfig("long_text")?.icon} 
                        label="Long Text" 
                        onClick={() => handleAddQuestion("long_text")} 
                      />
                      <MenuItem 
                        icon={getQuestionTypeConfig("email")?.icon} 
                        label="Email" 
                        onClick={() => handleAddQuestion("email")} 
                      />
                      <MenuItem 
                        icon={getQuestionTypeConfig("number")?.icon} 
                        label="Number" 
                        onClick={() => handleAddQuestion("number")} 
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Choice & Rating */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Choice & Rating</h4>
                    <div className="space-y-1">
                      <MenuItem 
                        icon={getQuestionTypeConfig("multiple_choice")?.icon} 
                        label="Multiple Choice" 
                        onClick={() => handleAddQuestion("multiple_choice")} 
                      />
                      <MenuItem 
                        icon={getQuestionTypeConfig("dropdown")?.icon} 
                        label="Dropdown" 
                        onClick={() => handleAddQuestion("dropdown")} 
                      />
                      <MenuItem 
                        icon={getQuestionTypeConfig("yes_no")?.icon} 
                        label="Yes/No" 
                        onClick={() => handleAddQuestion("yes_no")} 
                      />
                      <MenuItem 
                        icon={getQuestionTypeConfig("rating")?.icon} 
                        label="Rating" 
                        onClick={() => handleAddQuestion("rating")} 
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pages</h3>
        </div>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((q, index) => (
              <SortableNavItem
                key={q.id}
                question={q}
                index={index}
                isActive={activeQuestionId === q.id}
                onClick={() => setActiveQuestionId(q.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
}
