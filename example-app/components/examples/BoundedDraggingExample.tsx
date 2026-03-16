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

interface BoundedDraggingExampleProps {
  onBack: () => void;
}

export function BoundedDraggingExample({
  onBack,
}: BoundedDraggingExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();
  const boundsViewRef = useRef<View | null>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Bounded Dragging" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.sectionDescription}>
              The item cannot escape the blue boundary.
            </Text>

            <View ref={boundsViewRef} style={styles.boundsContainer}>
              <Droppable<DraggableItemData>
                droppableId="bounded-zone"
                style={styles.innerDropZone}
                onDrop={(data) =>
                  showToast({ title: "Nice!", subtitle: "Dropped inside the boundary", autodismiss: true })
                }
              >
                <Text style={styles.dropZoneText}>Drop Here</Text>
                <Text style={styles.dZoneSubText}>Inside bounds</Text>
              </Droppable>

              <Draggable<DraggableItemData>
                key="bounded-item"
                data={{
                  id: "bounded-item",
                  label: "Draggable (Bounded)",
                  backgroundColor: "#ffafcc",
                }}
                dragBoundsRef={boundsViewRef as React.RefObject<View>}
                style={styles.cardWrapper}
              >
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Bounded</Text>
                  <Text style={styles.cardHint}>Can't escape!</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#58a6ff" }]} />
                <Text style={styles.legendText}>Blue border defines the boundary</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#ffafcc" }]} />
                <Text style={styles.legendText}>Draggable is constrained within</Text>
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
  boundsContainer: {
    flex: 1,
    minHeight: 240,
    borderWidth: 1.5,
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.04)",
    borderRadius: 20,
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  innerDropZone: {
    width: "85%",
    height: 80,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.05)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  dropZoneText: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  dZoneSubText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    marginTop: 2,
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
    borderColor: "rgba(255, 175, 204, 0.35)",
    alignItems: "center",
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
