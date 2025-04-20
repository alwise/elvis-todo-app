import { Id } from "@/convex/_generated/dataModel";

export type Todo = {
  _id: Id<"todos">;
  _creationTime: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  priority: "low" | "medium" | "high";
  tags?: string[];
  position: number;
};

export type TodoInput = Omit<
  Todo,
  | "_id"
  | "_creationTime"
  | "createdAt"
  | "updatedAt"
  | "isCompleted"
  | "position"
>;

export type TodoId = Id<"todos">;
