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
import { Draggable } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";

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
  const [droppedItemsMap, setDroppedItemsMap] = useState<DroppedItemsMap>({});

  const handleDroppedItemsUpdate = useCallback((items: DroppedItemsMap) => {
    setDroppedItemsMap(items);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
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
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates droppable zones with different
                capacities. Try dropping multiple items on each zone to see how
                capacity limits work.
              </Text>

              <View style={styles.dropZoneArea}>
                <View style={styles.dropZoneColumn}>
                  <Text style={styles.customStyleLabel}>
                    Capacity: 1 (Default)
                  </Text>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-1"
                    style={[styles.dropZone, styles.customDropZone]}
                    onDrop={(data) =>
                      Alert.alert(
                        "Dropped!",
                        `${data.label} on capacity-1 zone`
                      )
                    }
                    // Default capacity is 1
                  >
                    <Text style={styles.dropZoneText}>Single Item</Text>
                    <Text style={styles.dZoneSubText}>(Max: 1 Item)</Text>
                  </Droppable>
                </View>

                <View style={styles.dropZoneColumn}>
                  <Text style={styles.customStyleLabel}>Capacity: 2</Text>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-2"
                    capacity={2}
                    style={[styles.dropZone, styles.customDropZone]}
                    onDrop={(data) =>
                      Alert.alert(
                        "Dropped!",
                        `${data.label} on capacity-2 zone`
                      )
                    }
                  >
                    <Text style={styles.dropZoneText}>Multi Item</Text>
                    <Text style={styles.dZoneSubText}>(Max: 2 Items)</Text>
                  </Droppable>
                </View>
              </View>

              <View style={styles.dropZoneArea}>
                <View style={styles.dropZoneColumn}>
                  <Text style={styles.customStyleLabel}>Capacity: 3</Text>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-3"
                    capacity={3}
                    style={[
                      styles.dropZone,
                      styles.customDropZone,
                      { height: 140 },
                    ]}
                    onDrop={(data) =>
                      Alert.alert(
                        "Dropped!",
                        `${data.label} on capacity-3 zone`
                      )
                    }
                  >
                    <Text style={styles.dropZoneText}>Large Capacity</Text>
                    <Text style={styles.dZoneSubText}>(Max: 3 Items)</Text>
                  </Droppable>
                </View>

                <View style={styles.dropZoneColumn}>
                  <Text style={styles.customStyleLabel}>
                    Capacity: Unlimited
                  </Text>
                  <Droppable<DraggableItemData>
                    droppableId="capacity-unlimited"
                    capacity={Infinity}
                    style={[
                      styles.dropZone,
                      styles.customDropZone,
                      { height: 140 },
                    ]}
                    onDrop={(data) =>
                      Alert.alert(
                        "Dropped!",
                        `${data.label} on unlimited capacity zone`
                      )
                    }
                  >
                    <Text style={styles.dropZoneText}>Unlimited</Text>
                    <Text style={styles.dZoneSubText}>(No Limit)</Text>
                  </Droppable>
                </View>
              </View>

              <View style={[styles.draggableItemsArea, { minHeight: 200 }]}>
                {/* Create 5 draggable items to test capacity */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <Draggable<DraggableItemData>
                    key={`capacity-demo-item-${index}`}
                    draggableId={`capacity-demo-item-${index}`}
                    data={{
                      id: `capacity-item-${index}`,
                      label: `Item ${index + 1}`,
                      backgroundColor: `hsl(${index * 40}, 80%, 60%)`,
                    }}
                    style={[
                      styles.draggable,
                      {
                        backgroundColor: `hsl(${index * 40}, 80%, 60%)`,
                        borderRadius: 12,
                        zIndex: 100 - index,
                        top: Math.floor(index / 3) * 80,
                        left: (index % 3) * 110 + 20,
                      },
                    ]}
                  >
                    <View style={styles.cardContent}>
                      <Text style={styles.cardLabel}>{`Item ${
                        index + 1
                      }`}</Text>
                    </View>
                  </Draggable>
                ))}
              </View>

              {/* Add counter to show items in each drop zone */}
              <View style={styles.mappingContainer}>
                <Text style={styles.mappingTitle}>Dropped Items Count:</Text>
                {Object.entries(
                  // Group by droppable ID
                  Object.values(droppedItemsMap).reduce(
                    (acc, { droppableId }) => {
                      acc[droppableId] = (acc[droppableId] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>
                  )
                ).map(([droppableId, count]) => (
                  <View key={droppableId} style={styles.mappingItem}>
                    <Text style={styles.mappingText}>
                      <Text style={styles.mappingLabel}>{droppableId}</Text>:{" "}
                      <Text style={styles.mappingValue}>{count}</Text> item
                      {count !== 1 ? "s" : ""}
                    </Text>
                  </View>
                ))}
                {Object.keys(droppedItemsMap).length === 0 && (
                  <Text style={styles.mappingEmpty}>
                    No items currently dropped
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </DropProvider>
      </SafeAreaView>
      <Footer />
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
    minHeight: 160,
    marginBottom: 32,
  },
  dropZoneColumn: {
    alignItems: "center",
    width: "45%",
  },
  customStyleLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  customDropZone: {
    borderColor: "#2C2C2E",
    backgroundColor: "#1C1C1E",
    height: 120,
    width: "100%",
    borderRadius: 16,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
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
    textAlign: "center",
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
    width: 100,
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
