// context/DropContext.tsx
import React, {
  useRef,
  createContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  DropProviderProps,
  DropProviderRef,
  DroppedItemsMap,
  DropSlot,
  SlotsContextValue,
  SlotsContext,
  PositionUpdateListener,
} from "../types/context";

/**
 * Provider component that enables drag-and-drop functionality for its children.
 *
 * The DropProvider creates the context necessary for draggable and droppable components
 * to communicate with each other. It manages the registration of drop zones, tracks
 * active hover states, handles collision detection, and maintains the state of dropped items.
 *
 * @example
 * Basic setup:
 * ```typescript
 * import { DropProvider } from './context/DropContext';
 * import { Draggable, Droppable } from './components';
 *
 * function App() {
 *   return (
 *     <DropProvider>
 *       <View style={styles.container}>
 *         <Draggable data={{ id: '1', name: 'Item 1' }}>
 *           <Text>Drag me!</Text>
 *         </Draggable>
 *
 *         <Droppable onDrop={(data) => console.log('Dropped:', data)}>
 *           <Text>Drop zone</Text>
 *         </Droppable>
 *       </View>
 *     </DropProvider>
 *   );
 * }
 * ```
 *
 * @example
 * With callbacks and ref:
 * ```typescript
 * function AdvancedApp() {
 *   const dropProviderRef = useRef<DropProviderRef>(null);
 *   const [droppedItems, setDroppedItems] = useState({});
 *
 *   const handleLayoutChange = () => {
 *     // Trigger position update after layout changes
 *     dropProviderRef.current?.requestPositionUpdate();
 *   };
 *
 *   return (
 *     <DropProvider
 *       ref={dropProviderRef}
 *       onDroppedItemsUpdate={setDroppedItems}
 *       onDragStart={(data) => console.log('Drag started:', data)}
 *       onDragEnd={(data) => console.log('Drag ended:', data)}
 *       onDragging={({ x, y, itemData }) => {
 *         console.log(`${itemData.name} at (${x}, ${y})`);
 *       }}
 *     >
 *       <ScrollView onLayout={handleLayoutChange}>
 *         {/* Your draggable and droppable components *\/}
 *       </ScrollView>
 *     </DropProvider>
 *   );
 * }
 * ```
 *
 * @example
 * Multiple drop zones with capacity:
 * ```typescript
 * function TaskBoard() {
 *   const [tasks, setTasks] = useState(initialTasks);
 *
 *   return (
 *     <DropProvider
 *       onDroppedItemsUpdate={(dropped) => {
 *         // Update task positions based on drops
 *         updateTaskPositions(dropped);
 *       }}
 *     >
 *       <View style={styles.board}>
 *         {tasks.map(task => (
 *           <Draggable key={task.id} data={task}>
 *             <TaskCard task={task} />
 *           </Draggable>
 *         ))}
 *
 *         <Droppable
 *           droppableId="todo"
 *           capacity={10}
 *           onDrop={(task) => moveTask(task.id, 'todo')}
 *         >
 *           <Column title="To Do" />
 *         </Droppable>
 *
 *         <Droppable
 *           droppableId="in-progress"
 *           capacity={5}
 *           onDrop={(task) => moveTask(task.id, 'in-progress')}
 *         >
 *           <Column title="In Progress" />
 *         </Droppable>
 *
 *         <Droppable
 *           droppableId="done"
 *           onDrop={(task) => moveTask(task.id, 'done')}
 *         >
 *           <Column title="Done" />
 *         </Droppable>
 *       </View>
 *     </DropProvider>
 *   );
 * }
 * ```
 *
 * @see {@link Draggable} for draggable components
 * @see {@link Droppable} for droppable components
 * @see {@link useDraggable} for draggable hook
 * @see {@link useDroppable} for droppable hook
 * @see {@link DropProviderRef} for imperative handle interface
 * @see {@link DroppedItemsMap} for dropped items data structure
 */
// The DropProvider component, now forwardRef
export const DropProvider = forwardRef<DropProviderRef, DropProviderProps>(
  (
    {
      children,
      onLayoutUpdateComplete,
      onDroppedItemsUpdate,
      onDragging,
      onDragStart,
      onDragEnd,
    }: DropProviderProps,
    ref: React.ForwardedRef<DropProviderRef>
  ): React.ReactElement => {
    const slotsRef = useRef<Record<number, DropSlot<any>>>({});
    const [activeHoverSlotId, setActiveHoverSlotIdState] = useState<
      number | null
    >(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // New state for tracking dropped items
    const [droppedItems, setDroppedItems] = useState<DroppedItemsMap>({});

    const positionUpdateListenersRef = useRef<
      Record<string, PositionUpdateListener>
    >({});

    const registerPositionUpdateListener = useCallback(
      (id: string, listener: PositionUpdateListener) => {
        positionUpdateListenersRef.current[id] = listener;
      },
      []
    );

    const unregisterPositionUpdateListener = useCallback((id: string) => {
      delete positionUpdateListenersRef.current[id];
    }, []);

    // Call the update callback whenever droppedItems changes
    useEffect(() => {
      if (onDroppedItemsUpdate) {
        onDroppedItemsUpdate(droppedItems);
      }
    }, [droppedItems, onDroppedItemsUpdate]);

    // Update method to use string IDs
    const registerDroppedItem = useCallback(
      (draggableId: string, droppableId: string, itemData: any) => {
        setDroppedItems((prev) => ({
          ...prev,
          [draggableId]: {
            droppableId,
            data: itemData,
          },
        }));
      },
      []
    );

    const unregisterDroppedItem = useCallback((draggableId: string) => {
      setDroppedItems((prev) => {
        const newItems = { ...prev };
        delete newItems[draggableId];
        return newItems;
      });
    }, []);

    const getDroppedItems = useCallback(() => {
      return droppedItems;
    }, [droppedItems]);

    // This is the actual function that does the work
    const internalRequestPositionUpdate = useCallback(() => {
      const listeners = positionUpdateListenersRef.current;
      Object.values(listeners).forEach((listener) => {
        listener();
      });
      onLayoutUpdateComplete?.();
    }, [onLayoutUpdateComplete]);

    // Expose requestPositionUpdate and getDroppedItems via ref
    useImperativeHandle(ref, () => ({
      requestPositionUpdate: internalRequestPositionUpdate,
      getDroppedItems,
    }));

    // Add a method to check if a droppable has capacity available
    const hasAvailableCapacity = useCallback(
      (droppableId: string) => {
        // Find all draggables currently dropped on this droppable
        const droppedCount = Object.values(droppedItems).filter(
          (item) => item.droppableId === droppableId
        ).length;

        // Find the droppable's registered capacity
        const droppableSlot = Object.values(slotsRef.current).find(
          (slot) => slot.id === droppableId
        );

        if (!droppableSlot) return false; // Not found or not registered

        // Use the slot's capacity if specified, default to 1
        const capacity =
          droppableSlot.capacity !== undefined ? droppableSlot.capacity : 1;

        // Check if more capacity is available
        return droppedCount < capacity;
      },
      [droppedItems]
    );

    // Create a wrapper for onDragStart that also triggers position update
    const handleDragStart = useCallback(
      (data: any) => {
        setIsDragging(true);
        if (onDragStart) {
          onDragStart(data);
        }
        internalRequestPositionUpdate();
      },
      [onDragStart, internalRequestPositionUpdate, setIsDragging]
    );

    const handleDragEnd = useCallback(
      (data: any) => {
        setIsDragging(false);
        if (onDragEnd) {
          onDragEnd(data);
        }
        internalRequestPositionUpdate();
      },
      [onDragEnd, internalRequestPositionUpdate, setIsDragging]
    );

    // Update the context value with the new method
    const contextValue = useMemo<SlotsContextValue<any>>(
      () => ({
        register: (id, slot) => {
          slotsRef.current[id] = slot;
        },
        unregister: (id) => {
          delete slotsRef.current[id];
        },
        isRegistered: (id) => {
          return slotsRef.current[id] !== undefined;
        },
        getSlots: () => slotsRef.current,
        setActiveHoverSlot: (id: number | null) =>
          setActiveHoverSlotIdState(id),
        activeHoverSlotId,
        registerPositionUpdateListener,
        unregisterPositionUpdateListener,
        requestPositionUpdate: internalRequestPositionUpdate,
        registerDroppedItem,
        unregisterDroppedItem,
        getDroppedItems,
        hasAvailableCapacity,
        isDragging,
        onDragging,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
      }),
      [
        activeHoverSlotId,
        registerPositionUpdateListener,
        unregisterPositionUpdateListener,
        internalRequestPositionUpdate,
        registerDroppedItem,
        unregisterDroppedItem,
        getDroppedItems,
        hasAvailableCapacity,
        isDragging,
        onDragging,
        handleDragStart,
        onDragEnd,
        handleDragEnd,
      ]
    );

    return (
      <SlotsContext.Provider value={contextValue as SlotsContextValue<any>}>
        {children}
      </SlotsContext.Provider>
    );
  }
);

// Adding a display name for better debugging in React DevTools
DropProvider.displayName = "DropProvider";
