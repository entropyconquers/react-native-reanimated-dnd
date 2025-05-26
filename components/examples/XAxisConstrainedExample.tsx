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
}

interface XAxisConstrainedExampleProps {
  onBack: () => void;
}

export function XAxisConstrainedExample({
  onBack,
}: XAxisConstrainedExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="X-Axis Constraints" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates horizontal-only dragging movement. The
                item can only be dragged left and right, not up or down.
              </Text>

              <View style={styles.axisConstraintContainer}>
                <Droppable<DraggableItemData>
                  droppableId="x-axis-left"
                  style={[
                    styles.xAxisDropZone,
                    styles.dropZoneBlue,
                    { left: 10 },
                  ]}
                  onDrop={(data) =>
                    Alert.alert("Drop!", `"${data.label}" dropped on left zone`)
                  }
                >
                  <Text style={styles.dropZoneText}>Left</Text>
                </Droppable>

                <Droppable<DraggableItemData>
                  droppableId="x-axis-right"
                  style={[
                    styles.xAxisDropZone,
                    styles.dropZoneGreen,
                    { right: 10 },
                  ]}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped on right zone`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Right</Text>
                </Droppable>

                <Draggable<DraggableItemData>
                  key="x-axis-item"
                  data={{
                    id: "x-axis-item",
                    label: "X-axis Constrained",
                    backgroundColor: "#80ed99",
                  }}
                  dragAxis="x"
                  style={[
                    styles.cardCentered,
                    {
                      backgroundColor: "#80ed99",
                      alignSelf: "center",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>X-Axis Only</Text>
                    <Text style={styles.cardHint}>←→</Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#80ed99" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Draggable constrained to horizontal movement only
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#58a6ff" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Left drop zone - positioned on the left side
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#3fb950" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Right drop zone - positioned on the right side
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
  axisConstraintContainer: {
    height: 140,
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
  },
  xAxisDropZone: {
    width: 100,
    height: 100,
    top: 20,
    position: "absolute",
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
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
  dropZoneText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  cardCentered: {
    alignSelf: "center",
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
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
    lineHeight: 20,
  },
});
