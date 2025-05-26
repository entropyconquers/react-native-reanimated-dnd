import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { withTiming, withSpring, Easing } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { UseDraggableOptions } from "@/types/draggable";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Draggable } from "react-native-reanimated-dnd";
import { Footer } from "@/components/Footer";
import { BottomSheet } from "@/components/BottomSheet";
import { BottomSheetOption } from "@/components/BottomSheetOption";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
}

interface AnimationExampleProps {
  onBack: () => void;
}

type AnimationType = "spring" | "timing" | "bounce" | "elastic" | "custom";

const animationTypes: { label: string; value: AnimationType }[] = [
  { label: "Spring (Default)", value: "spring" },
  { label: "Timing", value: "timing" },
  { label: "Bounce", value: "bounce" },
  { label: "Elastic", value: "elastic" },
  { label: "Custom Cubic", value: "custom" },
];

const durationOptions = [
  { label: "Fast (150ms)", value: 150 },
  { label: "Normal (300ms)", value: 300 },
  { label: "Slow (600ms)", value: 600 },
  { label: "Very Slow (1000ms)", value: 1000 },
];

const easingOptions = [
  { label: "Linear", value: Easing.linear, key: "linear" },
  { label: "Ease In", value: Easing.in(Easing.ease), key: "ease-in" },
  { label: "Ease Out", value: Easing.out(Easing.ease), key: "ease-out" },
  {
    label: "Ease In Out",
    value: Easing.inOut(Easing.ease),
    key: "ease-in-out",
  },
  { label: "Cubic", value: Easing.cubic, key: "cubic" },
  { label: "Bounce", value: Easing.bounce, key: "bounce" },
];

export function AnimationExample({ onBack }: AnimationExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationType>("spring");
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [selectedEasingKey, setSelectedEasingKey] = useState("ease-out");
  const [showAnimationDropdown, setShowAnimationDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showEasingDropdown, setShowEasingDropdown] = useState(false);

  // Create animation function based on selected options
  const createAnimationFunction =
    useCallback((): UseDraggableOptions<any>["animationFunction"] => {
      return (toValue) => {
        "worklet";

        const selectedEasing =
          easingOptions.find((option) => option.key === selectedEasingKey)
            ?.value || Easing.out(Easing.ease);

        switch (selectedAnimation) {
          case "spring":
            return withSpring(toValue, {
              damping: 15,
              stiffness: 150,
              mass: 1,
            });

          case "timing":
            return withTiming(toValue, {
              duration: selectedDuration,
              easing: selectedEasing,
            });

          case "bounce":
            return withTiming(toValue, {
              duration: selectedDuration,
              easing: Easing.bounce,
            });

          case "elastic":
            return withTiming(toValue, {
              duration: selectedDuration,
              easing: Easing.elastic(2),
            });

          case "custom":
            return withTiming(toValue, {
              duration: selectedDuration,
              easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            });

          default:
            return withSpring(toValue);
        }
      };
    }, [selectedAnimation, selectedDuration, selectedEasingKey]);

  const animationFunction = createAnimationFunction();

  const selectedAnimationLabel =
    animationTypes.find((option) => option.value === selectedAnimation)
      ?.label || "Spring (Default)";

  const selectedDurationLabel =
    durationOptions.find((option) => option.value === selectedDuration)
      ?.label || "Normal (300ms)";

  const selectedEasingLabel =
    easingOptions.find((option) => option.key === selectedEasingKey)?.label ||
    "Ease Out";

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Custom Animations" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <View style={styles.section}>
              <Text style={styles.sectionDescription}>
                Experiment with different animation types, durations, and easing
                functions. Drop items to see how the animations behave.
              </Text>

              {/* Animation Type Dropdown */}
              <View style={styles.controlSection}>
                <Text style={styles.controlTitle}>Animation Type</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowAnimationDropdown(true)}
                >
                  <Text style={styles.dropdownText}>
                    {selectedAnimationLabel}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Duration Dropdown (only for timing-based animations) */}
              {(selectedAnimation === "timing" ||
                selectedAnimation === "bounce" ||
                selectedAnimation === "elastic" ||
                selectedAnimation === "custom") && (
                <View style={styles.controlSection}>
                  <Text style={styles.controlTitle}>Duration</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowDurationDropdown(true)}
                  >
                    <Text style={styles.dropdownText}>
                      {selectedDurationLabel}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Easing Dropdown (only for timing animation) */}
              {selectedAnimation === "timing" && (
                <View style={styles.controlSection}>
                  <Text style={styles.controlTitle}>Easing Function</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setShowEasingDropdown(true)}
                  >
                    <Text style={styles.dropdownText}>
                      {selectedEasingLabel}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.dropZoneArea}>
                <Droppable<DraggableItemData>
                  droppableId="animation-demo-zone"
                  style={[styles.dropZone, styles.dropZoneBlue]}
                  onDrop={(data) =>
                    Alert.alert(
                      "Drop!",
                      `"${data.label}" dropped with ${selectedAnimation} animation`
                    )
                  }
                >
                  <Text style={styles.dropZoneText}>Animation Test Zone</Text>
                  <Text style={styles.dZoneSubText}>
                    Type: {selectedAnimation}
                  </Text>
                  {(selectedAnimation === "timing" ||
                    selectedAnimation === "bounce" ||
                    selectedAnimation === "elastic" ||
                    selectedAnimation === "custom") && (
                    <Text style={styles.dZoneSubText}>
                      Duration: {selectedDuration}ms
                    </Text>
                  )}
                </Droppable>
              </View>

              <View style={styles.draggableItemsArea}>
                <Draggable<DraggableItemData>
                  key={`animation-item-1-${selectedAnimation}-${selectedDuration}-${selectedEasingKey}`}
                  data={{
                    id: "animation-item-1",
                    label: "Animation Test 1",
                    backgroundColor: "#ff9f43",
                  }}
                  animationFunction={animationFunction}
                  style={[
                    {
                      backgroundColor: "#ff9f43",
                      borderRadius: 12,
                    },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Test 1</Text>
                    <Text style={styles.cardHint}>Custom anim</Text>
                  </View>
                </Draggable>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#ff9f43" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Spring: Natural bouncy animation with damping and stiffness
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <View
                    style={[
                      styles.infoIndicator,
                      { backgroundColor: "#10ac84" },
                    ]}
                  />
                  <Text style={styles.infoText}>
                    Timing: Linear progression with customizable duration and
                    easing
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Animation Type Dropdown Modal */}
          <BottomSheet
            isVisible={showAnimationDropdown}
            onClose={() => setShowAnimationDropdown(false)}
            title="Select Animation Type"
          >
            <BottomSheetOption
              options={animationTypes}
              selectedOption={selectedAnimation}
              onSelect={(option) => {
                setSelectedAnimation(option.value);
                setShowAnimationDropdown(false);
              }}
            />
          </BottomSheet>

          {/* Duration Dropdown Modal */}
          <BottomSheet
            isVisible={showDurationDropdown}
            onClose={() => setShowDurationDropdown(false)}
            title="Select Duration"
          >
            <BottomSheetOption
              options={durationOptions}
              selectedOption={selectedDuration}
              onSelect={(option) => {
                setSelectedDuration(option.value);
                setShowDurationDropdown(false);
              }}
            />
          </BottomSheet>

          {/* Easing Dropdown Modal */}
          <BottomSheet
            isVisible={showEasingDropdown}
            onClose={() => setShowEasingDropdown(false)}
            title="Select Easing Function"
          >
            <BottomSheetOption
              options={easingOptions}
              selectedOption={selectedEasingKey}
              onSelect={(option) => {
                setSelectedEasingKey(option.key || "ease-out");
                setShowEasingDropdown(false);
              }}
            />
          </BottomSheet>
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
