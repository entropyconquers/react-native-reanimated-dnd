import React, { useRef, useCallback, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { withTiming, withSpring, Easing } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { UseDraggableOptions } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Draggable } from "react-native-reanimated-dnd";
import { Footer } from "@/components/Footer";
import { BottomSheet } from "@/components/BottomSheet";
import { BottomSheetOption } from "@/components/BottomSheetOption";
import { useToast } from "@/components/toast";

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
  { label: "Spring", value: "spring" },
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

interface AnimationControlsState {
  selectedAnimation: AnimationType;
  selectedDuration: number;
  selectedEasingKey: string;
  showDurationDropdown: boolean;
  showEasingDropdown: boolean;
}

const initialAnimationControlsState: AnimationControlsState = {
  selectedAnimation: "spring",
  selectedDuration: 300,
  selectedEasingKey: "ease-out",
  showDurationDropdown: false,
  showEasingDropdown: false,
};

function mergeAnimationControlsState(
  state: AnimationControlsState,
  updates: Partial<AnimationControlsState>
) {
  return { ...state, ...updates };
}

export function AnimationExample({ onBack }: AnimationExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();
  const [controlsState, updateControlsState] = useReducer(
    mergeAnimationControlsState,
    initialAnimationControlsState
  );
  const {
    selectedAnimation,
    selectedDuration,
    selectedEasingKey,
    showDurationDropdown,
    showEasingDropdown,
  } = controlsState;

  // Create animation function based on selected options
  const createAnimationFunction =
    useCallback((): UseDraggableOptions<any>["animationFunction"] => {
      return (toValue: number) => {
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

  const selectedDurationLabel =
    durationOptions.find((option) => option.value === selectedDuration)
      ?.label || "Normal (300ms)";

  const selectedEasingLabel =
    easingOptions.find((option) => option.key === selectedEasingKey)?.label ||
    "Ease Out";

  const isTimingBased =
    selectedAnimation === "timing" ||
    selectedAnimation === "bounce" ||
    selectedAnimation === "elastic" ||
    selectedAnimation === "custom";

  const zoneSubLabel = isTimingBased
    ? `${selectedAnimation.charAt(0).toUpperCase() + selectedAnimation.slice(1)} \u00B7 ${selectedDuration}ms`
    : "Spring";

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Custom Animations" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            {/* Animation Type Chips */}
            <View style={styles.chipsRow}>
              {animationTypes.map((type) => {
                const isSelected = selectedAnimation === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.chip,
                      isSelected ? styles.chipSelected : styles.chipUnselected,
                    ]}
                    onPress={() =>
                      updateControlsState({ selectedAnimation: type.value })
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? "#FF3B30" : "#94A3B8",
                        },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Duration + Easing row (only for timing-based) */}
            {isTimingBased && (
              <View style={styles.dropdownRow}>
                <TouchableOpacity
                  style={styles.compactDropdown}
                  onPress={() =>
                    updateControlsState({ showDurationDropdown: true })
                  }
                >
                  <Text style={styles.compactDropdownLabel}>Duration</Text>
                  <View style={styles.compactDropdownRight}>
                    <Text style={styles.compactDropdownValue}>
                      {selectedDuration}ms
                    </Text>
                    <Text style={styles.compactDropdownArrow}>{"\u25BC"}</Text>
                  </View>
                </TouchableOpacity>

                {selectedAnimation === "timing" && (
                  <TouchableOpacity
                    style={styles.compactDropdown}
                    onPress={() =>
                      updateControlsState({ showEasingDropdown: true })
                    }
                  >
                    <Text style={styles.compactDropdownLabel}>Easing</Text>
                    <View style={styles.compactDropdownRight}>
                      <Text style={styles.compactDropdownValue}>
                        {selectedEasingLabel}
                      </Text>
                      <Text style={styles.compactDropdownArrow}>
                        {"\u25BC"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Demo area - flex: 1 */}
            <View style={styles.demoArea}>
              <Droppable<DraggableItemData>
                droppableId="animation-demo-zone"
                style={styles.dropZone}
                onDrop={(data) =>
                  showToast({
                    title: "Dropped!",
                    subtitle: `Returned with ${selectedAnimation} animation`,
                    autodismiss: true,
                  })
                }
              >
                <Text style={styles.dropZoneText}>Animation Test Zone</Text>
                <Text style={styles.dropZoneSubText}>{zoneSubLabel}</Text>
              </Droppable>

              <View style={styles.draggableArea}>
                <Draggable<DraggableItemData>
                  key={`animation-item-1-${selectedAnimation}-${selectedDuration}-${selectedEasingKey}`}
                  data={{
                    id: "animation-item-1",
                    label: "Animation Test 1",
                    backgroundColor: "#ff9f43",
                  }}
                  animationFunction={animationFunction}
                  style={{
                    backgroundColor: "#ff9f43",
                    borderRadius: 12,
                  }}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Test 1</Text>
                    <Text style={styles.cardHint}>Custom anim</Text>
                  </View>
                </Draggable>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#ff9f43" }]}
                />
                <Text style={styles.legendText}>
                  Spring: Natural bouncy animation with damping and stiffness
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#10ac84" }]}
                />
                <Text style={styles.legendText}>
                  Timing: Linear progression with customizable duration and
                  easing
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Duration Dropdown Modal */}
          <BottomSheet
            isVisible={showDurationDropdown}
            onClose={() => updateControlsState({ showDurationDropdown: false })}
            title="Select Duration"
          >
            <BottomSheetOption
              options={durationOptions}
              selectedOption={selectedDuration}
              onSelect={(option) => {
                updateControlsState({
                  selectedDuration: option.value,
                  showDurationDropdown: false,
                });
              }}
            />
          </BottomSheet>

          {/* Easing Dropdown Modal */}
          <BottomSheet
            isVisible={showEasingDropdown}
            onClose={() => updateControlsState({ showEasingDropdown: false })}
            title="Select Easing Function"
          >
            <BottomSheetOption
              options={easingOptions}
              selectedOption={selectedEasingKey}
              onSelect={(option) => {
                updateControlsState({
                  selectedEasingKey: option.key || "ease-out",
                  showEasingDropdown: false,
                });
              }}
            />
          </BottomSheet>
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
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipSelected: {
    borderColor: "#FF3B30",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  chipUnselected: {
    borderColor: "#1E2028",
    backgroundColor: "#111318",
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
  },
  dropdownRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  compactDropdown: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#1E2028",
    borderRadius: 10,
    backgroundColor: "#111318",
  },
  compactDropdownLabel: {
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    color: "#F1F5F9",
  },
  compactDropdownRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compactDropdownValue: {
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    color: "#94A3B8",
  },
  compactDropdownArrow: {
    fontSize: 11,
    color: "#64748B",
  },
  demoArea: {
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
    borderColor: "rgba(255, 159, 67, 0.35)",
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
