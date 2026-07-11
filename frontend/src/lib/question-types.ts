/**
 * Question type definitions — the 8 types available in the builder sidebar.
 * Each type has an icon (SVG path), label, default title, and optional default settings.
 */

export interface QuestionTypeConfig {
  type: string;
  label: string;
  icon: string; // SVG path data
  defaultTitle: string;
  defaultSettings?: Record<string, unknown>;
}

export const QUESTION_TYPES: QuestionTypeConfig[] = [
  {
    type: "text",
    label: "Short Text",
    icon: "M4 7V4h16v3M9 20h6M12 4v16",
    defaultTitle: "Short text question",
  },
  {
    type: "long_text",
    label: "Long Text",
    icon: "M17 6.1H3M21 12.1H3M15.1 18H3",
    defaultTitle: "Long text question",
  },
  {
    type: "multiple_choice",
    label: "Multiple Choice",
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    defaultTitle: "Multiple choice question",
    defaultSettings: { choices: ["Option 1", "Option 2", "Option 3"] },
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: "M6 9l6 6 6-6",
    defaultTitle: "Dropdown question",
    defaultSettings: { choices: ["Option 1", "Option 2", "Option 3"] },
  },
  {
    type: "email",
    label: "Email",
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    defaultTitle: "Your email address",
  },
  {
    type: "number",
    label: "Number",
    icon: "M4 17l6-12 6 12M7.5 11h9",
    defaultTitle: "Number question",
  },
  {
    type: "yes_no",
    label: "Yes / No",
    icon: "M7 10l5 5 5-5",
    defaultTitle: "Yes or no question",
  },
  {
    type: "rating",
    label: "Rating",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    defaultTitle: "Rating question",
    defaultSettings: { min: 1, max: 5 },
  },
];

/** Get config for a question type */
export function getQuestionTypeConfig(type: string): QuestionTypeConfig | undefined {
  return QUESTION_TYPES.find((t) => t.type === type);
}
