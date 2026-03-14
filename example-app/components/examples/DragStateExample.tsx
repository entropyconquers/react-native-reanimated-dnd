import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StyleProp,
  TextStyle,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { Draggable, DraggableState } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/toast";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface DragStateExampleProps {
  onBack: () => void;
}

function getStateBannerBg(state: DraggableState): string {
  switch (state) {
    case DraggableState.IDLE:
      return "rgba(144, 190, 109, 0.1)";
    case DraggableState.DRAGGING:
      return "rgba(248, 150, 30, 0.1)";
    case DraggableState.DROPPED:
      return "rgba(87, 117, 144, 0.1)";
  }
}

function getStateBannerColor(state: DraggableState): string {
  switch (state) {
    case DraggableState.IDLE:
      return "#90be6d";
    case DraggableState.DRAGGING:
      return "#f8961e";
    case DraggableState.DROPPED:
      return "#577590";
  }
}

// Helper function to get state-specific text style
function getStateStyle(state: DraggableState): StyleProp<TextStyle> {
  switch (state) {
    case DraggableState.IDLE:
      return { color: "#90be6d", fontWeight: "700" };
    case DraggableState.DRAGGING:
      return { color: "#f8961e", fontWeight: "700" };
    case DraggableState.DROPPED:
      return { color: "#577590", fontWeight: "700" };
  }
}

// Helper function to get state-specific border color
function getBorderColor(state: DraggableState): string {
  switch (state) {
    case DraggableState.IDLE:
      return "#90be6d"; // Green
    case DraggableState.DRAGGING:
      return "#f8961e"; // Orange
    case DraggableState.DROPPED:
      return "#577590"; // Blue
  }
}

export function DragStateExample({ onBack }: DragStateExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();
  const [dragState, setDragState] = useState<DraggableState>(
    DraggableState.IDLE
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Drag State Management" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.sectionDescription}>
              Drag the item and watch the state change in real-time.
            </Text>

            <View
              style={[
                styles.stateBanner,
                { backgroundColor: getStateBannerBg(dragState) },
              ]}
            >
              <Text
                style={[
                  styles.stateBannerText,
                  { color: getStateBannerColor(dragState) },
                ]}
              >
                {dragState.toUpperCase()}
              </Text>
            </View>

            <View style={styles.dropZoneArea}>
              <Droppable<DraggableItemData>
                droppableId="state-demo-drop-zone"
                style={styles.dropZone}
                onDrop={(data) => {
                  showToast({
                    title: "Dropped!",
                    subtitle: `State changed to ${dragState}`,
                    autodismiss: true,
                  });
                }}
              >
                <Text style={styles.dropZoneText}>Drop Target</Text>
                <Text style={styles.dZoneSubText}>Check state changes</Text>
              </Droppable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>DRAG ITEM</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.draggableItemsArea}>
              <Draggable<DraggableItemData>
                key="D-State-Demo"
                data={{
                  id: "state-demo-item",
                  label: "State Demo Item",
                  backgroundColor: "#e63946",
                }}
                style={[
                  styles.draggable,
                  {
                    backgroundColor: "#e63946",
                    borderWidth: 1.5,
                    borderColor: getBorderColor(dragState),
                    borderRadius: 12,
                  },
                ]}
                onStateChange={(state) => {
                  setDragState(state);
                }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardLabel}>Drag Me</Text>
                  <Text style={styles.cardHint}>{dragState}</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.stateChips}>
              <View style={[styles.chip, { borderColor: "#90be6d" }]}>
                <View
                  style={[styles.chipDot, { backgroundColor: "#90be6d" }]}
                />
                <Text style={styles.chipText}>IDLE</Text>
              </View>
              <View style={[styles.chip, { borderColor: "#f8961e" }]}>
                <View
                  style={[styles.chipDot, { backgroundColor: "#f8961e" }]}
                />
                <Text style={styles.chipText}>DRAGGING</Text>
              </View>
              <View style={[styles.chip, { borderColor: "#577590" }]}>
                <View
                  style={[styles.chipDot, { backgroundColor: "#577590" }]}
                />
                <Text style={styles.chipText}>DROPPED</Text>
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
  sectionDescription: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 20,
  },
  stateBanner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  stateBannerText: {
    fontSize: 17,
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  dropZoneArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 20,
    minHeight: 140,
  },
  dropZone: {
    flex: 1,
    maxHeight: 200,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dropZoneText: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  dZoneSubText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 4,
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
  draggable: {},
  cardContent: {
    width: 130,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151823",
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  cardHint: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    marginTop: 3,
    color: "#64748B",
    textAlign: "center",
  },
  stateChips: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontSize: 11,
    fontFamily: "Outfit_600SemiBold",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
});
