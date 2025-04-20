import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TodoInput } from "@/types/todo";
import { Todo } from "@/types/todo";

interface UseTodoReturn {
  todos: Todo[];
  isSubmitting: boolean;
  error: Error | null;
  createTodo: (todo: string) => Promise<void>;
  updateTodo: (id: Id<"todos">, updates: Partial<TodoInput>) => Promise<void>;
  deleteTodo: (id: Id<"todos">) => Promise<void>;
  toggleTodo: (id: Id<"todos">) => Promise<void>;
  reorder: (
    newPositions: { id: Id<"todos">; newPosition: number }[]
  ) => Promise<void>;
}

/**
 * useTodo is the hook for the todo item.
 * It is used to create, update, delete, and toggle the todo item.
 * @returns The useTodo hook.
 */
export function useTodo(): UseTodoReturn {
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const todos = useQuery(api.functions.server.getTodos) ?? [];
  const createMutation = useMutation(api.functions.server.createTodo);
  const updateMutation = useMutation(api.functions.server.updateTodo);
  const deleteMutation = useMutation(api.functions.server.deleteTodo);
  const reorderMutation = useMutation(
    api.functions.server.reorderTodos
  ).withOptimisticUpdate((localStore, args) => {
    const { newPositions } = args;
    const previousTodos = localStore.getQuery(
      api.functions.server.getTodos,
      undefined
    );
    const newTodos = previousTodos?.map((todo) => {
      //   const oldIndex = todo.position;
      const newIndex = newPositions.findIndex(
        (position) => position.id === todo._id
      );
      return { ...todo, position: newIndex };
    });

    // Sort the todos by position
    // const sortedTodos = newTodos?.sort((a, b) => a.position - b.position);
    // Update the todos in the local store
    localStore.setQuery(api.functions.server.getTodos, {}, newTodos);
  });

  /**
   * createTodo is the function to create a new todo
   * @param todo - The todo item to create
   * @returns void
   */
  const createTodo = async (todo: string) => {
    try {
      setIsSubmitting(true);
      await createMutation({
        title: todo,
        description: "No description",
        priority: "low",
        tags: [],
        dueDate: new Date().getTime(),
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create todo"));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * updateTodo is the function to update a todo
   * @param id - The id of the todo
   * @param updates - The updates to the todo
   * @returns void
   */
  const updateTodo = async (id: Id<"todos">, updates: Partial<TodoInput>) => {
    try {
      setIsSubmitting(true);
      await updateMutation({ id, ...updates });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update todo"));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * deleteTodo is the function to delete a todo
   * @param id - The id of the todo
   * @returns void
   */
  const deleteTodo = async (id: Id<"todos">) => {
    try {
      setIsSubmitting(true);
      await deleteMutation({ id });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete todo"));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * toggleTodo is the function to toggle a todo
   * @param id - The id of the todo
   * @returns void
   */
  const toggleTodo = async (id: Id<"todos">) => {
    try {
      setIsSubmitting(true);
      const todo = todos.find((t: Todo) => t._id === id);
      if (todo) {
        await updateMutation({ id, isCompleted: !todo.isCompleted });
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to toggle todo"));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * reorder is the function to reorder the todos
   * @param newPositions - The new positions of the todos
   * @returns void
   */
  const reorder = async (
    newPositions: { id: Id<"todos">; newPosition: number }[]
  ) => {
    try {
      setIsSubmitting(true);
      const currentTodos = todos;
      const newTodos = [...currentTodos];

      newPositions.forEach(({ id, newPosition }) => {
        const todoIndex = newTodos.findIndex((todo) => todo._id === id);
        if (todoIndex !== -1) {
          const [todo] = newTodos.splice(todoIndex, 1);
          newTodos.splice(newPosition, 0, todo);
        }
      });

      await reorderMutation({ newPositions });
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to reorder todos")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    todos,
    isSubmitting,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorder,
  };
}
