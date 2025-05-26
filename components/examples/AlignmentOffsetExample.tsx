import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
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
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Alignment & Offset" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                Control how dropped items are positioned within drop zones. Try
                different alignment and offset combinations.
              </Text>

              {/* Alignment Dropdown */}
              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>Drop Alignment</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowAlignmentDropdown(true)}
                >
                  <Text style={styles.dropdownText}>
                    {selectedAlignmentLabel}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* X Offset Slider */}
              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>X Offset: {offsetX}px</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>-30</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={-30}
                    maximumValue={30}
                    onValueChange={setOffsetX}
                    step={1}
                    minimumTrackTintColor="#FF3B30"
                    maximumTrackTintColor="#2C2C2E"
                    thumbTintColor="#FF3B30"
                  />
                  <Text style={styles.sliderLabel}>30</Text>
                </View>
              </View>

              {/* Y Offset Slider */}
              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>Y Offset: {offsetY}px</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>-30</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={-30}
                    maximumValue={30}
                    onValueChange={setOffsetY}
                    step={1}
                    minimumTrackTintColor="#FF3B30"
                    maximumTrackTintColor="#2C2C2E"
                    thumbTintColor="#FF3B30"
                  />
                  <Text style={styles.sliderLabel}>30</Text>
                </View>
              </View>

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="alignment-demo-zone"
                  style={[styles.dropZone, styles.dropZoneBlue]}
                  dropAlignment={selectedAlignment}
                  dropOffset={{ x: offsetX, y: offsetY }}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped with alignment: ${selectedAlignment}, offset: (${offsetX}, ${offsetY})`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Demo Zone</Text>
                  <Text style={styles.dZoneSubText}>
                    Alignment: {selectedAlignment}
                  </Text>
                  <Text style={styles.dZoneSubText}>
                    Offset: ({offsetX}, {offsetY})
                  </Text>
                </Droppable>
              </View>

              <View style={styles.draggableItemsArea}>
                <Draggable<DraggableItemData>
                  data={{
                    id: "alignment-item-1",
                    label: "Test Item 1",
                    backgroundColor: "#ff6b6b",
                  }}
                  style={[
                    {
                      backgroundColor: "#ff6b6b",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Test</Text>
                    <Text style={styles.cardHint}>
                      Try alignment and offset
                    </Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#FF3B30" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Alignment controls where items are positioned within the
                    drop zone
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#58a6ff" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Offset adds additional pixel displacement from the alignment
                    point
                  </Text>
                </View>
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
  controlSection: {
    marginBottom: 24,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
  },
  dropdownText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
    marginLeft: 4,
  },
  dropZoneArea: {
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 160,
    marginBottom: 32,
  },
  dropZone: {
    width: "80%",
    height: 140,
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
    marginBottom: 4,
  },
  dZoneSubText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
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
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    width: 120,
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
    fontSize: 12,
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
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginHorizontal: 8,
  },
  slider: {
    flex: 1,
  },
});
