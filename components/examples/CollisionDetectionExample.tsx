import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { Draggable } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
  collisionText?: string;
}

interface CollisionDetectionExampleProps {
  onBack: () => void;
}

export function CollisionDetectionExample({
  onBack,
}: CollisionDetectionExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Collision Detection" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                Try dragging the items over the drop zones. Note how 'center',
                'intersect' (default), and 'contain' behave differently.
              </Text>

              <View
                style={[
                  styles.dropZoneArea,
                  { minHeight: 150, justifyContent: "space-between" },
                ]}
              >
                <Droppable<DraggableItemData>
                  droppableId="narrow-zone"
                  style={[
                    styles.dropZone,
                    styles.dropZoneBlue,
                    { width: "30%", height: 120 },
                  ]} // Narrow zone
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `Item "${data.label}" with ${data.collisionText} dropped on Narrow Zone!`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Narrow Zone</Text>
                  <Text style={styles.dZoneSubText}>
                    (Good for Center/Intersect Demo)
                  </Text>
                </Droppable>

                <Droppable<DraggableItemData>
                  droppableId="contain-zone"
                  style={[
                    styles.dropZone,
                    styles.dropZoneGreen,
                    { width: "45%", height: 150 },
                  ]} // Wider, taller zone
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `Item "${data.label}" with ${data.collisionText} dropped on Contain Zone!`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Contain Zone</Text>
                  <Text style={styles.dZoneSubText}>
                    (Good for Contain Demo)
                  </Text>
                </Droppable>
              </View>

              <View style={[styles.draggableItemsArea, { minHeight: 240 }]}>
                {/* Draggable with 'center' collision */}
                <Draggable<DraggableItemData>
                  key="D-Collision-Center"
                  data={{
                    id: "D-Col-Center",
                    label: "Center Collision Draggable",
                    backgroundColor: "#ffca3a",
                    collisionText: "'center' collision",
                  }}
                  collisionAlgorithm="center"
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: "5%",
                      width: "90%", // Wide item
                      backgroundColor: "#ffca3a",
                      borderRadius: 12,
                      zIndex: 20,
                    },
                  ]}
                >
                  <View style={[styles.cardContent, { width: "100%" }]}>
                    <Text style={styles.cardLabel}>Center</Text>
                    <Text style={styles.cardHint}>(Wide)</Text>
                  </View>
                </Draggable>

                {/* Draggable with default 'intersect' collision */}
                <Draggable<DraggableItemData>
                  key="D-Collision-Intersect"
                  data={{
                    id: "D-Col-Intersect",
                    label: "Intersect Collision Draggable (Default)",
                    backgroundColor: "#8ac926",
                    collisionText: "'intersect' collision (default)",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 80,
                      left: "5%",
                      width: "90%", // Wide item
                      backgroundColor: "#8ac926",
                      borderRadius: 12,
                      zIndex: 10,
                    },
                  ]}
                >
                  <View style={[styles.cardContent, { width: "100%" }]}>
                    <Text style={styles.cardLabel}>Intersect</Text>
                    <Text style={styles.cardHint}>(Default, Wide)</Text>
                  </View>
                </Draggable>

                {/* Draggable with 'contain' collision */}
                <Draggable<DraggableItemData>
                  key="D-Collision-Contain"
                  data={{
                    id: "D-Col-Contain",
                    label: "Contain Collision Draggable",
                    backgroundColor: "#1982c4",
                    collisionText: "'contain' collision",
                  }}
                  collisionAlgorithm="contain"
                  style={[
                    styles.draggable,
                    {
                      top: 160,
                      left: "25%",
                      width: 120,
                      backgroundColor: "#1982c4",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={[styles.cardContent, { width: "100%" }]}>
                    <Text style={styles.cardLabel}>Contain</Text>
                    <Text style={styles.cardHint}>(Smaller)</Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.algorithmInfo}>
                <View style={styles.algorithmItem}>
                  <View
                    style={[
                      styles.algorithmIndicator,
                      { backgroundColor: "#ffca3a" },
                    ]}
                  />
                  <Text style={styles.algorithmText}>
                    CENTER: Triggers when draggable center is over the drop zone
                  </Text>
                </View>
                <View style={styles.algorithmItem}>
                  <View
                    style={[
                      styles.algorithmIndicator,
                      { backgroundColor: "#8ac926" },
                    ]}
                  />
                  <Text style={styles.algorithmText}>
                    INTERSECT: Triggers when any part overlaps (default)
                  </Text>
                </View>
                <View style={styles.algorithmItem}>
                  <View
                    style={[
                      styles.algorithmIndicator,
                      { backgroundColor: "#1982c4" },
                    ]}
                  />
                  <Text style={styles.algorithmText}>
                    CONTAIN: Triggers when entire draggable is inside drop zone
                  </Text>
                </View>
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
  algorithmInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  algorithmItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  algorithmIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  algorithmText: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
    lineHeight: 20,
  },
});
