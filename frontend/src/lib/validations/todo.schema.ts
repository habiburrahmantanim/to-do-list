import { z } from "zod";

const optionalString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `Maximum length is ${maxLength} characters`)
    .optional()
    .or(z.literal(""));

export const todoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title is too long"),
  description: optionalString(1000),
  priority: z.enum(["low", "medium", "high"], {
    message: "Priority is required",
  }),
  category: optionalString(60),
  dueDate: z.string().optional().or(z.literal("")),
  completed: z.boolean().optional(),
});

export const todoFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "pending", "completed"]).optional(),
  priority: z.enum(["all", "low", "medium", "high"]).optional(),
  category: z.string().optional(),
  sort: z
    .enum(["newest", "oldest", "dueDate", "priority", "alphabetical"])
    .optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});

export type TodoFormValues = z.infer<typeof todoSchema>;
export type TodoFilterValues = z.infer<typeof todoFiltersSchema>;
