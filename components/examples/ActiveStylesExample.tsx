import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  StyleProp,
  ViewStyle,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Draggable,
  DropProvider,
  DropProviderRef,
} from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface ActiveStylesExampleProps {
  onBack: () => void;
}

export function ActiveStylesExample({ onBack }: ActiveStylesExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);

  // Custom active styles for different drop zones
  const pulseActiveStyle: StyleProp<ViewStyle> = {
    borderColor: "#ff6b6b",
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  };

  const glowActiveStyle: StyleProp<ViewStyle> = {
    borderColor: "#4cc9f0",
    backgroundColor: "rgba(76, 201, 240, 0.2)",
    shadowColor: "#4cc9f0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Active Drop Styles" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                This example demonstrates custom visual effects when draggables
                hover over drop zones. Try dragging the item over each zone to
                see the different effects.
              </Text>

              <View style={styles.dropZoneArea}>
                <View style={styles.dropZoneColumn}>
                  <Text style={styles.customStyleLabel}>Pulse Effect</Text>
                  <Droppable<DraggableItemData>
                    droppableId="pulse-zone"
                    style={[styles.dropZone, styles.customDropZone]}
                    onDrop={(data: DraggableItemData) =>
                      Alert.alert("Dropped!", `${data.label} on pulse zone`)
                    }
                    activeStyle={pulseActiveStyle}
                  >
                    <Text style={styles.dropZoneText}>Pulse Zone</Text>
                    <Text style={styles.dZoneSubText}>
                      Scales up with red glow
                    </Text>
                  </Droppable>
                </View>

                <View style={styles.dropZoneColumn}>
                  <Text style={styles.customStyleLabel}>Glow Effect</Text>
                  <Droppable<DraggableItemData>
                    droppableId="glow-zone"
                    style={[styles.dropZone, styles.customDropZone]}
                    onDrop={(data: DraggableItemData) =>
                      Alert.alert("Dropped!", `${data.label} on glow zone`)
                    }
                    activeStyle={glowActiveStyle}
                  >
                    <Text style={styles.dropZoneText}>Glow Zone</Text>
                    <Text style={styles.dZoneSubText}>
                      Blue background glow
                    </Text>
                  </Droppable>
                </View>
              </View>

              <View style={styles.draggableItemsArea}>
                <Draggable<DraggableItemData>
                  key="active-styles-item"
                  data={{
                    id: "active-styles-item",
                    label: "Drop me on the custom zones",
                    backgroundColor: "#c1a1d3",
                  }}
                  style={[
                    {
                      top: 0,
                      left: "25%",
                      backgroundColor: "#c1a1d3",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Try Me</Text>
                    <Text style={styles.cardHint}>Drag over zones</Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#ff6b6b" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Pulse effect: Scales up with red border and shadow
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#4cc9f0" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Glow effect: Blue background with enhanced shadow
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
    minHeight: 160,
    marginBottom: 32,
  },
  dropZoneColumn: {
    alignItems: "center",
    width: "45%",
  },
  customStyleLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  customDropZone: {
    borderColor: "#2C2C2E",
    backgroundColor: "#1C1C1E",
    height: 120,
    width: "100%",
    borderRadius: 16,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
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
    elevation: 8,
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
