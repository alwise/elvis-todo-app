"use client"

/**
 *@author Elvis Kemevor
 *@version 1.0.0
 *@description This is the TodoItem component.
 */
import { useCallback } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Button } from "@/components/ui/button"
import { SortableTodoItem } from "@/components/sortable-todo-items"
import { useTodo } from "@/hooks/use-todo"
import { Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"


/**
 * TodoItems is the component for the TodoItem.
 * It is used to display the todo item in the todo list.
 * @returns The TodoItems component.
 */
export default function TodoItems() {
    // const [newTodo, setNewTodo] = useState("")
    const { todos, reorder, createTodo, updateTodo, deleteTodo, toggleTodo, isSubmitting } = useTodo();

    /**
     * Drag and drop sensors is the sensors for the TodoItem.
     */
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    /**
     * handleDragEnd is the function to handle the drag end event.
     * It reorders the todo items.
     * @param event The drag end event.
     * @returns void
     */

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = todos.findIndex((todo) => todo._id === active.id)
            const newIndex = todos.findIndex((todo) => todo._id === over?.id)
            const newPositions = arrayMove(todos, oldIndex, newIndex)
            reorder(newPositions.map((todo, index) => ({ id: todo._id, newPosition: index })))
        }
    }, [todos, reorder])

    return (
        <>
            <header className="flex z-10 fixed h-20 top-0 bg-black/90 backdrop-blur-sm w-full">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-white text-xl md:text-2xl font-bold">Todo By Elvis</h1>
                    </div>
                    <Button variant="outline" onClick={() => createTodo("New todo")}>
                        <Plus size={16} />
                        <span className="">Add Todo</span>
                    </Button>
                </div>
                {/* is submitting notification */}
                <div className={cn("absolute z-5 bg-black/90 backdrop-blur-sm rounded-md px-4 py-1 top-16 left-1/2 -translate-x-1/2", isSubmitting && "opacity-100", !isSubmitting && "opacity-0")}>
                    <p className="text-white animate-pulse flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} />
                        Saving...
                    </p>
                </div>
            </header>
            <div className="space-y-4 w-full mt-[8rem] px-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}>
                    <SortableContext items={todos.map((todo) => todo._id)} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-5 max-w-4xl mx-auto">
                            {todos.sort((a, b) => a.position - b.position).map((todo) => (
                                <SortableTodoItem key={todo._id} todo={todo} onToggle={toggleTodo} onRemove={deleteTodo} onUpdate={updateTodo} />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
                {todos.length === 0 && <p className="text-center text-muted-foreground">No tasks yet. Add one above!</p>}

            </div>
        </>
    )
}
