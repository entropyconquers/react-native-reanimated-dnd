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
  DropAlignment,
  DropOffset,
  DroppedItemsMap,
  DropSlot,
  PositionUpdateListener,
  SlotsContextValue,
  DropProviderProps,
  DropProviderRef,
} from "../types/context";

// Default context value using 'any' for broad compatibility
const defaultSlotsContextValue: SlotsContextValue<any> = {
  register: (_id: number, _slot: DropSlot<any>) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: register called without a Provider.");
    }
  },
  unregister: (_id: number) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: unregister called without a Provider.");
    }
  },
  getSlots: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: getSlots called without a Provider.");
    }
    return {} as Record<number, DropSlot<any>>;
  },
  isRegistered: (_id: number) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: isRegistered called without a Provider.");
    }
    return false;
  },
  setActiveHoverSlot: (_id: number | null) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: setActiveHoverSlot called without a Provider."
      );
    }
  },
  activeHoverSlotId: null,
  registerPositionUpdateListener: (
    _id: string,
    _listener: PositionUpdateListener
  ) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: registerPositionUpdateListener called without a Provider."
      );
    }
  },
  unregisterPositionUpdateListener: (_id: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: unregisterPositionUpdateListener called without a Provider."
      );
    }
  },
  requestPositionUpdate: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: requestPositionUpdate called without a Provider (internally)."
      );
    }
  },
  // Update default implementations
  registerDroppedItem: (
    _draggableId: string,
    _droppableId: string,
    _itemData: any
  ) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: registerDroppedItem called without a Provider."
      );
    }
  },
  unregisterDroppedItem: (_draggableId: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: unregisterDroppedItem called without a Provider."
      );
    }
  },
  getDroppedItems: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: getDroppedItems called without a Provider.");
    }
    return {} as DroppedItemsMap<any>;
  },
  hasAvailableCapacity: (_droppableId: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "SlotsContext: hasAvailableCapacity called without a Provider."
      );
    }
    return false;
  },
  onDragging: (payload: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    itemData: any;
  }) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: onDragging called without a Provider.");
    }
  },
  onDragStart: (data: any) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: onDragStart called without a Provider.");
    }
  },
  onDragEnd: (data: any) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("SlotsContext: onDragEnd called without a Provider.");
    }
  },
};

// Create the context
export const SlotsContext = createContext<SlotsContextValue<any>>(
  defaultSlotsContextValue
);

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
        if (onDragStart) {
          onDragStart(data);
        }
        internalRequestPositionUpdate();
      },
      [onDragStart, internalRequestPositionUpdate]
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
        onDragging,
        onDragStart: handleDragStart,
        onDragEnd,
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
        onDragging,
        handleDragStart,
        onDragEnd,
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
