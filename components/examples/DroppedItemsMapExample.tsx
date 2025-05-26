import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
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
  const [droppedItemsMap, setDroppedItemsMap] = useState<DroppedItemsMap>({});

  const handleDroppedItemsUpdate = useCallback((items: DroppedItemsMap) => {
    setDroppedItemsMap(items);
  }, []);

  const handleLayoutUpdateComplete = useCallback(() => {
    console.log("DropProvider: Position recalculation completed.");
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
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
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates tracking which draggables are
                currently dropped on which droppables. Try dragging the items
                between zones.
              </Text>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="drop-zone-1"
                  style={[styles.dropZone, styles.dropZoneBlue]}
                  onDrop={(data) => {
                    Alert.alert(
                      "Item Dropped",
                      `Item "${data.label}" dropped on Zone 1`
                    );
                  }}
                >
                  <Text style={styles.dropZoneText}>Zone 1</Text>
                  <Text style={styles.dZoneSubText}>(ID: drop-zone-1)</Text>
                </Droppable>

                <Droppable<DraggableItemData>
                  droppableId="drop-zone-2"
                  style={[styles.dropZone, styles.dropZoneGreen]}
                  onDrop={(data) => {
                    Alert.alert(
                      "Item Dropped",
                      `Item "${data.label}" dropped on Zone 2`
                    );
                  }}
                >
                  <Text style={styles.dropZoneText}>Zone 2</Text>
                  <Text style={styles.dZoneSubText}>(ID: drop-zone-2)</Text>
                </Droppable>
              </View>

              <View style={styles.draggableItemsArea}>
                <Draggable<DraggableItemData>
                  key="map-item-1"
                  draggableId="map-item-1"
                  data={{
                    id: "map-item-1",
                    label: "Item Alpha",
                    backgroundColor: "#f94144",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: 20,
                      backgroundColor: "#f94144",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Item Alpha</Text>
                    <Text style={styles.cardHint}>ID: map-item-1</Text>
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
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: 160,
                      backgroundColor: "#f3722c",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Item Beta</Text>
                    <Text style={styles.cardHint}>ID: map-item-2</Text>
                  </View>
                </Draggable>
              </View>

              {/* Display the current mapping */}
              <View style={styles.mappingContainer}>
                <Text style={styles.mappingTitle}>Current Dropped Items:</Text>
                {Object.keys(droppedItemsMap).length === 0 ? (
                  <Text style={styles.mappingEmpty}>
                    No items currently dropped
                  </Text>
                ) : (
                  Object.entries(droppedItemsMap).map(([draggableId, info]) => (
                    <View key={draggableId} style={styles.mappingItem}>
                      <Text style={styles.mappingText}>
                        <Text style={styles.mappingLabel}>{draggableId}</Text>{" "}
                        is dropped on zone{" "}
                        <Text style={styles.mappingValue}>
                          {info.droppableId}
                        </Text>
                      </Text>
                    </View>
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        </DropProvider>
        <Footer />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    padding: 24,
    backgroundColor: "#000000",
    marginBottom: 20,
  },
  sectionDescription: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 24,
    lineHeight: 22,
  },
  dropZoneArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 120,
    marginBottom: 32,
  },
  dropZone: {
    width: "45%",
    height: 100,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
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
  dropZoneText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  dZoneSubText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 6,
    letterSpacing: 0.1,
  },
  draggableItemsArea: {
    minHeight: 100,
    position: "relative",
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  draggable: {
    position: "absolute",
  },
  cardContent: {
    width: 120,
    height: 72,
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  cardHint: {
    fontSize: 13,
    marginTop: 6,
    color: "#8E8E93",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  mappingContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  mappingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#FFFFFF",
  },
  mappingItem: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  mappingText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  mappingEmpty: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  mappingLabel: {
    fontWeight: "600",
    color: "#58a6ff",
  },
  mappingValue: {
    fontWeight: "600",
    color: "#3fb950",
  },
});
