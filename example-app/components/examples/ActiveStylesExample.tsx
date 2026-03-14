import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { useToast } from "@/components/toast";

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
  const { showToast } = useToast();

  // Custom active styles for different drop zones
  const pulseActiveStyle: StyleProp<ViewStyle> = {
    borderColor: "#ff6b6b",
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
    boxShadow: "0px 0px 10px rgba(255, 107, 107, 0.5)",
  };

  const glowActiveStyle: StyleProp<ViewStyle> = {
    borderColor: "#4cc9f0",
    backgroundColor: "rgba(76, 201, 240, 0.2)",
    boxShadow: "0px 0px 12px rgba(76, 201, 240, 0.7)",
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Active Drop Styles" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.sectionDescription}>
              Drag the item over each zone to see different hover effects.
            </Text>

            <View style={styles.dropZoneArea}>
              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>PULSE EFFECT</Text>
                <Droppable<DraggableItemData>
                  droppableId="pulse-zone"
                  style={styles.customDropZone}
                  onDrop={(data: DraggableItemData) =>
                    showToast({ title: "Pulse!", subtitle: "Landed on the Pulse Zone", autodismiss: true })
                  }
                  activeStyle={pulseActiveStyle}
                >
                  <Text style={styles.dropZoneText}>Pulse Zone</Text>
                  <Text style={styles.dZoneSubText}>
                    Scales + red glow
                  </Text>
                </Droppable>
              </View>

              <View style={styles.dropZoneColumn}>
                <Text style={styles.customStyleLabel}>GLOW EFFECT</Text>
                <Droppable<DraggableItemData>
                  droppableId="glow-zone"
                  style={styles.customDropZone}
                  onDrop={(data: DraggableItemData) =>
                    showToast({ title: "Glow!", subtitle: "Landed on the Glow Zone", autodismiss: true })
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

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>DRAG ITEM</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.draggableItemsArea}>
              <Draggable<DraggableItemData>
                key="active-styles-item"
                data={{
                  id: "active-styles-item",
                  label: "Drop me on the custom zones",
                  backgroundColor: "#c1a1d3",
                }}
                style={{
                  backgroundColor: "#c1a1d3",
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: "rgba(193, 161, 211, 0.35)",
                }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>Try Me</Text>
                  <Text style={styles.cardHint}>Drag over zones</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: "#ff6b6b" }]} />
                <Text style={styles.legendText}>Pulse: Scale + red border glow</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: "#4cc9f0" }]} />
                <Text style={styles.legendText}>Glow: Blue background illumination</Text>
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
    marginBottom: 20,
  },
  dropZoneArea: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    minHeight: 200,
  },
  dropZoneColumn: {
    flex: 1,
  },
  customStyleLabel: {
    fontSize: 12,
    fontFamily: "Outfit_600SemiBold",
    color: "#64748B",
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: "center",
  },
  customDropZone: {
    flex: 1,
    borderColor: "#2A2D3A",
    backgroundColor: "#111318",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  dropZoneText: {
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  dZoneSubText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 4,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1A1C26",
  },
  dividerText: {
    fontSize: 11,
    fontFamily: "Outfit_600SemiBold",
    color: "#475569",
    letterSpacing: 1.5,
  },
  draggableItemsArea: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardContent: {
    width: 120,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151823",
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#F1F5F9",
    textAlign: "center",
  },
  cardHint: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    marginTop: 3,
    color: "#64748B",
    textAlign: "center",
  },
  legend: {
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
  },
});
