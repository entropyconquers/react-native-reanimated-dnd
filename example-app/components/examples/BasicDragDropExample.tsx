import React, { useRef, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { Draggable } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/toast";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface BasicDragDropExampleProps {
  onBack: () => void;
}

export function BasicDragDropExample({ onBack }: BasicDragDropExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Basic Drag & Drop" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.description}>
              Drag items to the drop zone. Item 3 has a 200ms pre-drag delay.
            </Text>

            {/* Drop zone area - flex: 1 expands to fill available space */}
            <View style={styles.dropArea}>
              <Droppable<DraggableItemData>
                droppableId="zone-alpha"
                style={styles.dropZone}
                onDrop={(data) =>
                  showToast({
                    title: "Nice!",
                    subtitle: `Dropped on Zone Alpha`,
                    autodismiss: true,
                  })
                }
              >
                <Text style={styles.dropZoneLabel}>Zone Alpha</Text>
                <Text style={styles.dropZoneSub}>Drop items here</Text>
              </Droppable>
            </View>

            {/* Section divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ITEMS</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Draggable items */}
            <View style={styles.itemsRow}>
              <Draggable<DraggableItemData>
                key="basic-item-1"
                data={{
                  id: "basic-item-1",
                  label: "Draggable Item 1",
                  backgroundColor: "#a2d2ff",
                }}
                style={styles.draggableWrapper}
              >
                <View
                  style={[
                    styles.card,
                    { borderColor: "rgba(162, 210, 255, 0.35)" },
                  ]}
                >
                  <Text style={styles.cardLabel}>Item 1</Text>
                  <Text style={styles.cardHint}>Drag me!</Text>
                </View>
              </Draggable>

              <Draggable<DraggableItemData>
                key="basic-item-2"
                data={{
                  id: "basic-item-2",
                  label: "Draggable Item 2",
                  backgroundColor: "#bde0fe",
                }}
                style={styles.draggableWrapper}
              >
                <View
                  style={[
                    styles.card,
                    { borderColor: "rgba(189, 224, 254, 0.35)" },
                  ]}
                >
                  <Text style={styles.cardLabel}>Item 2</Text>
                  <Text style={styles.cardHint}>Drag me too!</Text>
                </View>
              </Draggable>

              <Draggable<DraggableItemData>
                key="basic-item-3"
                preDragDelay={200}
                data={{
                  id: "basic-item-3",
                  label: "Draggable Item 3",
                  backgroundColor: "#bde0fe",
                }}
                style={styles.draggableWrapper}
              >
                <View
                  style={[
                    styles.card,
                    { borderColor: "rgba(255, 59, 48, 0.3)" },
                  ]}
                >
                  <Text style={styles.cardLabel}>Item 3</Text>
                  <Text style={[styles.cardHint, { color: "#FF3B30" }]}>
                    200ms delay
                  </Text>
                </View>
              </Draggable>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#a2d2ff" }]}
                />
                <Text style={styles.legendText}>
                  Default spring return animation
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#FF3B30" }]}
                />
                <Text style={styles.legendText}>
                  Pre-drag delay prevents accidental drags
                </Text>
              </View>
            </View>
          </ScrollView>
        </DropProvider>
        <Footer />
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },

  // Description
  description: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 20,
  },

  // Drop zone area - FLEX to fill screen
  dropArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 24,
    minHeight: 160,
  },
  dropZone: {
    flex: 1,
    maxHeight: 220,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dropZoneLabel: {
    fontSize: 18,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    letterSpacing: 0.3,
  },
  dropZoneSub: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 6,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1A1C26",
  },
  dividerText: {
    fontSize: 11,
    fontFamily: "Outfit_600SemiBold",
    color: "#475569",
    letterSpacing: 1.5,
  },

  // Items
  itemsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  draggableWrapper: {
    borderRadius: 12,
  },
  card: {
    width: 100,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#151823",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    textAlign: "center",
  },
  cardHint: {
    fontSize: 12,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },

  // Legend
  legend: {
    gap: 8,
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
  },
});
