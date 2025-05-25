// Node Modules
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useDroppable } from "../hooks/useDroppable";
import { UseDroppableOptions } from "../types/droppable";

let _nextDroppableId = 1;
export const _getUniqueDroppableId = (): number => {
  return _nextDroppableId++;
};

export { UseDroppableOptions };

/**
 * Props for the Droppable component.
 *
 * @template TData - The type of data that can be dropped on this droppable
 */
interface DroppableProps<TData = unknown> extends UseDroppableOptions<TData> {
  /** Style to apply to the droppable container */
  style?: StyleProp<ViewStyle>;
  /** The content to render inside the droppable */
  children: React.ReactNode;
}

/**
 * A component that creates drop zones for receiving draggable items.
 *
 * The Droppable component provides visual feedback when draggable items hover over it
 * and handles the drop logic when items are released. It integrates seamlessly with
 * the drag-and-drop context to provide collision detection and proper positioning
 * of dropped items.
 *
 * @template TData - The type of data that can be dropped on this droppable
 * @param props - Configuration props for the droppable component
 *
 * @example
 * Basic drop zone:
 * ```typescript
 * import { Droppable } from './components/Droppable';
 *
 * function BasicDropZone() {
 *   const handleDrop = (data) => {
 *     console.log('Item dropped:', data);
 *     // Handle the dropped item
 *     addItemToList(data);
 *   };
 *
 *   return (
 *     <Droppable onDrop={handleDrop}>
 *       <View style={styles.dropZone}>
 *         <Text>Drop items here</Text>
 *       </View>
 *     </Droppable>
 *   );
 * }
 * ```
 *
 * @example
 * Drop zone with visual feedback:
 * ```typescript
 * function VisualDropZone() {
 *   const [isHovered, setIsHovered] = useState(false);
 *
 *   return (
 *     <Droppable
 *       onDrop={(data) => {
 *         console.log('Dropped:', data.name);
 *         processDroppedItem(data);
 *       }}
 *       onActiveChange={setIsHovered}
 *       activeStyle={{
 *         backgroundColor: 'rgba(0, 255, 0, 0.2)',
 *         borderColor: '#00ff00',
 *         borderWidth: 2,
 *         transform: [{ scale: 1.05 }]
 *       }}
 *       style={styles.dropZone}
 *     >
 *       <View style={[
 *         styles.dropContent,
 *         isHovered && styles.hoveredContent
 *       ]}>
 *         <Icon
 *           name="cloud-upload"
 *           size={32}
 *           color={isHovered ? '#00ff00' : '#666'}
 *         />
 *         <Text style={styles.dropText}>
 *           {isHovered ? 'Release to drop' : 'Drag files here'}
 *         </Text>
 *       </View>
 *     </Droppable>
 *   );
 * }
 * ```
 *
 * @example
 * Drop zone with custom alignment and capacity:
 * ```typescript
 * function TaskColumn() {
 *   const [tasks, setTasks] = useState([]);
 *   const maxTasks = 5;
 *
 *   return (
 *     <Droppable
 *       droppableId="todo-column"
 *       onDrop={(task) => {
 *         if (tasks.length < maxTasks) {
 *           setTasks(prev => [...prev, task]);
 *           updateTaskStatus(task.id, 'todo');
 *         }
 *       }}
 *       dropAlignment="top-center"
 *       dropOffset={{ x: 0, y: 10 }}
 *       capacity={maxTasks}
 *       activeStyle={{
 *         backgroundColor: 'rgba(59, 130, 246, 0.1)',
 *         borderColor: '#3b82f6',
 *         borderWidth: 2,
 *         borderStyle: 'dashed'
 *       }}
 *       style={styles.column}
 *     >
 *       <Text style={styles.columnTitle}>
 *         To Do ({tasks.length}/{maxTasks})
 *       </Text>
 *
 *       {tasks.map(task => (
 *         <TaskCard key={task.id} task={task} />
 *       ))}
 *
 *       {tasks.length === 0 && (
 *         <Text style={styles.emptyText}>
 *           Drop tasks here
 *         </Text>
 *       )}
 *     </Droppable>
 *   );
 * }
 * ```
 *
 * @example
 * Conditional drop zone with validation:
 * ```typescript
 * function RestrictedDropZone() {
 *   const [canAcceptFiles, setCanAcceptFiles] = useState(true);
 *   const [uploadProgress, setUploadProgress] = useState(0);
 *
 *   const handleDrop = (fileData) => {
 *     // Validate file type and size
 *     if (fileData.type !== 'image') {
 *       showError('Only image files are allowed');
 *       return;
 *     }
 *
 *     if (fileData.size > 5000000) { // 5MB limit
 *       showError('File size must be under 5MB');
 *       return;
 *     }
 *
 *     // Start upload
 *     setCanAcceptFiles(false);
 *     uploadFile(fileData, setUploadProgress)
 *       .then(() => {
 *         showSuccess('File uploaded successfully');
 *         setCanAcceptFiles(true);
 *         setUploadProgress(0);
 *       })
 *       .catch(() => {
 *         showError('Upload failed');
 *         setCanAcceptFiles(true);
 *         setUploadProgress(0);
 *       });
 *   };
 *
 *   return (
 *     <Droppable
 *       onDrop={handleDrop}
 *       dropDisabled={!canAcceptFiles}
 *       onActiveChange={(active) => {
 *         if (active && !canAcceptFiles) {
 *           showTooltip('Upload in progress...');
 *         }
 *       }}
 *       activeStyle={{
 *         backgroundColor: canAcceptFiles
 *           ? 'rgba(34, 197, 94, 0.1)'
 *           : 'rgba(239, 68, 68, 0.1)',
 *         borderColor: canAcceptFiles ? '#22c55e' : '#ef4444'
 *       }}
 *       style={[
 *         styles.uploadZone,
 *         !canAcceptFiles && styles.disabled
 *       ]}
 *     >
 *       <View style={styles.uploadContent}>
 *         {uploadProgress > 0 ? (
 *           <>
 *             <ProgressBar progress={uploadProgress} />
 *             <Text>Uploading... {Math.round(uploadProgress * 100)}%</Text>
 *           </>
 *         ) : (
 *           <>
 *             <Icon
 *               name="image"
 *               size={48}
 *               color={canAcceptFiles ? '#22c55e' : '#ef4444'}
 *             />
 *             <Text style={styles.uploadText}>
 *               {canAcceptFiles
 *                 ? 'Drop images here (max 5MB)'
 *                 : 'Upload in progress...'}
 *             </Text>
 *           </>
 *         )}
 *       </View>
 *     </Droppable>
 *   );
 * }
 * ```
 *
 * @example
 * Multiple drop zones with different behaviors:
 * ```typescript
 * function MultiDropZoneExample() {
 *   const [items, setItems] = useState([]);
 *   const [trash, setTrash] = useState([]);
 *
 *   return (
 *     <DropProvider>
 *       <View style={styles.container}>
 *         {/* Source items *\/}
 *         {items.map(item => (
 *           <Draggable key={item.id} data={item}>
 *             <ItemCard item={item} />
 *           </Draggable>
 *         ))}
 *
 *         {/* Archive drop zone *\/}
 *         <Droppable
 *           droppableId="archive"
 *           onDrop={(item) => {
 *             archiveItem(item.id);
 *             setItems(prev => prev.filter(i => i.id !== item.id));
 *           }}
 *           dropAlignment="center"
 *           activeStyle={styles.archiveActive}
 *         >
 *           <View style={styles.archiveZone}>
 *             <Icon name="archive" size={24} />
 *             <Text>Archive</Text>
 *           </View>
 *         </Droppable>
 *
 *         {/* Trash drop zone *\/}
 *         <Droppable
 *           droppableId="trash"
 *           onDrop={(item) => {
 *             setTrash(prev => [...prev, item]);
 *             setItems(prev => prev.filter(i => i.id !== item.id));
 *           }}
 *           dropAlignment="center"
 *           activeStyle={styles.trashActive}
 *           capacity={10} // Max 10 items in trash
 *         >
 *           <View style={styles.trashZone}>
 *             <Icon name="trash" size={24} />
 *             <Text>Trash ({trash.length}/10)</Text>
 *           </View>
 *         </Droppable>
 *       </View>
 *     </DropProvider>
 *   );
 * }
 * ```
 *
 * @see {@link useDroppable} for the underlying hook
 * @see {@link Draggable} for draggable components
 * @see {@link DropAlignment} for alignment options
 * @see {@link DropOffset} for offset configuration
 * @see {@link UseDroppableOptions} for configuration options
 * @see {@link UseDroppableReturn} for hook return details
 * @see {@link DropProvider} for drag-and-drop context setup
 */
export const Droppable = <TData = unknown,>({
  onDrop,
  dropDisabled,
  onActiveChange,
  dropAlignment,
  dropOffset,
  activeStyle,
  droppableId,
  capacity,
  style,
  children,
}: DroppableProps<TData>): React.ReactElement => {
  const { viewProps, animatedViewRef } = useDroppable<TData>({
    onDrop,
    dropDisabled,
    onActiveChange,
    dropAlignment,
    dropOffset,
    activeStyle,
    droppableId,
    capacity,
  });

  // The style is now fully handled in the hook and returned via viewProps.style
  return (
    <Animated.View
      ref={animatedViewRef}
      {...viewProps}
      style={[style, viewProps.style]}
      collapsable={false}
    >
      {children}
    </Animated.View>
  );
};
