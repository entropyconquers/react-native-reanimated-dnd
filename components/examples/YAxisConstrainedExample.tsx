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

interface YAxisConstrainedExampleProps {
  onBack: () => void;
}

export function YAxisConstrainedExample({
  onBack,
}: YAxisConstrainedExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Y-Axis Constraints" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates vertical-only dragging movement. The
                item can only be dragged up and down, not left or right.
              </Text>

              <View style={styles.yAxisConstraintContainer}>
                <Droppable<DraggableItemData>
                  droppableId="y-axis-top"
                  style={[
                    styles.yAxisDropZone,
                    styles.dropZoneBlue,
                    { top: 10 },
                  ]}
                  onDrop={(data) =>
                    Alert.alert("Drop!", `"${data.label}" dropped on top zone`)
                  }
                >
                  <Text style={styles.dropZoneText}>Top</Text>
                </Droppable>

                <Droppable<DraggableItemData>
                  droppableId="y-axis-bottom"
                  style={[
                    styles.yAxisDropZone,
                    styles.dropZoneGreen,
                    { bottom: 10 },
                  ]}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped on bottom zone`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Bottom</Text>
                </Droppable>

                <Draggable<DraggableItemData>
                  key="y-axis-item"
                  data={{
                    id: "y-axis-item",
                    label: "Y-axis Constrained",
                    backgroundColor: "#f7d9c4",
                  }}
                  dragAxis="y"
                  style={[
                    styles.cardCentered,
                    {
                      backgroundColor: "#f7d9c4",
                      alignSelf: "center",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Y-Axis Only</Text>
                    <Text style={styles.cardHint}>↑↓</Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#f7d9c4" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Draggable constrained to vertical movement only
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
                    Top drop zone - positioned at the top
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
                    Bottom drop zone - positioned at the bottom
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
  yAxisConstraintContainer: {
    height: 240,
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
  },
  yAxisDropZone: {
    position: "absolute",
    width: "100%",
    height: 72,
    left: 0,
    right: 0,
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
