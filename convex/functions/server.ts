"use server";

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

/**
 * Create a new todo
 * @param ctx - The context object
 * @param args - The arguments object
 * @returns The created todo
 */
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const todos = await ctx.db.query("todos").collect();
    const position = todos.length;
    return await ctx.db.insert("todos", {
      ...args,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
      position,
    });
  },
});

/**
 * Get all todos
 * @param ctx - The context object
 * @returns The todos
 */
export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});

/**
 * Update a todo
 * @param ctx - The context object
 * @param args - The arguments object
 * @returns The updated todo
 */
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
    dueDate: v.optional(v.number()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    return await ctx.db.patch(id, {
      ...rest,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete a todo
 * @param ctx - The context object
 * @param args - The arguments object
 * @returns The deleted todo
 */
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Reorder the position of todos
 * @param ctx - The context object
 * @param args - The arguments object
 * @returns The reordered todos
 */
export const reorderTodos = mutation({
  args: {
    // ids, newPositions
    newPositions: v.array(
      v.object({
        id: v.id("todos"),
        newPosition: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { newPositions } = args;
    const todos = await ctx.db.query("todos").collect();
    const sortedTodos = newPositions.map(({ id, newPosition }) => {
      const todo = todos.find((todo) => todo._id === id);
      if (!todo) {
        throw new Error("Todo not found");
      }
      return { ...todo, position: newPosition };
    });

    // Update each todo with its new position
    for (const todo of sortedTodos) {
      await ctx.db.patch(todo._id, { position: todo.position });
    }
  },
});
