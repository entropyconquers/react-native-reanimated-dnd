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

interface BoundedDraggingExampleProps {
  onBack: () => void;
}

export function BoundedDraggingExample({
  onBack,
}: BoundedDraggingExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const boundsViewRef = useRef<View>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Bounded Dragging" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates constraining dragging within specific
                boundaries. The draggable item cannot be moved outside the blue
                bounded area.
              </Text>

              <View ref={boundsViewRef} style={styles.boundsContainer}>
                <Droppable<DraggableItemData>
                  droppableId="bounded-zone"
                  style={[styles.innerDropZone, styles.dropZoneBlue]}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped in bounded zone`
                    )
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
                  dragBoundsRef={boundsViewRef}
                  style={[
                    styles.cardCentered,
                    {
                      backgroundColor: "#ffafcc",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Bounded</Text>
                    <Text style={styles.cardHint}>Can't escape!</Text>
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
                    The blue border defines the draggable boundary
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#ffafcc" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Draggable item is constrained within this area
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
  boundsContainer: {
    minHeight: 200,
    borderWidth: 2,
    borderColor: "#58a6ff",
    backgroundColor: "rgba(88, 166, 255, 0.08)",
    borderRadius: 16,
    padding: 24,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  innerDropZone: {
    width: "80%",
    height: 72,
    marginBottom: 24,
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
