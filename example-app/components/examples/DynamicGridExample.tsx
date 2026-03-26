import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SortableGrid,
  SortableGridItem,
  SortableGridRenderItemProps,
  GridOrientation,
  GridStrategy,
} from "react-native-reanimated-dnd";
import { colors, fonts } from "../../theme";

interface GridItem {
  id: string;
  title: string;
  color: string;
  isTall: boolean;
}

interface DynamicGridExampleProps {
  onBack: () => void;
}

const ITEM_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

const INITIAL_ITEMS: GridItem[] = [
  { id: "item-1", title: "Item 1", color: ITEM_COLORS[0], isTall: false },
  { id: "item-2", title: "Item 2", color: ITEM_COLORS[1], isTall: false },
  { id: "item-3", title: "Item 3", color: ITEM_COLORS[2], isTall: true },
  { id: "item-4", title: "Item 4", color: ITEM_COLORS[3], isTall: false },
  { id: "item-5", title: "Item 5", color: ITEM_COLORS[4], isTall: false },
];

const TALL_ID = "item-3";
const RESERVED_ID = "reserved";
const TOTAL_SLOTS = 6;

let nextId = 6;

function generateRandomItem(): GridItem {
  const id = `item-${nextId++}`;
  const randomColor =
    ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)];
  return {
    id,
    title: `Item ${nextId - 1}`,
    color: randomColor,
    isTall: false,
  };
}

const COLUMN_OPTIONS = [2, 3, 4];

export function DynamicGridExample({ onBack }: DynamicGridExampleProps) {
  const [items, setItems] = useState<GridItem[]>(INITIAL_ITEMS);
  const [columns, setColumns] = useState(3);
  const [showControls, setShowControls] = useState(false);

  const { width } = Dimensions.get("window");
  const gap = 16;
  const padding = 24;
  const totalGapWidth = gap * (columns - 1);
  const totalPaddingWidth = padding * 2;
  const itemWidth = Math.floor(
    (width - totalPaddingWidth - totalGapWidth) / columns
  );
  const itemHeight = itemWidth * 1.2;
  const tallHeight = itemHeight * 2 + gap;

  // Normalize slots to include reserved placeholder below tall item
  const normalizedSlots = useMemo(() => {
    let updated: (GridItem | { id: string; reserved: true })[] = [...items];

    const tallIndex = updated.findIndex((i) => i.id === TALL_ID);
    if (tallIndex === -1) return updated;

    const belowIndex = tallIndex + columns;

    if (belowIndex < TOTAL_SLOTS) {
      updated.splice(belowIndex, 0, { id: RESERVED_ID, reserved: true });
    }

    return updated;
  }, [items, columns]);

  // Calculate itemHeights mapping
  const itemHeights = useMemo(() => {
    const heights: { [id: string]: number } = {};
    items.forEach((item) => {
      heights[item.id] = item.isTall ? tallHeight : itemHeight;
    });
    heights[RESERVED_ID] = itemHeight;
    return heights;
  }, [items, tallHeight, itemHeight]);

  const handleAddItem = useCallback(() => {
    setItems((prev) => {
      if (prev.length >= 5) return prev;
      const newItem = generateRandomItem();
      return [newItem, ...prev];
    });
  }, []);

  const handleResetItems = useCallback(() => {
    setItems(INITIAL_ITEMS);
  }, []);

  const handleDrop = useCallback(
    (id: string, newPosition: number, allPositions: any) => {
      const sortedEntries = Object.entries(allPositions).sort(
        ([, a]: any, [, b]: any) => a.index - b.index
      );
      setItems((prevItems) => {
        const reorderedItems = sortedEntries
          .map(([itemId]) => prevItems.find((item) => item.id === itemId))
          .filter((item): item is GridItem => item !== undefined);
        return reorderedItems;
      });
    },
    []
  );

  const renderItem = useCallback(
    (props: SortableGridRenderItemProps<GridItem>) => {
      const {
        item,
        id,
        positions,
        scrollY,
        scrollX,
        autoScrollDirection,
        itemsCount,
        dimensions,
        orientation,
        strategy,
      } = props;

      const slot = item as any;

      if (slot.id === RESERVED_ID) {
        return (
          <View
            key={id}
            style={{
              width: itemWidth,
              height: itemHeight,
            }}
          />
        );
      }

      const isTall = slot.id === TALL_ID;

      return (
        <SortableGridItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          scrollY={scrollY}
          scrollX={scrollX}
          autoScrollDirection={autoScrollDirection}
          itemsCount={itemsCount}
          dimensions={dimensions}
          orientation={orientation}
          strategy={strategy}
          onDrop={handleDrop}
        >
          <View
            style={[
              styles.gridItem,
              {
                width: itemWidth,
                height: isTall ? tallHeight : itemHeight,
                backgroundColor: item.color,
              },
            ]}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{item.id}</Text>
          </View>
        </SortableGridItem>
      );
    },
    [itemWidth, itemHeight, tallHeight, handleDrop]
  );

  const gridDimensions = useMemo(
    () => ({
      columns,
      itemWidth,
      itemHeight,
      rowGap: gap,
      columnGap: gap,
      itemHeights,
    }),
    [columns, itemWidth, itemHeight, gap, itemHeights]
  );

  const toggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleControls}>
          <Text style={styles.backText}>{showControls ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {showControls && (
        <View style={styles.controlsContainer}>
          <Text style={styles.sectionLabel}>Columns</Text>
          <View style={styles.controlsRow}>
            {[2, 3, 4].map((col) => (
              <TouchableOpacity
                key={col}
                onPress={() => setColumns(col)}
                style={[styles.chip, columns === col && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    columns === col && styles.chipTextActive,
                  ]}
                >
                  {col}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Actions</Text>
          <TouchableOpacity onPress={handleAddItem} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>+ Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResetItems}
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Reset
            </Text>
          </TouchableOpacity>

          <Text style={styles.statsText}>
            Items: {items.length} | Columns: {columns}
          </Text>
        </View>
      )}

      <View style={styles.gridWrapper}>
        <SortableGrid
          data={normalizedSlots}
          renderItem={renderItem}
          dimensions={gridDimensions}
          orientation={GridOrientation.Vertical}
          strategy={GridStrategy.Swap}
          style={styles.grid}
          contentContainerStyle={styles.gridContent}
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerLeft: {
    flex: 1,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.displayBold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: fonts.bodyRegular,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 4,
  },
  controlsContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: colors.surfaceElevated,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
  },
  statsText: {
    fontSize: 14,
    fontFamily: fonts.bodyRegular,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
  gridWrapper: {
    flex: 1,
  },
  grid: {
    flex: 1,
  },
  gridContent: {
    padding: 24,
  },
  gridItem: {
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: fonts.displayBold,
    color: "#FFFFFF",
    flex: 1,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
});
