import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Sortable,
  SortableItem,
  SortableRenderItemProps,
  SortableDirection,
} from "react-native-reanimated-dnd";
import { ExampleHeader } from "./ExampleHeader";
import { Footer } from "./Footer";

interface TagItem {
  id: string;
  label: string;
  color: string;
  category: string;
  count: number;
}

const TAG_ICONS: Record<string, string> = {
  React: "Re",
  TypeScript: "TS",
  JavaScript: "JS",
  "React Native": "RN",
  "Node.js": "No",
  Vue: "Vu",
  Angular: "Ng",
  Python: "Py",
  Swift: "Sw",
  Kotlin: "Kt",
  Flutter: "Fl",
  Go: "Go",
  Rust: "Rs",
  Docker: "Dk",
  GraphQL: "GQ",
};

const MOCK_TAGS: TagItem[] = [
  {
    id: "1",
    label: "React",
    color: "#61DAFB",
    category: "Library",
    count: 1250,
  },
  {
    id: "2",
    label: "TypeScript",
    color: "#3178C6",
    category: "Language",
    count: 980,
  },
  {
    id: "3",
    label: "JavaScript",
    color: "#F7DF1E",
    category: "Language",
    count: 2100,
  },
  {
    id: "4",
    label: "React Native",
    color: "#0FA5E9",
    category: "Framework",
    count: 750,
  },
  {
    id: "5",
    label: "Node.js",
    color: "#68A063",
    category: "Runtime",
    count: 1400,
  },
  {
    id: "6",
    label: "Vue",
    color: "#4FC08D",
    category: "Framework",
    count: 650,
  },
  {
    id: "7",
    label: "Angular",
    color: "#DD0031",
    category: "Framework",
    count: 580,
  },
  {
    id: "8",
    label: "Python",
    color: "#3776AB",
    category: "Language",
    count: 1800,
  },
  {
    id: "9",
    label: "Swift",
    color: "#FA7343",
    category: "Language",
    count: 420,
  },
  {
    id: "10",
    label: "Kotlin",
    color: "#7F52FF",
    category: "Language",
    count: 380,
  },
  {
    id: "11",
    label: "Flutter",
    color: "#02569B",
    category: "Framework",
    count: 320,
  },
  {
    id: "12",
    label: "Go",
    color: "#00ADD8",
    category: "Language",
    count: 290,
  },
  {
    id: "13",
    label: "Rust",
    color: "#b7410e",
    category: "Language",
    count: 150,
  },
  {
    id: "14",
    label: "Docker",
    color: "#2496ED",
    category: "Tool",
    count: 890,
  },
  {
    id: "15",
    label: "GraphQL",
    color: "#E10098",
    category: "Query Language",
    count: 340,
  },
];

// Item width for horizontal sortable list
const ITEM_WIDTH = 120;
const ITEM_GAP = 12;
const PADDING_HORIZONTAL = 12;

interface HorizontalSortableExampleProps {
  onBack: () => void;
}

export function HorizontalSortableExample({
  onBack,
}: HorizontalSortableExampleProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [isDragHandleMode, setIsDragHandleMode] = useState(false);
  const [showWebModal, setShowWebModal] = useState(Platform.OS === "web");

  // Render each horizontal sortable item
  const renderItem = useCallback(
    (props: SortableRenderItemProps<TagItem>) => {
      const {
        item,
        id,
        positions,
        leftBound,
        autoScrollHorizontalDirection,
        itemsCount,
        itemWidth,
        gap,
        paddingHorizontal,
      } = props;

      return (
        <SortableItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          direction={SortableDirection.Horizontal}
          leftBound={leftBound}
          autoScrollHorizontalDirection={autoScrollHorizontalDirection}
          itemsCount={itemsCount}
          itemWidth={itemWidth}
          gap={gap}
          paddingHorizontal={paddingHorizontal}
          containerWidth={windowWidth}
          style={styles.itemContainer}
          onMove={(currentId, from, to) => {
            console.log(`Tag ${currentId} moved from ${from} to ${to}`);
          }}
          onDragStart={(currentId, position) => {
            console.log(`Tag ${currentId} dragged from ${position}`);
          }}
          onDrop={(currentId, position, allPositions) => {
            console.log(`Tag ${currentId} dropped at ${position}`);
            if (allPositions) {
              console.log("All positions available:", allPositions);
            }
          }}
          onDraggingHorizontal={(currentId, overItemId, xPosition) => {
            if (overItemId) {
              console.log(
                `Tag ${currentId} is over ${overItemId} at X: ${xPosition}`
              );
            }
          }}
        >
          <View
            style={[
              styles.tagItem,
              {
                borderColor: item.color,
              },
            ]}
          >
            <View
              style={[
                styles.logoContainer,
                { borderRadius: 10, height: 36, width: 36 },
                isDragHandleMode && {
                  borderWidth: 2,
                  borderColor: item.color,
                  boxShadow: `0px 0px 10px ${item.color}`,
                },
              ]}
            >
              {isDragHandleMode ? (
                <SortableItem.Handle>
                  <View style={styles.logoInner}>
                    <Text style={[styles.logoFallback, { color: item.color }]}>
                      {TAG_ICONS[item.label] ?? item.label.slice(0, 2)}
                    </Text>
                  </View>
                </SortableItem.Handle>
              ) : (
                <View style={styles.logoInner}>
                  <Text style={[styles.logoFallback, { color: item.color }]}>
                    {TAG_ICONS[item.label] ?? item.label.slice(0, 2)}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ marginTop: 4 }}>
              <Text style={[styles.tagLabel, { color: item.color }]}>
                {item.label}
              </Text>
              <Text style={styles.tagCategory}>{item.category}</Text>
            </View>
            <Text style={styles.tagCount}>{item.count}+ downloads</Text>
          </View>
        </SortableItem>
      );
    },
    [isDragHandleMode]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Horizontal Sortable" onBack={onBack} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
        >
          {/* Control row */}
          <View style={styles.controlRow}>
            <Text style={styles.controlTitle}>
              {MOCK_TAGS.length} Technology Tags
            </Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsDragHandleMode(!isDragHandleMode)}
            >
              <Text style={styles.toggleText}>
                {isDragHandleMode ? "Handle Mode" : "Full Item Mode"}
              </Text>
              <View
                style={[
                  styles.toggleIndicator,
                  {
                    backgroundColor: isDragHandleMode ? "#FF3B30" : "#94A3B8",
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {isDragHandleMode
              ? "Drag the logo to reorder"
              : "Hold and drag to reorder"}
          </Text>

          {/* List container */}
          <View style={styles.listContainer}>
            <Sortable
              data={MOCK_TAGS}
              renderItem={renderItem}
              direction={SortableDirection.Horizontal}
              itemWidth={ITEM_WIDTH}
              gap={ITEM_GAP}
              paddingHorizontal={PADDING_HORIZONTAL}
              style={styles.list}
            />
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FF3B30" }]}
              />
              <Text style={styles.legendText}>
                Handle Mode: Only the logo area is draggable for precise control
              </Text>
            </View>
            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: "#94A3B8" }]}
              />
              <Text style={styles.legendText}>
                Full Item Mode: The entire tag card is draggable
              </Text>
            </View>
          </View>
        </ScrollView>

        <Footer />

        {/* Web Platform Modal */}
        <Modal
          visible={showWebModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowWebModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Web Platform Notice</Text>
              <Text style={styles.modalMessage}>
                This horizontal sortable example doesn't work on web due to
                platform limitations with React Native Reanimated and Gesture
                Handler.
              </Text>
              <Text style={styles.modalSubMessage}>
                Please try this example on iOS or Android.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowWebModal(false)}
                >
                  <Text style={styles.modalButtonText}>Continue Anyway</Text>
                </TouchableOpacity>
                {onBack && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={onBack}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        styles.modalButtonTextPrimary,
                      ]}
                    >
                      Go Back
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 4,
    marginTop: 8,
  },
  controlTitle: {
    fontSize: 16,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#1E2028",
    borderRadius: 8,
    backgroundColor: "#12141C",
    minWidth: 140,
    justifyContent: "center",
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
    marginRight: 8,
  },
  toggleIndicator: {
    width: 12,
    height: 2.5,
    borderRadius: 1.25,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContainer: {
    minHeight: 220,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#111318",
    borderWidth: 1,
    borderColor: "#1A1C26",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  list: {
    flex: 1,
    backgroundColor: "#111318",
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tagItem: {
    width: ITEM_WIDTH,
    height: 160,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1.5,
    backgroundColor: "#151823",
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Outfit_700Bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  tagCategory: {
    fontSize: 10,
    fontWeight: "500",
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: -2,
  },
  tagCount: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Outfit_500Medium",
    color: "#94A3B8",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 6,
  },
  legend: {
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoInner: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#1A1C26",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoFallback: {
    fontSize: 12,
    fontWeight: "800",
    fontFamily: "Outfit_700Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A1C26",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "#2A2D3A",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Syne_700Bold",
    color: "#F1F5F9",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  modalSubMessage: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
    backgroundColor: "#1A1C26",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 12,
    fontFamily: "Outfit_500Medium",
    color: "#FF3B30",
  },
  modalButtonPrimary: {
    backgroundColor: "#FF3B30",
  },
  modalButtonTextPrimary: {
    color: "#FFFFFF",
  },
});
