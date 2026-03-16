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

interface XAxisConstrainedExampleProps {
  onBack: () => void;
}

export function XAxisConstrainedExample({
  onBack,
}: XAxisConstrainedExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="X-Axis Constraints" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.sectionDescription}>
              Horizontal movement only. Slide left or right.
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
                  showToast({ title: "Left!", subtitle: "Dropped on the left zone", autodismiss: true })
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
                  showToast({ title: "Right!", subtitle: "Dropped on the right zone", autodismiss: true })
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
                style={styles.cardWrapper}
              >
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>X-Axis Only</Text>
                  <Text style={styles.cardHint}>Slide left or right</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#80ed99" }]} />
                <Text style={styles.legendText}>Constrained to horizontal movement</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#58a6ff" }]} />
                <Text style={styles.legendText}>Left drop zone</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#3fb950" }]} />
                <Text style={styles.legendText}>Right drop zone</Text>
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
  sectionDescription: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  axisConstraintContainer: {
    flex: 1,
    minHeight: 140,
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#111318",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1A1C26",
    padding: 16,
    marginBottom: 20,
  },
  xAxisDropZone: {
    width: 90,
    height: 90,
    position: "absolute",
    top: "50%",
    marginTop: -45,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  dropZoneBlue: {
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.12)",
  },
  dropZoneGreen: {
    borderColor: "rgba(63, 185, 80, 0.3)",
    backgroundColor: "rgba(63, 185, 80, 0.12)",
  },
  dropZoneText: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  cardWrapper: {
    alignSelf: "center",
    borderRadius: 12,
  },
  card: {
    width: 120,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(128, 237, 153, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  cardHint: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    marginTop: 3,
    color: "#64748B",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 18,
  },
});
