"use client"

/**
 *@author Elvis Kemevor
 *@version 1.0.0
 *@description This is the SortableTodoItem component.
 */
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"
import type { Todo, TodoId } from "@/types/todo"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"
// import { Input } from "@/components/ui/input"

/**
 * SortableTodoItemProps is the props for the SortableTodoItem component.
 * It is used to pass the todo, onToggle, and onRemove functions to the component.
 */
interface SortableTodoItemProps {
    todo: Todo
    onToggle: (id: TodoId) => void
    onRemove: (id: TodoId) => void
    onUpdate: (id: TodoId, updates: Partial<Todo>) => void
}

/**
 * SortableTodoItem is the component for the SortableTodoItem.
 * It is used to display the todo item in the todo list.
 * @param todo - The todo item to display.
 * @param onToggle - The function to call when the todo item is toggled.
 * @param onRemove - The function to call when the todo item is removed.
 * @returns The SortableTodoItem component.
 */
export function SortableTodoItem({ todo, onToggle, onRemove, onUpdate }: SortableTodoItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo._id })
    const [newInput, setNewInput] = useState(todo.title);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const debouncedUpdate = useDebounce((val) => onUpdate(todo._id, { title: val as string }), 500);
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTitle = e.target.value;
        setNewInput(newTitle);
        debouncedUpdate(newTitle);
    }
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // textarea height should be the same as the content
    const handleTextareaResize = () => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
    }

    useEffect(() => {
        handleTextareaResize();
    }, [newInput]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex group items-center p-4 rounded-lg transition-all duration-200",
                "hover:bg-muted/50",
                todo.isCompleted ? "bg-muted/30" : "bg-card",
                "border border-border/50"
            )}
        >
            <div className="flex items-center w-full gap-4">
                <div
                    {...attributes}
                    {...listeners}
                    className="p-2 cursor-grab touch-none text-muted-foreground hover:text-foreground transition-colors"
                >
                    <GripVertical size={20} />
                </div>

                <div className="flex-1 min-w-0">
                    {todo.isCompleted ? (
                        <p className="text-muted-foreground line-through break-words">{todo.title}</p>
                    ) : (
                        <textarea
                            ref={inputRef}
                            className="w-full resize-none focus:outline-none bg-transparent text-foreground"
                            value={newInput}
                            onChange={onInputChange}
                            autoFocus
                            onInput={handleTextareaResize}
                            placeholder="Enter your todo..."
                        />
                    )}
                </div>

                <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id={`todo-${todo._id}`}
                            checked={todo.isCompleted}
                            onCheckedChange={() => onToggle(todo._id)}
                            className="h-5 w-5"
                        />
                        <Label
                            htmlFor={`todo-${todo._id}`}
                            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer hidden md:block"
                        >
                            {todo.isCompleted ? 'Mark as not done' : 'Mark as done'}
                        </Label>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(todo._id)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}
