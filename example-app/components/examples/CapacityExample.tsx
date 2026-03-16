import React, { useRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DropProvider,
  DropProviderRef,
  DroppedItemsMap,
} from "react-native-reanimated-dnd";
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

interface CapacityExampleProps {
  onBack: () => void;
}

export function CapacityExample({ onBack }: CapacityExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();
  const [droppedItemsMap, setDroppedItemsMap] = useState<DroppedItemsMap>({});

  const handleDroppedItemsUpdate = useCallback((items: DroppedItemsMap) => {
    setDroppedItemsMap(items);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Drop Zone Capacity" onBack={onBack} />

        <DropProvider
          ref={dropProviderRef}
          onDroppedItemsUpdate={handleDroppedItemsUpdate}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.description}>
              Each zone has a capacity limit. Try filling them up.
            </Text>

            <View style={styles.zoneGrid}>
              <View style={styles.zoneRow}>
                <View style={styles.zoneCol}>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-1"
                    style={styles.dropZone}
                    onDrop={(data) =>
                      showToast({
                        title: "Placed!",
                        subtitle: "Added to the single-item zone",
                        autodismiss: true,
                      })
                    }
                  >
                    <Text style={styles.zoneTitle}>Single Item</Text>
                    <Text style={styles.zoneSublabel}>Cap: 1</Text>
                  </Droppable>
                </View>

                <View style={styles.zoneCol}>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-2"
                    capacity={2}
                    style={styles.dropZone}
                    onDrop={(data) =>
                      showToast({
                        title: "Placed!",
                        subtitle: "Added to the double-item zone",
                        autodismiss: true,
                      })
                    }
                  >
                    <Text style={styles.zoneTitle}>Multi Item</Text>
                    <Text style={styles.zoneSublabel}>Cap: 2</Text>
                  </Droppable>
                </View>
              </View>

              <View style={styles.zoneRow}>
                <View style={styles.zoneCol}>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-3"
                    capacity={3}
                    style={styles.dropZone}
                    onDrop={(data) =>
                      showToast({
                        title: "Placed!",
                        subtitle: "Added to the triple-item zone",
                        autodismiss: true,
                      })
                    }
                  >
                    <Text style={styles.zoneTitle}>Large Capacity</Text>
                    <Text style={styles.zoneSublabel}>Cap: 3</Text>
                  </Droppable>
                </View>

                <View style={styles.zoneCol}>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-unlimited"
                    capacity={Infinity}
                    style={styles.dropZone}
                    onDrop={(data) =>
                      showToast({
                        title: "Placed!",
                        subtitle: "Added to the unlimited zone",
                        autodismiss: true,
                      })
                    }
                  >
                    <Text style={styles.zoneTitle}>Unlimited</Text>
                    <Text style={styles.zoneSublabel}>{`Cap: \u221E`}</Text>
                  </Droppable>
                </View>
              </View>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ITEMS</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.itemsRow}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Draggable<DraggableItemData>
                  key={`capacity-demo-item-${index}`}
                  draggableId={`capacity-demo-item-${index}`}
                  data={{
                    id: `capacity-item-${index}`,
                    label: `Item ${index + 1}`,
                    backgroundColor: `hsl(${index * 40}, 80%, 60%)`,
                  }}
                  style={{
                    backgroundColor: `hsl(${index * 40}, 80%, 60%)`,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255, 0.12)",
                  }}
                >
                  <View style={styles.chip}>
                    <Text style={styles.chipLabel}>{`${index + 1}`}</Text>
                  </View>
                </Draggable>
              ))}
            </View>

            <View style={styles.counterStrip}>
              {Object.entries(
                Object.values(droppedItemsMap).reduce(
                  (acc, { droppableId }) => {
                    acc[droppableId] = (acc[droppableId] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              ).map(([droppableId, count]) => (
                <View key={droppableId} style={styles.countPill}>
                  <Text style={styles.countText}>
                    <Text style={styles.countLabel}>{droppableId}</Text>
                    {": "}
                    <Text style={styles.countValue}>{count}</Text>
                    {` item${count !== 1 ? "s" : ""}`}
                  </Text>
                </View>
              ))}
              {Object.keys(droppedItemsMap).length === 0 && (
                <Text style={styles.emptyText}>No items currently dropped</Text>
              )}
            </View>
          </ScrollView>
        </DropProvider>
      </View>
      <Footer />
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
  description: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  zoneGrid: {
    flex: 1,
    minHeight: 240,
    marginBottom: 16,
  },
  zoneRow: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  zoneCol: {
    flex: 1,
  },
  dropZone: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#2A2D3A",
    backgroundColor: "#111318",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  zoneTitle: {
    fontSize: 16,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  zoneSublabel: {
    fontSize: 12,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 2,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1E2028",
  },
  dividerText: {
    fontSize: 11,
    fontFamily: "Outfit_600SemiBold",
    color: "#475569",
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  itemsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    width: 60,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  chipLabel: {
    fontSize: 14,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    textAlign: "center",
  },
  counterStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#111318",
    borderWidth: 1,
    borderColor: "#1E2028",
  },
  countText: {
    fontSize: 12,
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
  },
  countLabel: {
    fontWeight: "600",
    color: "#58a6ff",
  },
  countValue: {
    fontWeight: "600",
    color: "#3fb950",
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    fontStyle: "italic",
  },
});
