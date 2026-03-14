import React, { useRef, useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  DropProvider,
  DropProviderRef,
  DroppedItemsMap,
} from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Draggable } from "react-native-reanimated-dnd";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/toast";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface DroppedItemsMapExampleProps {
  onBack: () => void;
}

export function DroppedItemsMapExample({
  onBack,
}: DroppedItemsMapExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();
  const [droppedItemsMap, setDroppedItemsMap] = useState<DroppedItemsMap>({});

  const handleDroppedItemsUpdate = useCallback((items: DroppedItemsMap) => {
    setDroppedItemsMap(items);
  }, []);

  const handleLayoutUpdateComplete = useCallback(() => {
    console.log("DropProvider: Position recalculation completed.");
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Dropped Items Map" onBack={onBack} />

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
              Drag items between zones. Mapping updates in real-time.
            </Text>

            <View style={styles.zoneArea}>
              <Droppable<DraggableItemData>
                droppableId="drop-zone-1"
                style={[styles.dropZone, styles.dropZoneBlue]}
                onDrop={(data) => {
                  showToast({
                    title: "Placed!",
                    subtitle: "Moved to Zone 1",
                    autodismiss: true,
                  });
                }}
              >
                <Text style={styles.zoneLabel}>Zone 1</Text>
                <Text style={styles.zoneSublabel}>ID: drop-zone-1</Text>
              </Droppable>

              <Droppable<DraggableItemData>
                droppableId="drop-zone-2"
                style={[styles.dropZone, styles.dropZoneGreen]}
                onDrop={(data) => {
                  showToast({
                    title: "Placed!",
                    subtitle: "Moved to Zone 2",
                    autodismiss: true,
                  });
                }}
              >
                <Text style={styles.zoneLabel}>Zone 2</Text>
                <Text style={styles.zoneSublabel}>ID: drop-zone-2</Text>
              </Droppable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ITEMS</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.itemsRow}>
              <Draggable<DraggableItemData>
                key="map-item-1"
                draggableId="map-item-1"
                data={{
                  id: "map-item-1",
                  label: "Item Alpha",
                  backgroundColor: "#f94144",
                }}
                style={styles.draggableOuter}
              >
                <View
                  style={[
                    styles.card,
                    { borderColor: "rgba(249, 65, 68, 0.35)" },
                  ]}
                >
                  <Text style={styles.cardLabel}>Alpha</Text>
                  <Text style={styles.cardHint}>map-item-1</Text>
                </View>
              </Draggable>

              <Draggable<DraggableItemData>
                key="map-item-2"
                draggableId="map-item-2"
                data={{
                  id: "map-item-2",
                  label: "Item Beta",
                  backgroundColor: "#f3722c",
                }}
                style={styles.draggableOuter}
              >
                <View
                  style={[
                    styles.card,
                    { borderColor: "rgba(243, 114, 44, 0.35)" },
                  ]}
                >
                  <Text style={styles.cardLabel}>Beta</Text>
                  <Text style={styles.cardHint}>map-item-2</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>TRACKING</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.trackingArea}>
              {Object.keys(droppedItemsMap).length === 0 ? (
                <Text style={styles.emptyText}>No items placed yet</Text>
              ) : (
                Object.entries(droppedItemsMap).map(
                  ([draggableId, info]) => (
                    <View key={draggableId} style={styles.trackingPill}>
                      <Text style={styles.trackingText}>
                        <Text style={styles.trackingDraggable}>
                          {draggableId}
                        </Text>
                        {" is dropped on "}
                        <Text style={styles.trackingDroppable}>
                          {info.droppableId}
                        </Text>
                      </Text>
                    </View>
                  )
                )
              )}
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
  description: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  zoneArea: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    minHeight: 140,
  },
  dropZone: {
    flex: 1,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  dropZoneBlue: {
    borderColor: "#58a6ff",
    backgroundColor: "rgba(88, 166, 255, 0.08)",
  },
  dropZoneGreen: {
    borderColor: "#3fb950",
    backgroundColor: "rgba(63, 185, 80, 0.08)",
  },
  zoneLabel: {
    fontSize: 17,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  zoneSublabel: {
    fontSize: 13,
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
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  draggableOuter: {},
  card: {
    width: 130,
    paddingVertical: 18,
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    textAlign: "center",
  },
  cardHint: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 2,
    textAlign: "center",
  },
  trackingArea: {
    gap: 6,
    marginBottom: 8,
  },
  trackingPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#111318",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1A1C26",
  },
  trackingText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#FFFFFF",
  },
  trackingDraggable: {
    fontWeight: "600",
    color: "#58a6ff",
  },
  trackingDroppable: {
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
