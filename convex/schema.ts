import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema
 * @returns The schema for the todos table
 */
export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    isCompleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    tags: v.optional(v.array(v.string())),
    position: v.number(),
  }),
});
