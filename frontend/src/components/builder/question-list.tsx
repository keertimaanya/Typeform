/**
 * Question List — the sortable container using dnd-kit.
 *
 * WHY dnd-kit over react-beautiful-dnd?
 * - react-beautiful-dnd is unmaintained (archived)
 * - dnd-kit is modular (only import what you need)
 * - Better performance with CSS transforms instead of layout shifts
 * - Works with any element (not just lists)
 * - Built-in keyboard and screen reader accessibility
 *
 * How it works:
 * 1. DndContext wraps the sortable area
 * 2. SortableContext provides the list of IDs
 * 3. Each QuestionCard uses useSortable() to become draggable
 * 4. On drag end, we calculate new positions and call the reorder API
 */

"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { QuestionCard } from "./question-card";
import { useReorderQuestions } from "@/hooks/useBuilder";
import { toast } from "sonner";
import type { Question } from "@/types/form";

interface QuestionListProps {
  questions: Question[];
  formId: number;
}

export function QuestionList({ questions, formId }: QuestionListProps) {
  const [items, setItems] = useState<Question[]>(questions);
  const reorderQuestions = useReorderQuestions(formId);

  // Keep local state in sync with server data
  if (
    questions.length !== items.length ||
    questions.some((q, i) => q.id !== items[i]?.id || q.title !== items[i]?.title || q.type !== items[i]?.type || q.required !== items[i]?.required || q.description !== items[i]?.description)
  ) {
    setItems(questions);
  }

  // Sensors: pointer (mouse/touch) + keyboard (a11y)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((q) => q.id === active.id);
    const newIndex = items.findIndex((q) => q.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistic reorder in local state
    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setItems(reordered);

    // Send new positions to backend
    const reorderItems = reordered.map((q, i) => ({
      question_id: q.id,
      position: i + 1,
    }));

    try {
      await reorderQuestions.mutateAsync(reorderItems);
    } catch {
      setItems(questions); // Revert on failure
      toast.error("Failed to reorder questions");
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/20 dark:to-fuchsia-900/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        </div>
        <h3 className="text-base font-semibold mb-1">No questions yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Click a question type from the sidebar to start building your form.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              formId={formId}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
