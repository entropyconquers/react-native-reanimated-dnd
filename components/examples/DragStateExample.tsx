import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  StyleProp,
  TextStyle,
  SafeAreaView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { Draggable, DraggableState } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface DragStateExampleProps {
  onBack: () => void;
}

export function DragStateExample({ onBack }: DragStateExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const [dragState, setDragState] = useState<DraggableState>(
    DraggableState.IDLE
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Drag State Management" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates the DraggableState enum and
                onStateChange callback. Current State:{" "}
                <Text style={getStateStyle(dragState)}>{dragState}</Text>
              </Text>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="state-demo-drop-zone"
                  style={[styles.dropZone, styles.dropZoneBlue]}
                  onDrop={(data) => {
                    Alert.alert(
                      "Drop!",
                      `Item "${data.label}" dropped with state: ${dragState}`
                    );
                  }}
                >
                  <Text style={styles.dropZoneText}>Drop Target</Text>
                  <Text style={styles.dZoneSubText}>(Check state changes)</Text>
                </Droppable>
              </View>

              <View style={styles.draggableItemsArea}>
                <Draggable<DraggableItemData>
                  key="D-State-Demo"
                  data={{
                    id: "state-demo-item",
                    label: "State Demo Item",
                    backgroundColor: "#e63946",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: "25%",
                      backgroundColor: "#e63946",
                      borderWidth: 2,
                      borderColor: getBorderColor(dragState),
                      borderRadius: 12,
                    },
                  ]}
                  onStateChange={(state) => {
                    setDragState(state);
                  }}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Drag Me</Text>
                    <Text style={styles.cardHint}>State: {dragState}</Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.stateInfo}>
                <View style={styles.stateItem}>
                  <View
                    style={[
                      styles.stateIndicator,
                      { backgroundColor: "#90be6d" },
                    ]}
                  />
                  <Text style={styles.stateText}>
                    IDLE: Initial or reset state
                  </Text>
                </View>
                <View style={styles.stateItem}>
                  <View
                    style={[
                      styles.stateIndicator,
                      { backgroundColor: "#f8961e" },
                    ]}
                  />
                  <Text style={styles.stateText}>
                    DRAGGING: Currently being dragged
                  </Text>
                </View>
                <View style={styles.stateItem}>
                  <View
                    style={[
                      styles.stateIndicator,
                      { backgroundColor: "#577590" },
                    ]}
                  />
                  <Text style={styles.stateText}>
                    DROPPED: Successfully dropped on target
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </DropProvider>
      </SafeAreaView>
      <Footer />
    </GestureHandlerRootView>
  );
}

// Helper function to get state-specific text style
function getStateStyle(state: DraggableState): StyleProp<TextStyle> {
  switch (state) {
    case DraggableState.IDLE:
      return { color: "#90be6d", fontWeight: "700" };
    case DraggableState.DRAGGING:
      return { color: "#f8961e", fontWeight: "700" };
    case DraggableState.DROPPED:
      return { color: "#577590", fontWeight: "700" };
  }
}

// Helper function to get state-specific border color
function getBorderColor(state: DraggableState): string {
  switch (state) {
    case DraggableState.IDLE:
      return "#90be6d"; // Green
    case DraggableState.DRAGGING:
      return "#f8961e"; // Orange
    case DraggableState.DROPPED:
      return "#577590"; // Blue
  }
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
    justifyContent: "center",
    minHeight: 120,
    marginBottom: 32,
  },
  dropZone: {
    width: "70%",
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
  stateInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  stateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stateIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  stateText: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
    lineHeight: 20,
  },
});
