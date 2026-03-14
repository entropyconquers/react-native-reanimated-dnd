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

interface YAxisConstrainedExampleProps {
  onBack: () => void;
}

export function YAxisConstrainedExample({
  onBack,
}: YAxisConstrainedExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Y-Axis Constraints" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.sectionDescription}>
              Vertical movement only. Slide up or down.
            </Text>

            <View style={styles.yAxisConstraintContainer}>
              <Droppable<DraggableItemData>
                droppableId="y-axis-top"
                style={[
                  styles.yAxisDropZone,
                  styles.dropZoneBlue,
                  { top: 12 },
                ]}
                onDrop={(data) =>
                  showToast({ title: "Top!", subtitle: "Dropped on the top zone", autodismiss: true })
                }
              >
                <Text style={styles.dropZoneText}>Top</Text>
              </Droppable>

              <Droppable<DraggableItemData>
                droppableId="y-axis-bottom"
                style={[
                  styles.yAxisDropZone,
                  styles.dropZoneGreen,
                  { bottom: 12 },
                ]}
                onDrop={(data) =>
                  showToast({ title: "Bottom!", subtitle: "Dropped on the bottom zone", autodismiss: true })
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
                style={styles.cardWrapper}
              >
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Y-Axis Only</Text>
                  <Text style={styles.cardHint}>Slide up or down</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#f7d9c4" }]} />
                <Text style={styles.legendText}>Constrained to vertical movement</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#58a6ff" }]} />
                <Text style={styles.legendText}>Top drop zone</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#3fb950" }]} />
                <Text style={styles.legendText}>Bottom drop zone</Text>
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
  yAxisConstraintContainer: {
    flex: 1,
    minHeight: 220,
    position: "relative",
    justifyContent: "center",
    backgroundColor: "#111318",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1A1C26",
    padding: 16,
    marginBottom: 20,
  },
  yAxisDropZone: {
    position: "absolute",
    width: "85%",
    height: 70,
    left: "7.5%",
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
    width: 130,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(247, 217, 196, 0.35)",
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
