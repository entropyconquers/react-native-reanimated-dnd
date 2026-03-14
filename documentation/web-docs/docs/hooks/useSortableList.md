---
title: "useSortableList"
---

The `useSortableList` hook provides the foundational state management and utilities needed to create **vertical** sortable lists with drag-and-drop reordering capabilities.

## Overview

This hook handles position tracking, scroll synchronization, auto-scrolling, and provides helper functions for individual sortable items. It works in conjunction with `useSortable` to provide a complete vertical sortable solution.

> **Note**: For horizontal sortable lists, use [useHorizontalSortableList](./useHorizontalSortableList) instead.

## Basic Usage

```tsx
import { useSortableList } from "react-native-reanimated-dnd";
import { SortableItem } from "react-native-reanimated-dnd";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Learn React Native", completed: false },
    { id: "2", title: "Build an app", completed: false },
    { id: "3", title: "Deploy to store", completed: false },
  ]);

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList({
    data: tasks,
    itemHeight: 60,
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {tasks.map((task, index) => {
            const itemProps = getItemProps(task, index);
            return (
              <SortableItem key={task.id} {...itemProps}>
                <View style={styles.taskItem}>
                  <Text>{task.title}</Text>
                </View>
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

## Parameters

### UseSortableListOptions&lt;TData&gt;

| Option             | Type                                     | Default             | Description                                        |
| ------------------ | ---------------------------------------- | ------------------- | -------------------------------------------------- |
| `data`             | `TData[]`                                | **Required**        | Array of data items (must extend `{ id: string }`) |
| `itemHeight`       | `number`                                 | **Required**        | Height of each item in pixels                      |
| `itemKeyExtractor` | `(item: TData, index: number) => string` | `(item) => item.id` | Function to extract unique key from item           |

## Return Value

### UseSortableListReturn&lt;TData&gt;

| Property          | Type                                  | Description                                |
| ----------------- | ------------------------------------- | ------------------------------------------ |
| `positions`       | `SharedValue<{[id: string]: number}>` | Shared value tracking item positions       |
| `scrollY`         | `SharedValue<number>`                 | Current scroll position                    |
| `autoScroll`      | `SharedValue<ScrollDirection>`        | Auto-scroll direction state                |
| `scrollViewRef`   | `AnimatedRef<ScrollView>`             | Ref for the scroll view                    |
| `dropProviderRef` | `RefObject<DropProviderRef>`          | Ref for the drop provider                  |
| `handleScroll`    | `function`                            | Scroll event handler                       |
| `handleScrollEnd` | `function`                            | Scroll end handler                         |
| `contentHeight`   | `number`                              | Total content height                       |
| `getItemProps`    | `function`                            | Function to get props for individual items |

### getItemProps Function

The `getItemProps` function returns props needed for individual sortable items:

```tsx
const itemProps = getItemProps(item, index);
// Returns:
{
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight: number;
}
```

## Examples

### Basic Sortable List Setup

```tsx
function BasicTaskList() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Task 1", priority: "high" },
    { id: "2", title: "Task 2", priority: "medium" },
    { id: "3", title: "Task 3", priority: "low" },
  ]);

  const sortableListProps = useSortableList({
    data: tasks,
    itemHeight: 80,
  });

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = sortableListProps;

  const handleReorder = useCallback((id: string, from: number, to: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const [movedTask] = newTasks.splice(from, 1);
      newTasks.splice(to, 0, movedTask);
      return newTasks;
    });
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider ref={dropProviderRef}>
        <View style={styles.header}>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.subtitle}>{tasks.length} items</Text>
        </View>

        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ height: contentHeight }}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          showsVerticalScrollIndicator={false}
        >
          {tasks.map((task, index) => {
            const itemProps = getItemProps(task, index);
            return (
              <SortableItem key={task.id} {...itemProps} onMove={handleReorder}>
                <TaskCard task={task} />
              </SortableItem>
            );
          })}
        </Animated.ScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
});
```

### Custom Key Extractor

```tsx
interface CustomItem {
  uuid: string;
  name: string;
  order: number;
  category: string;
}

function CustomSortableList() {
  const [items, setItems] = useState<CustomItem[]>([
    { uuid: "a1b2c3", name: "Item 1", order: 0, category: "work" },
    { uuid: "d4e5f6", name: "Item 2", order: 1, category: "personal" },
    { uuid: "g7h8i9", name: "Item 3", order: 2, category: "work" },
  ]);

  const sortableListProps = useSortableList({
    data: items,
    itemHeight: 70,
    itemKeyExtractor: (item) => item.uuid, // Use uuid instead of id
  });

  const { getItemProps, ...otherProps } = sortableListProps;

  const handleReorder = useCallback(
    (uuid: string, from: number, to: number) => {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const [movedItem] = newItems.splice(from, 1);
        newItems.splice(to, 0, movedItem);

        // Update order values
        return newItems.map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    },
    []
  );

  return (
    <SortableListContainer {...otherProps}>
      {items.map((item, index) => {
        const itemProps = getItemProps(item, index);
        return (
          <SortableItem key={item.uuid} {...itemProps} onMove={handleReorder}>
            <CustomItemCard item={item} />
          </SortableItem>
        );
      })}
    </SortableListContainer>
  );
}
```

### Advanced List with State Management

```tsx
function AdvancedSortableList() {
  const [items, setItems] = useState(initialItems);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderCount, setReorderCount] = useState(0);
  const [lastReorderTime, setLastReorderTime] = useState(null);

  const sortableListProps = useSortableList({
    data: items,
    itemHeight: 100,
  });

  const handleReorder = useCallback(
    (id: string, from: number, to: number) => {
      const startTime = Date.now();
      setIsReordering(true);

      setItems((prevItems) => {
        const newItems = [...prevItems];
        const [movedItem] = newItems.splice(from, 1);
        newItems.splice(to, 0, movedItem);
        return newItems;
      });

      // Update metrics
      setReorderCount((prev) => prev + 1);
      setLastReorderTime(startTime);

      // Analytics
      analytics.track("list_reordered", {
        itemId: id,
        fromPosition: from,
        toPosition: to,
        totalItems: items.length,
        reorderCount: reorderCount + 1,
        timestamp: startTime,
      });

      // Auto-save with debouncing
      debouncedSave(items);

      // Reset reordering state
      setTimeout(() => setIsReordering(false), 300);
    },
    [items.length, reorderCount]
  );

  const handleDragStart = useCallback((id: string) => {
    setIsReordering(true);
    hapticFeedback();

    // Show global drag indicator
    showDragIndicator(true);
  }, []);

  const handleDragEnd = useCallback((id: string) => {
    setIsReordering(false);
    hideDragIndicator();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Advanced List</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Items: {items.length}</Text>
          <Text style={styles.statText}>Reorders: {reorderCount}</Text>
          {lastReorderTime && (
            <Text style={styles.statText}>
              Last: {formatTime(lastReorderTime)}
            </Text>
          )}
        </View>
      </View>

      {isReordering && (
        <View style={styles.reorderingIndicator}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text style={styles.reorderingText}>Reordering...</Text>
        </View>
      )}

      <SortableListContainer {...sortableListProps}>
        {items.map((item, index) => {
          const itemProps = sortableListProps.getItemProps(item, index);
          return (
            <SortableItem
              key={item.id}
              {...itemProps}
              onMove={handleReorder}
              onDragStart={handleDragStart}
              onDrop={handleDragEnd}
            >
              <AdvancedItemCard
                item={item}
                isReordering={isReordering}
                position={index + 1}
              />
            </SortableItem>
          );
        })}
      </SortableListContainer>
    </View>
  );
}
```

### Photo Gallery Sortable List

```tsx
function PhotoGallery() {
  const [photos, setPhotos] = useState(photoData);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemHeight = viewMode === "grid" ? 120 : 80;

  const sortableListProps = useSortableList({
    data: photos,
    itemHeight,
  });

  const handleReorder = useCallback(
    (id: string, from: number, to: number) => {
      setPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos];
        const [movedPhoto] = newPhotos.splice(from, 1);
        newPhotos.splice(to, 0, movedPhoto);

        // Update photo order in database
        updatePhotoOrder(newPhotos.map((photo) => photo.id));

        return newPhotos;
      });

      // Analytics for photo reordering
      analytics.track("photo_reordered", {
        photoId: id,
        fromPosition: from,
        toPosition: to,
        gallerySize: photos.length,
        viewMode,
      });
    },
    [photos.length, viewMode]
  );

  const togglePhotoSelection = useCallback((photoId: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  }, []);

  const deleteSelectedPhotos = useCallback(() => {
    setPhotos((prev) => prev.filter((photo) => !selectedPhotos.has(photo.id)));
    setSelectedPhotos(new Set());
  }, [selectedPhotos]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo Gallery</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={[
              styles.viewModeButton,
              viewMode === "grid" && styles.activeViewMode,
            ]}
            onPress={() => setViewMode("grid")}
          >
            <Icon name="grid" size={20} />
          </Pressable>
          <Pressable
            style={[
              styles.viewModeButton,
              viewMode === "list" && styles.activeViewMode,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Icon name="list" size={20} />
          </Pressable>
        </View>
      </View>

      {selectedPhotos.size > 0 && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {selectedPhotos.size} selected
          </Text>
          <Pressable style={styles.deleteButton} onPress={deleteSelectedPhotos}>
            <Icon name="trash" size={16} color="white" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      )}

      <SortableListContainer {...sortableListProps}>
        {photos.map((photo, index) => {
          const itemProps = sortableListProps.getItemProps(photo, index);
          const isSelected = selectedPhotos.has(photo.id);

          return (
            <SortableItem key={photo.id} {...itemProps} onMove={handleReorder}>
              <PhotoCard
                photo={photo}
                viewMode={viewMode}
                isSelected={isSelected}
                onSelect={() => togglePhotoSelection(photo.id)}
                position={index + 1}
              />
            </SortableItem>
          );
        })}
      </SortableListContainer>
    </View>
  );
}

function PhotoCard({ photo, viewMode, isSelected, onSelect, position }) {
  return (
    <Pressable
      style={[
        styles.photoCard,
        viewMode === "grid" ? styles.gridCard : styles.listCard,
        isSelected && styles.selectedCard,
      ]}
      onPress={onSelect}
    >
      <Image source={{ uri: photo.thumbnail }} style={styles.photoThumbnail} />

      <View style={styles.photoInfo}>
        <Text style={styles.photoName} numberOfLines={1}>
          {photo.name}
        </Text>
        <Text style={styles.photoDetails}>
          {photo.width}×{photo.height} • {formatFileSize(photo.size)}
        </Text>
        <Text style={styles.photoPosition}>Position: {position}</Text>
      </View>

      {isSelected && (
        <View style={styles.selectedOverlay}>
          <Icon name="check-circle" size={24} color="#3b82f6" />
        </View>
      )}

      <SortableHandle style={styles.dragHandle}>
        <Icon name="grip-vertical" size={16} color="#9ca3af" />
      </SortableHandle>
    </Pressable>
  );
}
```

### Playlist Sortable List

```tsx
function MusicPlaylist() {
  const [songs, setSongs] = useState(playlistData);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sortableListProps = useSortableList({
    data: songs,
    itemHeight: 70,
  });

  const handleReorder = useCallback(
    (id: string, from: number, to: number) => {
      setSongs((prevSongs) => {
        const newSongs = [...prevSongs];
        const [movedSong] = newSongs.splice(from, 1);
        newSongs.splice(to, 0, movedSong);

        // Update playlist order in music service
        updatePlaylistOrder(newSongs.map((song) => song.id));

        return newSongs;
      });

      // Music-specific analytics
      analytics.track("song_reordered", {
        songId: id,
        songTitle: songs.find((s) => s.id === id)?.title,
        fromPosition: from,
        toPosition: to,
        playlistLength: songs.length,
        isCurrentlyPlaying: isPlaying,
      });
    },
    [songs, isPlaying]
  );

  const playSong = useCallback((song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    musicService.play(song);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      musicService.pause();
    } else {
      musicService.resume();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      <View style={styles.playlistHeader}>
        <Text style={styles.playlistTitle}>My Playlist</Text>
        <Text style={styles.playlistInfo}>
          {songs.length} songs • {formatDuration(getTotalDuration(songs))}
        </Text>

        <View style={styles.playlistControls}>
          <Pressable
            style={styles.playAllButton}
            onPress={() => playSong(songs[0])}
          >
            <Icon name="play" size={16} color="white" />
            <Text style={styles.playAllText}>Play All</Text>
          </Pressable>

          <Pressable style={styles.shuffleButton}>
            <Icon name="shuffle" size={16} color="#6b7280" />
          </Pressable>
        </View>
      </View>

      {currentSong && (
        <View style={styles.nowPlaying}>
          <Image
            source={{ uri: currentSong.artwork }}
            style={styles.nowPlayingArt}
          />
          <View style={styles.nowPlayingInfo}>
            <Text style={styles.nowPlayingTitle} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text style={styles.nowPlayingArtist} numberOfLines={1}>
              {currentSong.artist}
            </Text>
          </View>
          <Pressable style={styles.playPauseButton} onPress={togglePlayPause}>
            <Icon
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#3b82f6"
            />
          </Pressable>
        </View>
      )}

      <SortableListContainer {...sortableListProps}>
        {songs.map((song, index) => {
          const itemProps = sortableListProps.getItemProps(song, index);
          const isCurrentSong = currentSong?.id === song.id;

          return (
            <SortableItem key={song.id} {...itemProps} onMove={handleReorder}>
              <SongCard
                song={song}
                position={index + 1}
                isCurrentSong={isCurrentSong}
                isPlaying={isPlaying && isCurrentSong}
                onPlay={() => playSong(song)}
              />
            </SortableItem>
          );
        })}
      </SortableListContainer>
    </View>
  );
}

function SongCard({ song, position, isCurrentSong, isPlaying, onPlay }) {
  return (
    <Pressable
      style={[styles.songCard, isCurrentSong && styles.currentSongCard]}
      onPress={onPlay}
    >
      <Text style={styles.songPosition}>{position}</Text>

      <Image source={{ uri: song.artwork }} style={styles.songArtwork} />

      <View style={styles.songInfo}>
        <Text
          style={[styles.songTitle, isCurrentSong && styles.currentSongTitle]}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>

      <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>

      {isPlaying && (
        <View style={styles.playingIndicator}>
          <View style={styles.playingBar} />
          <View style={styles.playingBar} />
          <View style={styles.playingBar} />
        </View>
      )}

      <SortableHandle style={styles.dragHandle}>
        <Icon name="grip-vertical" size={16} color="#9ca3af" />
      </SortableHandle>
    </Pressable>
  );
}
```

### Performance Optimized List

```tsx
function PerformanceOptimizedList() {
  const [items, setItems] = useState(largeDataSet); // 1000+ items
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  // Memoize filtered items
  const memoizedFilteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  useEffect(() => {
    setFilteredItems(memoizedFilteredItems);
  }, [memoizedFilteredItems]);

  const sortableListProps = useSortableList({
    data: filteredItems,
    itemHeight: 60,
  });

  // Memoized reorder handler
  const handleReorder = useCallback((id: string, from: number, to: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(from, 1);
      newItems.splice(to, 0, movedItem);
      return newItems;
    });
  }, []);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          onChangeText={debouncedSearch}
        />
        <Text style={styles.resultCount}>
          {filteredItems.length} of {items.length} items
        </Text>
      </View>

      <SortableListContainer {...sortableListProps}>
        {filteredItems.map((item, index) => {
          const itemProps = sortableListProps.getItemProps(item, index);
          return (
            <MemoizedSortableItem
              key={item.id}
              {...itemProps}
              item={item}
              onMove={handleReorder}
            />
          );
        })}
      </SortableListContainer>
    </View>
  );
}

// Memoized item component for performance
const MemoizedSortableItem = React.memo(({ item, onMove, ...itemProps }) => {
  return (
    <SortableItem {...itemProps} onMove={onMove}>
      <OptimizedItemCard item={item} />
    </SortableItem>
  );
});
```

## Auto-scrolling

The hook automatically manages auto-scrolling when items are dragged near the edges:

- **Automatic Detection**: Detects when dragging near top/bottom edges
- **Smooth Scrolling**: Provides natural scrolling experience
- **Configurable Thresholds**: Auto-scroll triggers based on proximity
- **Performance Optimized**: Uses native driver for smooth animations

## Position Management

The hook maintains item positions using shared values:

```tsx
// Positions are tracked as { [itemId]: position }
const positions = useSharedValue({
  "item-1": 0,
  "item-2": 1,
  "item-3": 2,
});

// Automatically updates when items are reordered
```

## Performance Tips

- Use `React.memo` for item components
- Implement virtualization for large lists (>100 items)
- Use consistent item heights for better performance
- Avoid heavy computations in render methods
- Use `useCallback` for stable callback references
- Consider pagination for very large datasets

## TypeScript Support

The hook is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

// Fully typed hook usage
const sortableProps = useSortableList<TaskData>({
  data: tasks,
  itemHeight: 60,
  itemKeyExtractor: (task) => task.id, // Optional, defaults to item.id
});
```

## Integration with Components

This hook is designed to work with sortable components:

```tsx
import { Sortable } from "react-native-reanimated-dnd";

// High-level component that uses this hook internally
function SimpleList() {
  const [items, setItems] = useState(initialItems);

  const handleMove = useCallback((id: string, from: number, to: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(from, 1);
      newItems.splice(to, 0, movedItem);
      return newItems;
    });
  }, []);

  return (
    <Sortable
      data={items}
      itemHeight={60}
      renderItem={({ item, id, positions, ...props }) => (
        <SortableItem
          key={id}
          id={id}
          positions={positions}
          {...props}
          onMove={handleMove}
        >
          <ItemCard item={item} />
        </SortableItem>
      )}
    />
  );
}
```

## See Also

- [useHorizontalSortableList](./useHorizontalSortableList) - Hook for horizontal sortable lists
- [useSortable](./useSortable) - Hook for individual sortable items
- [Sortable Component](../components/sortable) - High-level sortable list component
- [SortableItem Component](../components/sortable-item) - Individual item component
- [Examples](../examples/sortable-lists) - More comprehensive examples
