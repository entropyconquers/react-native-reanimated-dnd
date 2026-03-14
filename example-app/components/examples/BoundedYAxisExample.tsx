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

interface BoundedYAxisExampleProps {
  onBack: () => void;
}

export function BoundedYAxisExample({ onBack }: BoundedYAxisExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();
  const boundsViewRef2 = useRef<View>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Bounded Y-Axis" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.sectionDescription}>
              Vertical movement within the bounded corridor.
            </Text>

            <View ref={boundsViewRef2} style={styles.verticalBoundsContainer}>
              <Droppable<DraggableItemData>
                droppableId="bounded-y-axis-target"
                style={styles.innerDropZone}
                onDrop={(data) =>
                  showToast({ title: "Nice!", subtitle: "Dropped on the target", autodismiss: true })
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
                dragBoundsRef={boundsViewRef2 as React.RefObject<View>}
                dragAxis="y"
                style={styles.cardWrapper}
              >
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>Bounded Y</Text>
                  <Text style={styles.cardHint}>Slide vertically</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#58a6ff" }]} />
                <Text style={styles.legendText}>Blue border defines the vertical boundary</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#c6def1" }]} />
                <Text style={styles.legendText}>Item constrained within bounds</Text>
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
  verticalBoundsContainer: {
    flex: 1,
    minHeight: 260,
    borderWidth: 1.5,
    width: 180,
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.04)",
    borderRadius: 20,
    padding: 24,
    alignSelf: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 20,
  },
  innerDropZone: {
    width: "90%",
    height: 65,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 20,
    borderRadius: 12,
  },
  card: {
    width: 120,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(198, 222, 241, 0.35)",
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
