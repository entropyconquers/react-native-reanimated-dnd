import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";

import Slider from "@react-native-community/slider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { Draggable } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";
import { BottomSheet } from "@/components/BottomSheet";
import { BottomSheetOption } from "@/components/BottomSheetOption";
import { useToast } from "@/components/toast";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface AlignmentOffsetExampleProps {
  onBack: () => void;
}

type DropAlignment =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "center-left"
  | "center-right";

const alignmentOptions: { label: string; value: DropAlignment }[] = [
  { label: "Center", value: "center" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Center", value: "top-center" },
  { label: "Top Right", value: "top-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Center", value: "bottom-center" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Left Center", value: "center-left" },
  { label: "Right Center", value: "center-right" },
];

export function AlignmentOffsetExample({
  onBack,
}: AlignmentOffsetExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();
  const [selectedAlignment, setSelectedAlignment] =
    useState<DropAlignment>("center");
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [showAlignmentDropdown, setShowAlignmentDropdown] = useState(false);

  const selectedAlignmentLabel =
    alignmentOptions.find((option) => option.value === selectedAlignment)
      ?.label || "Center";

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Alignment & Offset" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            {/* Alignment Dropdown */}
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowAlignmentDropdown(true)}
            >
              <Text style={styles.dropdownLabel}>Alignment</Text>
              <View style={styles.dropdownRight}>
                <Text style={styles.dropdownValue}>
                  {selectedAlignmentLabel}
                </Text>
                <Text style={styles.dropdownArrow}>{"\u25BC"}</Text>
              </View>
            </TouchableOpacity>

            {/* X Offset Slider */}
            <View style={styles.sliderSection}>
              <View style={styles.sliderLabelRow}>
                <Text style={styles.sliderTitle}>X Offset</Text>
                <Text style={styles.sliderValue}>{offsetX}px</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={-30}
                maximumValue={30}
                onValueChange={setOffsetX}
                step={1}
                minimumTrackTintColor="#FF3B30"
                maximumTrackTintColor="#1A1C26"
                thumbTintColor="#FF3B30"
              />
            </View>

            {/* Y Offset Slider */}
            <View style={styles.sliderSection}>
              <View style={styles.sliderLabelRow}>
                <Text style={styles.sliderTitle}>Y Offset</Text>
                <Text style={styles.sliderValue}>{offsetY}px</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={-30}
                maximumValue={30}
                onValueChange={setOffsetY}
                step={1}
                minimumTrackTintColor="#FF3B30"
                maximumTrackTintColor="#1A1C26"
                thumbTintColor="#FF3B30"
              />
            </View>

            {/* Demo area - flex: 1 */}
            <View style={styles.demoArea}>
              <Droppable<DraggableItemData>
                droppableId="alignment-demo-zone"
                style={styles.dropZone}
                dropAlignment={selectedAlignment}
                dropOffset={{ x: offsetX, y: offsetY }}
                onDrop={(data) =>
                  showToast({
                    title: "Placed!",
                    subtitle: `Aligned to ${selectedAlignment} with offset (${offsetX}, ${offsetY})`,
                    autodismiss: true,
                  })
                }
              >
                <Text style={styles.dropZoneText}>Demo Zone</Text>
                <Text style={styles.dropZoneSubText}>
                  Alignment: {selectedAlignment} {"\u00B7"} Offset: ({offsetX},{" "}
                  {offsetY})
                </Text>
              </Droppable>

              <View style={styles.draggableArea}>
                <Draggable<DraggableItemData>
                  data={{
                    id: "alignment-item-1",
                    label: "Test Item 1",
                    backgroundColor: "#ff6b6b",
                  }}
                  style={{
                    backgroundColor: "#ff6b6b",
                    borderRadius: 12,
                  }}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Test</Text>
                    <Text style={styles.cardHint}>
                      Try alignment and offset
                    </Text>
                  </View>
                </Draggable>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#FF3B30" }]}
                />
                <Text style={styles.legendText}>
                  Alignment controls where items are positioned within the drop
                  zone
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#58a6ff" }]}
                />
                <Text style={styles.legendText}>
                  Offset adds additional pixel displacement from the alignment
                  point
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Alignment Dropdown Modal */}
          <BottomSheet
            isVisible={showAlignmentDropdown}
            onClose={() => setShowAlignmentDropdown(false)}
            title="Select Alignment"
          >
            <BottomSheetOption
              options={alignmentOptions}
              selectedOption={selectedAlignment}
              onSelect={(option) => {
                setSelectedAlignment(option.value);
                setShowAlignmentDropdown(false);
              }}
            />
          </BottomSheet>
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
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#1E2028",
    borderRadius: 10,
    backgroundColor: "#111318",
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    color: "#F1F5F9",
  },
  dropdownRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dropdownValue: {
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    color: "#94A3B8",
  },
  dropdownArrow: {
    fontSize: 11,
    color: "#64748B",
  },
  sliderSection: {
    marginBottom: 10,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sliderTitle: {
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    color: "#F1F5F9",
  },
  sliderValue: {
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    color: "#FF3B30",
  },
  slider: {
    width: "100%",
    height: 32,
  },
  demoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 16,
    minHeight: 120,
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
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  dropZoneSubText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    marginTop: 2,
    letterSpacing: 0.1,
    textAlign: "center",
  },
  draggableArea: {
    marginTop: 16,
    alignSelf: "center",
  },
  cardContent: {
    width: 120,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(255, 107, 107, 0.35)",
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
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
    gap: 6,
    marginBottom: 4,
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
    flex: 1,
  },
});
