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
import { DropProvider, DropProviderRef } from "@/external-lib";
import { Droppable } from "@/external-lib";
import { Draggable } from "@/external-lib";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface BasicDragDropExampleProps {
  onBack: () => void;
}

export function BasicDragDropExample({ onBack }: BasicDragDropExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Basic Drag & Drop" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                Simple drag and drop functionality with multiple drop zones.
                Drag the items to different zones to see basic interactions.
              </Text>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="zone-alpha"
                  style={[styles.dropZone, styles.dropZoneBlue]}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped on Zone Alpha`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Zone Alpha</Text>
                  <Text style={styles.dZoneSubText}>(Basic Drop Zone)</Text>
                </Droppable>
              </View>

              <View style={styles.draggableItemsArea}>
                <Draggable<DraggableItemData>
                  key="basic-item-1"
                  data={{
                    id: "basic-item-1",
                    label: "Draggable Item 1",
                    backgroundColor: "#a2d2ff",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: 20,
                      backgroundColor: "#a2d2ff",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Item 1</Text>
                    <Text style={styles.cardHint}>Drag me!</Text>
                  </View>
                </Draggable>

                <Draggable<DraggableItemData>
                  key="basic-item-2"
                  data={{
                    id: "basic-item-2",
                    label: "Draggable Item 2",
                    backgroundColor: "#bde0fe",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: 160,
                      backgroundColor: "#bde0fe",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Item 2</Text>
                    <Text style={styles.cardHint}>Drag me too!</Text>
                  </View>
                </Draggable>
              </View>
              <View style={styles.draggableItemsArea}>
                <Draggable<DraggableItemData>
                  key="basic-item-3"
                  preDragDelay={200}
                  data={{
                    id: "basic-item-3",
                    label: "Draggable Item 3",
                    backgroundColor: "#bde0fe",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: "27%",
                      backgroundColor: "#bde0fe",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={[styles.cardContent, { width: "100%" }]}>
                    <Text style={styles.cardLabel}>Item 3</Text>
                    <Text style={styles.cardHint}>With delay of 200ms</Text>
                  </View>
                </Draggable>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#a2d2ff" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Basic draggable with default spring animation
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#bde0fe" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Standard drag and drop behavior with visual feedback
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
    width: "45%",
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
