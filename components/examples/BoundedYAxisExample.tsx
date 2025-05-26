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

interface BoundedYAxisExampleProps {
  onBack: () => void;
}

export function BoundedYAxisExample({ onBack }: BoundedYAxisExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const boundsViewRef2 = useRef<View>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Bounded Y-Axis" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates vertical dragging within specific
                boundaries. The item can only move up and down within the blue
                bounded area.
              </Text>

              <View ref={boundsViewRef2} style={styles.verticalBoundsContainer}>
                <Droppable<DraggableItemData>
                  droppableId="bounded-y-axis-target"
                  style={[styles.yAxisBoundedDropZone, styles.dropZoneBlue]}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped in bounded Y-axis zone`
                    )
                  }
                  dropAlignment="top-center"
                >
                  <Text style={styles.dropZoneText}>Target</Text>
                  <Text style={styles.dZoneSubText}>Drop here</Text>
                </Droppable>

                <Draggable<DraggableItemData>
                  key="bounded-y-item"
                  data={{
                    id: "bounded-y-item",
                    label: "Bounded Y-axis",
                    backgroundColor: "#c6def1",
                  }}
                  dragBoundsRef={boundsViewRef2}
                  dragAxis="y"
                  style={[
                    styles.cardCentered,
                    {
                      backgroundColor: "#c6def1",
                      marginTop: 20,
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Bounded Y</Text>
                    <Text style={styles.cardHint}>↕</Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#58a6ff" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    The blue border defines the vertical dragging boundary
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#c6def1" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Item constrained to vertical movement within bounds
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
  verticalBoundsContainer: {
    height: 280,
    borderWidth: 2,
    width: 180,
    borderColor: "#58a6ff",
    backgroundColor: "rgba(88, 166, 255, 0.08)",
    borderRadius: 16,
    padding: 24,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  yAxisBoundedDropZone: {
    width: "90%",
    height: 60,
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
