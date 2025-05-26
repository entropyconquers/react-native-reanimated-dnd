import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider } from "react-native-reanimated-dnd";
import { useSortable, useSortableList } from "react-native-reanimated-dnd";
import { SortableItem } from "react-native-reanimated-dnd";

interface Item {
  id: string;
  title: string;
  description: string;
  color: string;
}

const MOCK_DATA: Item[] = [
  {
    id: "item-1",
    title: "Item 1",
    description: "This is item 1",
    color: "#f94144",
  },
  {
    id: "item-2",
    title: "Item 2",
    description: "This is item 2",
    color: "#f3722c",
  },
  {
    id: "item-3",
    title: "Item 3",
    description: "This is item 3",
    color: "#f8961e",
  },
  {
    id: "item-4",
    title: "Item 4",
    description: "This is item 4",
    color: "#f9c74f",
  },
];

// Item height for sortable list
const ITEM_HEIGHT = 80;
const windowHeight = Dimensions.get("window").height;

// Custom SortableItem using hooks directly
function CustomSortableItem({
  item,
  id,
  positions,
  lowerBound,
  autoScrollDirection,
  itemsCount,
  itemHeight,
}: any) {
  // Use the sortable hook directly
  const { animatedStyle, panGestureHandler } = useSortable({
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
    containerHeight: windowHeight * 0.8,
    onMove: (id, from, to) => {
      console.log(`Item ${id} moved from position ${from} to ${to}`);
    },
    // New callbacks
    onDragStart: (id, position) => {
      console.log(`Started dragging item ${id} from position ${position}`);
    },
    onDrop: (id, position) => {
      console.log(`Dropped item ${id} at position ${position}`);
    },
    onDragging: (id, overItemId, yPosition) => {
      console.log(
        `Dragging ${id} over ${overItemId || "no item"} at y=${Math.round(
          yPosition
        )}`
      );
    },
  });

  return (
    <Animated.View style={animatedStyle}>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={styles.itemContainer}>
          <View style={[styles.item, { backgroundColor: item.color }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

export function SortableHookExample() {
  // State to track drag events for UI display
  const [statusText, setStatusText] = useState("Ready to sort");
  const [draggingInfo, setDraggingInfo] = useState<string | null>(null);

  // Use the sortable list hook directly
  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList({
    data: MOCK_DATA,
    itemHeight: ITEM_HEIGHT,
  });

  // Using SortableItem component for the first 2 items with callback event handling
  const renderSortableItems = () => {
    return MOCK_DATA.slice(0, 2).map((item, index) => {
      const itemProps = getItemProps(item, index);

      return (
        <SortableItem
          key={item.id}
          data={item}
          {...itemProps}
          containerHeight={windowHeight * 0.8}
          style={styles.itemContainer}
          onDragStart={(id, position) => {
            setStatusText(`Started dragging: ${item.title}`);
            console.log(`Started dragging ${id} from position ${position}`);
          }}
          onDrop={(id, position) => {
            setStatusText(`Dropped at position: ${position + 1}`);
            setDraggingInfo(null);
            console.log(`Dropped ${id} at position ${position}`);
          }}
          onDragging={(id, overItemId, yPosition) => {
            const overItemText = overItemId
              ? MOCK_DATA.find((i) => i.id === overItemId)?.title ||
                "unknown item"
              : "no item";
            setDraggingInfo(
              `Over: ${overItemText} (y=${Math.round(yPosition)})`
            );
          }}
        >
          <View style={[styles.item, { backgroundColor: item.color }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </SortableItem>
      );
    });
  };

  // Using custom implementation for the rest
  const renderCustomItems = () => {
    return MOCK_DATA.slice(2).map((item, index) => {
      const actualIndex = index + 2; // offset for the sliced array
      const itemProps = getItemProps(item, actualIndex);

      return <CustomSortableItem key={item.id} item={item} {...itemProps} />;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sortable List with Callbacks</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{statusText}</Text>
        {draggingInfo && (
          <Text style={styles.draggingText}>{draggingInfo}</Text>
        )}
      </View>

      <View style={styles.listContainer}>
        <GestureHandlerRootView style={styles.flex}>
          <DropProvider ref={dropProviderRef}>
            <Animated.ScrollView
              ref={scrollViewRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.list}
              contentContainerStyle={{ height: contentHeight }}
              onScrollEndDrag={handleScrollEnd}
              onMomentumScrollEnd={handleScrollEnd}
            >
              {/* First 2 items with SortableItem component */}
              {renderSortableItems()}

              {/* Last 2 items with custom implementation */}
              {renderCustomItems()}
            </Animated.ScrollView>
          </DropProvider>
        </GestureHandlerRootView>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <Text style={styles.legendText}>
          • First 2 items: Using SortableItem component
        </Text>
        <Text style={styles.legendText}>
          • Last 2 items: Using useSortable hook directly
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  statusContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 70,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  draggingText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  legendContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  list: {
    flex: 1,
    backgroundColor: "white",
  },
  itemContainer: {
    paddingHorizontal: 16,
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  item: {
    padding: 16,
    borderRadius: 8,
    height: ITEM_HEIGHT - 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
});
