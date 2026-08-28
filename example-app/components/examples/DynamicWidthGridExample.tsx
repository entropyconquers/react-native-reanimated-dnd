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
import { Footer } from "../Footer";

interface GridCard {
  id: string;
  title: string;
  description: string;
  color: string;
  wide: boolean;
  columnSpan: number;
}

const GAP = 12;
const PADDING = 16;
const COLUMNS = 3;
const SHORT_HEIGHT = 110;
const windowWidth = Dimensions.get("window").width;

const itemWidth = Math.floor(
  (windowWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS
);

const INITIAL_CARDS: GridCard[] = [
  {
    id: "item-3",
    title: "Item 3",
    description: "Description 3",
    color: "#2D6CDF",
    wide: true,
    columnSpan: 2,
  },
  {
    id: "item-1",
    title: "Item 1",
    description: "Description 1",
    color: "#E4574C",
    wide: false,
    columnSpan: 1,
  },
  {
    id: "item-2",
    title: "Item 2",
    description: "Description 2",
    color: "#1F8A8A",
    wide: false,
    columnSpan: 1,
  },
  {
    id: "item-4",
    title: "Item 4",
    description: "Description 4",
    color: "#2E9E4F",
    wide: false,
    columnSpan: 1,
  },
  {
    id: "item-5",
    title: "Item 5",
    description: "Description 5",
    color: "#D9A514",
    wide: false,
    columnSpan: 1,
  },
];

interface DynamicWidthGridExampleProps {
  onBack: () => void;
}

export function DynamicWidthGridExample({
  onBack,
}: DynamicWidthGridExampleProps) {
  const [data, setData] = useState<GridCard[]>(INITIAL_CARDS);

  const itemColumnSpans = useMemo(() => {
    const map: { [id: string]: number } = {};
    data.forEach((card) => {
      if (card.columnSpan > 1) {
        map[card.id] = card.columnSpan;
      }
    });
    return map;
  }, [data]);

  const gridDimensions = useMemo(
    () => ({
      columns: COLUMNS,
      itemWidth,
      itemHeight: SHORT_HEIGHT,
      rowGap: GAP,
      columnGap: GAP,
      itemColumnSpans,
    }),
    [itemColumnSpans]
  );

  const handleDrop = useCallback(
    (id: string, position: number, allPositions: any) => {
      const sortedEntries = Object.entries(allPositions).sort(
        ([, a]: any, [, b]: any) => a.index - b.index
      );
      setData((prevData) => {
        const reordered = sortedEntries
          .map(([itemId]) => prevData.find((card) => card.id === itemId))
          .filter((card): card is GridCard => card !== undefined);
        return reordered;
      });
    },
    []
  );

  const renderItem = useCallback(
    (props: SortableGridRenderItemProps<GridCard>) => {
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
          style={styles.itemContainer}
          onDrop={handleDrop}
        >
          <View style={[styles.card, { backgroundColor: item.color }]}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardId}>{id}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.wide ? "WIDE 2\u00D7" : "1\u00D71"}
              </Text>
            </View>
          </View>
        </SortableGridItem>
      );
    },
    [handleDrop]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>{"\u2039"}</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Dynamic Width Grid Example</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <View style={styles.gridWrapper}>
        <SortableGrid
          data={data}
          renderItem={renderItem}
          dimensions={gridDimensions}
          orientation={GridOrientation.Vertical}
          strategy={GridStrategy.Insert}
          style={styles.grid}
          contentContainerStyle={styles.gridContent}
        />
      </View>

      <View style={styles.instructionBar}>
        <Text style={styles.instructionText}>
          Drag to reorder. The WIDE card spans two columns — the other cards
          pack around it wherever it goes.
        </Text>
      </View>

      <Footer />
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
    paddingHorizontal: PADDING,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
    marginRight: 6,
  },
  backText: {
    fontSize: 15,
    fontFamily: fonts.bodyRegular,
    color: colors.textPrimary,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
    color: colors.textPrimary,
  },
  spacer: {
    width: 60,
  },
  gridWrapper: {
    flex: 1,
  },
  grid: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  gridContent: {
    padding: PADDING,
  },
  itemContainer: {
    alignItems: "stretch",
  },
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: fonts.bodySemiBold,
    color: "#FFFFFF",
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: fonts.bodyRegular,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  cardId: {
    fontSize: 10,
    fontFamily: fonts.bodyRegular,
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.bodyBold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  instructionBar: {
    paddingVertical: 10,
    paddingHorizontal: PADDING,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  instructionText: {
    fontSize: 12,
    fontFamily: fonts.bodyRegular,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});
