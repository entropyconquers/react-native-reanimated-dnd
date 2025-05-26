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

interface DragHandlesExampleProps {
  onBack: () => void;
}

export function DragHandlesExample({ onBack }: DragHandlesExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Drag Handles" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates using drag handles for more precise
                control. Only specific areas can initiate dragging.
              </Text>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="handle-drop-zone"
                  style={[
                    styles.dropZone,
                    styles.dropZoneBlue,
                    { height: 150 },
                  ]}
                  onDrop={(data) => {
                    Alert.alert(
                      "Item Dropped",
                      `Item "${data.label}" dropped in handle demo zone`
                    );
                  }}
                >
                  <Text style={styles.dropZoneText}>Drop Target</Text>
                  <Text style={styles.dZoneSubText}>(For handle examples)</Text>
                </Droppable>
              </View>

              <View
                style={[
                  styles.draggableItemsArea,
                  { minHeight: 300, marginTop: 30 },
                ]}
              >
                {/* Example 1: Entire item is a drag handle */}
                <Draggable<DraggableItemData>
                  key="handle-demo-item-1"
                  draggableId="handle-demo-item-1"
                  data={{
                    id: "handle-demo-item-1",
                    label: "Full Handle Item",
                    backgroundColor: "#2a9d8f",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      left: 0,
                      backgroundColor: "#2a9d8f",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <Draggable.Handle>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardLabel}>Fully Draggable</Text>
                      <Text style={styles.cardHint}>Drag from anywhere</Text>
                    </View>
                  </Draggable.Handle>
                </Draggable>

                {/* Example 2: Drag handle as part of the UI */}
                <Draggable<DraggableItemData>
                  key="handle-demo-item-2"
                  draggableId="handle-demo-item-2"
                  data={{
                    id: "handle-demo-item-2",
                    label: "Handle-Only Item",
                    backgroundColor: "#e9c46a",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 0,
                      right: 0,
                      backgroundColor: "#e9c46a",
                      borderRadius: 12,
                      width: 160,
                      padding: 0,
                    },
                  ]}
                >
                  <View
                    style={[styles.cardContent, { width: "100%", height: 100 }]}
                  >
                    <Text style={styles.cardLabel}>Handle-Only</Text>
                    <Text style={styles.cardHint}>Drag from handle below</Text>

                    {/* The handle is only part of the draggable */}
                    <Draggable.Handle>
                      <View style={styles.dragHandle}>
                        <Text style={styles.handleText}>⬌ DRAG HERE ⬌</Text>
                      </View>
                    </Draggable.Handle>
                  </View>
                </Draggable>

                {/* Example 3: Real-world Card with Header as Handle */}
                <Draggable<DraggableItemData>
                  key="handle-demo-item-3"
                  draggableId="handle-demo-item-3"
                  data={{
                    id: "handle-demo-item-3",
                    label: "Card with Header Handle",
                    backgroundColor: "#606c38",
                  }}
                  style={[
                    styles.draggable,
                    {
                      top: 140,
                      left: "50%",
                      marginLeft: -100,
                      backgroundColor: "#ffffff",
                      borderRadius: 12,
                      width: 200,
                      overflow: "hidden",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    },
                  ]}
                >
                  {/* Card with header as drag handle */}
                  <View style={styles.cardWithHeader}>
                    <Draggable.Handle>
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardHeaderText}>Drag Card</Text>
                        <Text style={styles.cardHeaderIcon}>⬌</Text>
                      </View>
                    </Draggable.Handle>

                    <View style={styles.cardBody}>
                      <Text style={styles.cardBodyTitle}>Card Content</Text>
                      <Text style={styles.cardBodyText}>
                        This area is not draggable. Only the header can be used
                        to drag this card.
                      </Text>
                    </View>
                  </View>
                </Draggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#2a9d8f" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Entire component as drag handle - drag from anywhere
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#e9c46a" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Specific handle area - only the orange bar can initiate drag
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#606c38" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Card with header handle - only header area is draggable
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
    padding: 20,
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
    minHeight: 140,
    marginBottom: 32,
  },
  dropZone: {
    width: "80%",
    height: 120,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
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
    textAlign: "center",
  },
  draggableItemsArea: {
    position: "relative",
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 10,
  },
  draggable: {
    position: "absolute",
  },
  cardContent: {
    width: 140,
    height: 80,
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
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    textAlign: "center",
    marginBottom: 4,
  },
  cardHint: {
    fontSize: 12,
    color: "#8E8E93",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  dragHandle: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 6,
    width: "100%",
  },
  handleText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  cardWithHeader: {
    flexDirection: "column",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#606c38",
    width: "100%",
  },
  cardHeaderText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardHeaderIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardBody: {
    padding: 12,
  },
  cardBodyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  cardBodyText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  infoContainer: {
    marginTop: 32,
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
