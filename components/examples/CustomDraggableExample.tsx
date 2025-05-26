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
import { CustomDraggable } from "@/components/CustomDraggable";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface CustomDraggableExampleProps {
  onBack: () => void;
}

export function CustomDraggableExample({
  onBack,
}: CustomDraggableExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Custom Draggable" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates using drag handles with the custom
                draggable component. The non-handle areas are not draggable,
                only the handle can initiate dragging.
              </Text>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="custom-handle-drop-zone"
                  style={[
                    styles.dropZone,
                    styles.dropZoneGreen,
                    { height: 120 },
                  ]}
                  onDrop={(data) => {
                    Alert.alert(
                      "Item Dropped",
                      `Item "${data.label}" dropped in CustomDraggable handle demo zone`
                    );
                  }}
                >
                  <Text style={styles.dropZoneText}>Custom Drop Zone</Text>
                  <Text style={styles.dZoneSubText}>
                    (For CustomDraggable.Handle)
                  </Text>
                </Droppable>
              </View>

              <View
                style={[
                  styles.draggableItemsArea,
                  { minHeight: 240, marginTop: 30 },
                ]}
              >
                {/* Example using CustomDraggable with handle */}
                <CustomDraggable<DraggableItemData>
                  key="custom-handle-demo"
                  data={{
                    id: "custom-handle-demo",
                    label: "CustomDraggable Handle Demo",
                    backgroundColor: "#4361ee",
                  }}
                  initialStyle={[
                    styles.draggable,
                    {
                      top: 0,
                      left: "25%",
                      backgroundColor: "#4361ee",
                      borderRadius: 12,
                      width: 180,
                    },
                  ]}
                >
                  <View style={[styles.cardContent, { width: "100%" }]}>
                    <Text style={styles.cardLabel}>Custom Draggable</Text>
                    <Text style={styles.cardHint}>Non-draggable content</Text>

                    <CustomDraggable.Handle>
                      <View
                        style={[
                          styles.dragHandle,
                          { backgroundColor: "#3a0ca3" },
                        ]}
                      >
                        <Text style={styles.handleText}>CUSTOM HANDLE</Text>
                      </View>
                    </CustomDraggable.Handle>
                  </View>
                </CustomDraggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#4361ee" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    CustomDraggable component with handle support
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#3a0ca3" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Only the purple handle area can initiate dragging
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
                    Drop zone specifically for testing handle functionality
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
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 8,
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
    height: 120,
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
  dragHandle: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 6,
    width: "100%",
  },
  handleText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
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
