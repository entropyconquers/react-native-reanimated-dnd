import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { CustomDraggable } from "@/components/CustomDraggable";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/toast";

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
  const { showToast } = useToast();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Custom Draggable" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.description}>
              Built with useDraggable hook. Only the purple handle initiates
              drag.
            </Text>

            <View style={styles.dropZoneArea}>
              <Droppable<DraggableItemData>
                droppableId="custom-handle-drop-zone"
                style={styles.dropZone}
                onDrop={(data) => {
                  showToast({
                    title: "Nice!",
                    subtitle: "Dropped on the target zone",
                    autodismiss: true,
                  });
                }}
              >
                <Text style={styles.dropZoneText}>Custom Drop Zone</Text>
                <Text style={styles.dropZoneSubText}>
                  Drag the card here
                </Text>
              </Droppable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>CUSTOM COMPONENT</Text>
              <View style={styles.dividerLine} />
            </View>

            <CustomDraggable<DraggableItemData>
              key="custom-handle-demo"
              data={{
                id: "custom-handle-demo",
                label: "CustomDraggable Handle Demo",
                backgroundColor: "#4361ee",
              }}
              initialStyle={styles.customCard}
            >
              <View style={styles.customCardContent}>
                <Text style={styles.cardLabel}>Custom Draggable</Text>
                <Text style={styles.cardHint}>Non-draggable content</Text>
              </View>
              <CustomDraggable.Handle>
                <View style={styles.customHandleBar}>
                  <Text style={styles.customHandleText}>CUSTOM HANDLE</Text>
                </View>
              </CustomDraggable.Handle>
            </CustomDraggable>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#4361ee" }]}
                />
                <Text style={styles.legendText}>
                  CustomDraggable built with useDraggable hook
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#C084FC" }]}
                />
                <Text style={styles.legendText}>
                  Only the purple handle area initiates dragging
                </Text>
              </View>
            </View>
          </ScrollView>
        </DropProvider>
      </View>
      <Footer />
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
  description: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  dropZoneArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 20,
    minHeight: 120,
  },
  dropZone: {
    flex: 1,
    maxHeight: 180,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(63, 185, 80, 0.3)",
    backgroundColor: "rgba(63, 185, 80, 0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dropZoneText: {
    fontSize: 17,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  dropZoneSubText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    marginTop: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  dividerLabel: {
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    color: "#475569",
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  customCard: {
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(67, 97, 238, 0.35)",
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
    width: 200,
    marginBottom: 24,
  },
  customCardContent: {
    padding: 16,
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
    color: "#64748B",
    marginTop: 3,
    textAlign: "center",
  },
  customHandleBar: {
    backgroundColor: "rgba(58, 12, 163, 0.15)",
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(58, 12, 163, 0.2)",
  },
  customHandleText: {
    color: "#C084FC",
    fontSize: 12,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 1.5,
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
    color: "#64748B",
    lineHeight: 18,
  },
});
