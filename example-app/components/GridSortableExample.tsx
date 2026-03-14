import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SortableGrid,
  SortableGridItem,
  SortableGridRenderItemProps,
  GridOrientation,
  GridStrategy,
} from "react-native-reanimated-dnd";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import Slider from "@react-native-community/slider";
import { colors, fonts } from "../theme";
import { Footer } from "./Footer";
import { BottomSheet } from "./BottomSheet";

// SF Pro fonts for this screen only
const sfFonts = {
  regular: "SFProText-Regular",
  medium: "SFProText-Medium",
  semibold: "SFProText-Semibold",
  bold: "SFProText-Bold",
  displayMedium: "SFProDisplay-Medium",
  displaySemibold: "SFProDisplay-Semibold",
  displayBold: "SFProDisplay-Bold",
};

interface AppItem {
  id: string;
  name: string;
  icon: any;
}

const APP_DATA: AppItem[] = [
  {
    id: "1",
    name: "Numbers",
    icon: require("../assets/icons/app-icon-1.png"),
  },
  { id: "2", name: "Pages", icon: require("../assets/icons/app-icon-2.png") },
  {
    id: "3",
    name: "Keynote",
    icon: require("../assets/icons/app-icon-3.png"),
  },
  {
    id: "4",
    name: "TestFlight",
    icon: require("../assets/icons/app-icon-4.png"),
  },
  { id: "5", name: "Books", icon: require("../assets/icons/app-icon-5.png") },
  {
    id: "6",
    name: "Calculator",
    icon: require("../assets/icons/app-icon-6.png"),
  },
  {
    id: "7",
    name: "Calendar",
    icon: require("../assets/icons/app-icon-7.png"),
  },
  {
    id: "8",
    name: "Camera",
    icon: require("../assets/icons/app-icon-8.png"),
  },
  { id: "9", name: "Music", icon: require("../assets/icons/app-icon-9.png") },
  {
    id: "10",
    name: "Clock",
    icon: require("../assets/icons/app-icon-10.png"),
  },
  {
    id: "11",
    name: "Compass",
    icon: require("../assets/icons/app-icon-11.png"),
  },
];

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const GAP = 20;
const PADDING = 24;

function calcItemWidth(cols: number) {
  return Math.floor(
    (windowWidth - PADDING * 2 - GAP * (cols - 1)) / cols
  );
}

interface GridSortableExampleProps {
  onBack: () => void;
}

// Jiggle animation wrapper
const JigglingIcon: React.FC<{
  children: React.ReactNode;
  isEditMode: boolean;
  onDelete: () => void;
}> = ({ children, isEditMode, onDelete }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isEditMode) {
      rotation.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 100 }),
          withTiming(-2, { duration: 100 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 100 });
    }
  }, [isEditMode, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[styles.jigglingContainer, animatedStyle]}
      pointerEvents="box-none"
    >
      {children}
      {isEditMode && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          activeOpacity={0.7}
        >
          <BlurView
            intensity={90}
            tint="light"
            style={styles.deleteButtonInner}
          >
            <View style={styles.minusSign} />
          </BlurView>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const COLUMN_OPTIONS = [2, 3, 4, 5];

export function GridSortableExample({ onBack }: GridSortableExampleProps) {
  const [data, setData] = useState<AppItem[]>(APP_DATA);
  const [isEditMode, setIsEditMode] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const isEditModeShared = useSharedValue(false);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [columns, setColumns] = useState(4);
  const [itemSizeOverride, setItemSizeOverride] = useState(0); // 0 = auto
  const [useHandle, setUseHandle] = useState(false);

  // Computed dimensions
  const autoItemWidth = useMemo(() => calcItemWidth(columns), [columns]);
  const maxItemSize = autoItemWidth;
  const minItemSize = 48;
  const itemWidth = itemSizeOverride > 0 ? itemSizeOverride : autoItemWidth;
  const itemHeight = itemWidth + 24;
  const iconSize = itemWidth - 8;
  const iconRadius = Math.round(iconSize * 0.227);

  // Reset item size override when columns change
  useEffect(() => {
    setItemSizeOverride(0);
  }, [columns]);

  useEffect(() => {
    isEditModeShared.value = isEditMode;
  }, [isEditMode, isEditModeShared]);

  // Long press on empty area to enter edit mode
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      "worklet";
      if (!isEditModeShared.value) {
        isEditModeShared.value = true;
        scheduleOnRN(setIsEditMode, true);
      }
    });

  const handleBackgroundTap = useCallback(() => {
    if (isEditMode) {
      setIsEditMode(false);
    }
  }, [isEditMode]);

  const handleDeleteApp = useCallback((id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 250);
  }, []);

  const handleDrop = useCallback(
    (id: string, newPosition: number, allPositions: any) => {
      const sortedEntries = Object.entries(allPositions).sort(
        ([, a]: any, [, b]: any) => a.index - b.index
      );
      setData((prevData) => {
        const reorderedData = sortedEntries
          .map(([itemId]) => prevData.find((item) => item.id === itemId))
          .filter((item): item is AppItem => item !== undefined);
        return reorderedData;
      });
    },
    []
  );

  const renderItem = useCallback(
    (props: SortableGridRenderItemProps<AppItem>) => {
      const {
        item,
        id,
        positions,
        scrollY,
        scrollX,
        autoScrollDirection,
        itemsCount,
        dimensions,
        orientation,
        strategy,
      } = props;

      return (
        <SortableGridItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          scrollY={scrollY}
          scrollX={scrollX}
          autoScrollDirection={autoScrollDirection}
          itemsCount={itemsCount}
          dimensions={dimensions}
          orientation={orientation}
          strategy={strategy}
          containerWidth={windowWidth}
          containerHeight={windowHeight * 0.7}
          style={styles.itemContainer}
          activationDelay={isEditMode ? 150 : Number.MAX_SAFE_INTEGER}
          isBeingRemoved={removingIds.has(id)}
          onDrop={handleDrop}
        >
          {useHandle ? (
            <JigglingIcon
              isEditMode={isEditMode}
              onDelete={() => handleDeleteApp(id)}
            >
              <View style={{ alignItems: "center" }}>
                <Image
                  source={item.icon}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: iconRadius,
                  }}
                />
                {isEditMode ? (
                  <SortableGridItem.Handle style={{ marginTop: 4 }}>
                    <View style={styles.handleBar}>
                      <View style={styles.handleBarLine} />
                      <View style={styles.handleBarLine} />
                      <View style={styles.handleBarLine} />
                    </View>
                  </SortableGridItem.Handle>
                ) : (
                  <Text
                    style={[styles.appName, { marginTop: 8 }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                )}
              </View>
            </JigglingIcon>
          ) : (
            <JigglingIcon
              isEditMode={isEditMode}
              onDelete={() => handleDeleteApp(id)}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={isEditMode}
                onPress={() => {
                  if (!isEditMode) {
                    console.log(`Opening ${item.name}`);
                  }
                }}
              >
                <Image
                  source={item.icon}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: iconRadius,
                    marginBottom: 8,
                  }}
                />
                <Text style={styles.appName} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </JigglingIcon>
          )}
        </SortableGridItem>
      );
    },
    [isEditMode, handleDeleteApp, removingIds, handleDrop, useHandle, iconSize, iconRadius]
  );

  const gridDimensions = useMemo(
    () => ({
      columns,
      itemWidth,
      itemHeight,
      rowGap: GAP,
      columnGap: GAP,
    }),
    [columns, itemWidth, itemHeight]
  );

  return (
    <ImageBackground
      source={require("../assets/ios-wallpaper.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <BlurView intensity={80} tint="dark" style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>{"\u2039"}</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>iOS Home Screen</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingsIconContainer}>
              <View style={styles.settingsLines}>
                <View style={styles.settingsLine} />
                <View style={styles.settingsLine} />
                <View style={styles.settingsLine} />
              </View>
            </View>
          </TouchableOpacity>
        </BlurView>

        {/* Grid */}
        <GestureDetector gesture={longPressGesture}>
          <View style={styles.gridWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.backgroundOverlay}
              onPress={handleBackgroundTap}
              disabled={!isEditMode}
            >
              <View style={styles.gridContainer} pointerEvents="box-none">
                <SortableGrid
                  data={data}
                  renderItem={renderItem}
                  dimensions={gridDimensions}
                  orientation={GridOrientation.Vertical}
                  strategy={GridStrategy.Insert}
                  style={styles.grid}
                  contentContainerStyle={styles.gridContent}
                  scrollEnabled={false}
                />
              </View>
            </TouchableOpacity>
          </View>
        </GestureDetector>

        {/* Instruction bar above footer */}
        <BlurView intensity={60} tint="dark" style={styles.instructionBar}>
          <Text style={styles.instructionText}>
            {isEditMode
              ? "Tap empty area to exit edit mode"
              : "Long press empty area to rearrange apps"}
          </Text>
        </BlurView>

        <Footer />
      </SafeAreaView>

      {/* Settings Bottom Sheet */}
      <BottomSheet
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        title="Grid Settings"
      >
        {/* Columns */}
        <Text style={settingsStyles.sectionLabel}>Columns</Text>
        <View style={settingsStyles.chipRow}>
          {COLUMN_OPTIONS.map((col) => {
            const active = col === columns;
            return (
              <TouchableOpacity
                key={col}
                style={[
                  settingsStyles.chip,
                  active && settingsStyles.chipActive,
                ]}
                onPress={() => setColumns(col)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    settingsStyles.chipText,
                    active && settingsStyles.chipTextActive,
                  ]}
                >
                  {col}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Item Size */}
        <View style={settingsStyles.sliderSection}>
          <View style={settingsStyles.sliderLabelRow}>
            <Text style={settingsStyles.sectionLabel}>Item Size</Text>
            <Text style={settingsStyles.sliderValue}>
              {itemSizeOverride > 0
                ? `${itemSizeOverride}px`
                : `Auto (${autoItemWidth}px)`}
            </Text>
          </View>
          <Slider
            style={settingsStyles.slider}
            minimumValue={minItemSize}
            maximumValue={maxItemSize}
            value={itemSizeOverride > 0 ? itemSizeOverride : autoItemWidth}
            onValueChange={(v: number) => {
              const rounded = Math.round(v);
              if (rounded === autoItemWidth) {
                setItemSizeOverride(0);
              } else {
                setItemSizeOverride(rounded);
              }
            }}
            step={1}
            minimumTrackTintColor="#FF3B30"
            maximumTrackTintColor="#1A1C26"
            thumbTintColor="#FF3B30"
          />
          <View style={settingsStyles.sliderBounds}>
            <Text style={settingsStyles.boundText}>{minItemSize}px</Text>
            <TouchableOpacity onPress={() => setItemSizeOverride(0)}>
              <Text
                style={[
                  settingsStyles.autoResetText,
                  itemSizeOverride === 0 && settingsStyles.autoResetTextActive,
                ]}
              >
                Reset to Auto
              </Text>
            </TouchableOpacity>
            <Text style={settingsStyles.boundText}>{maxItemSize}px</Text>
          </View>
        </View>

        {/* Drag Mode */}
        <Text style={settingsStyles.sectionLabel}>Drag Mode</Text>
        <View style={settingsStyles.chipRow}>
          <TouchableOpacity
            style={[
              settingsStyles.chip,
              settingsStyles.chipWide,
              !useHandle && settingsStyles.chipActive,
            ]}
            onPress={() => setUseHandle(false)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                settingsStyles.chipText,
                !useHandle && settingsStyles.chipTextActive,
              ]}
            >
              Full Item
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              settingsStyles.chip,
              settingsStyles.chipWide,
              useHandle && settingsStyles.chipActive,
            ]}
            onPress={() => setUseHandle(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                settingsStyles.chipText,
                useHandle && settingsStyles.chipTextActive,
              ]}
            >
              Drag Handle
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={settingsStyles.infoBox}>
          <Text style={settingsStyles.infoText}>
            {useHandle
              ? "Drag the grip bar below each icon to reorder. Enter edit mode first with a long press."
              : "Long press an icon to enter edit mode, then drag anywhere on the icon to reorder."}
          </Text>
        </View>
      </BottomSheet>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 12,
    width: 80,
  },
  backIcon: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "300",
    marginRight: 6,
    lineHeight: 28,
  },
  backText: {
    fontSize: 17,
    fontFamily: fonts.bodyMedium,
    color: "#FFFFFF",
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.displayBold,
    textAlign: "center",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  settingsButton: {
    width: 80,
    alignItems: "flex-end",
  },
  settingsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsLines: {
    width: 18,
    height: 14,
    justifyContent: "space-between",
  },
  settingsLine: {
    width: 18,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFFFFF",
  },
  gridWrapper: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundOverlay: {
    flex: 1,
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  grid: {
    flex: 1,
    backgroundColor: "transparent",
  },
  gridContent: {
    padding: PADDING,
    backgroundColor: "transparent",
  },
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  jigglingContainer: {
    position: "relative",
  },
  appName: {
    fontSize: 12,
    fontFamily: sfFonts.medium,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  deleteButton: {
    position: "absolute",
    top: -10,
    left: -10,
    zIndex: 10000,
  },
  deleteButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
  },
  minusSign: {
    width: 11,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  handleBar: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 2.5,
  },
  handleBarLine: {
    width: 22,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  instructionBar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 14,
    fontFamily: fonts.bodySemiBold,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});

const settingsStyles = StyleSheet.create({
  sectionLabel: {
    fontSize: 13,
    fontFamily: sfFonts.semibold,
    color: colors.textPrimary,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  chipWide: {
    flex: 1,
  },
  chipActive: {
    borderColor: "#FF3B30",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  chipText: {
    fontSize: 14,
    fontFamily: sfFonts.medium,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#FF3B30",
  },
  sliderSection: {
    marginBottom: 24,
  },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sliderValue: {
    fontSize: 13,
    fontFamily: sfFonts.medium,
    color: "#FF3B30",
  },
  slider: {
    width: "100%",
    height: 32,
  },
  sliderBounds: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  boundText: {
    fontSize: 11,
    fontFamily: sfFonts.regular,
    color: colors.textMuted,
  },
  autoResetText: {
    fontSize: 12,
    fontFamily: sfFonts.medium,
    color: colors.textMuted,
  },
  autoResetTextActive: {
    color: "#FF3B30",
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  infoText: {
    fontSize: 13,
    fontFamily: sfFonts.regular,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
