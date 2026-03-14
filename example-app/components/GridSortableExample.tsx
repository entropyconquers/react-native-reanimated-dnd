import React, { useCallback, useEffect, useState } from "react";
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
import { colors, fonts } from "../theme";
import { Footer } from "./Footer";

interface AppItem {
  id: string;
  name: string;
  icon: any;
}

const APP_DATA: AppItem[] = [
  { id: "1", name: "Numbers", icon: require("../assets/icons/app-icon-1.png") },
  { id: "2", name: "Pages", icon: require("../assets/icons/app-icon-2.png") },
  { id: "3", name: "Keynote", icon: require("../assets/icons/app-icon-3.png") },
  { id: "4", name: "TestFlight", icon: require("../assets/icons/app-icon-4.png") },
  { id: "5", name: "Books", icon: require("../assets/icons/app-icon-5.png") },
  { id: "6", name: "Calculator", icon: require("../assets/icons/app-icon-6.png") },
  { id: "7", name: "Calendar", icon: require("../assets/icons/app-icon-7.png") },
  { id: "8", name: "Camera", icon: require("../assets/icons/app-icon-8.png") },
  { id: "9", name: "Music", icon: require("../assets/icons/app-icon-9.png") },
  { id: "10", name: "Clock", icon: require("../assets/icons/app-icon-10.png") },
  { id: "11", name: "Compass", icon: require("../assets/icons/app-icon-11.png") },
];

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const COLUMNS = 4;
const GAP = 20;
const PADDING = 24;
const ITEM_WIDTH =
  (windowWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
const ITEM_HEIGHT = ITEM_WIDTH + 24;

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

export function GridSortableExample({ onBack }: GridSortableExampleProps) {
  const [data, setData] = useState<AppItem[]>(APP_DATA);
  const [isEditMode, setIsEditMode] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const isEditModeShared = useSharedValue(false);

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
      const reorderedData = sortedEntries
        .map(([itemId]) => data.find((item) => item.id === itemId))
        .filter((item): item is AppItem => item !== undefined);
      setData(reorderedData);
    },
    [data]
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
              <Image source={item.icon} style={styles.appIcon} />
              <Text style={styles.appName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          </JigglingIcon>
        </SortableGridItem>
      );
    },
    [isEditMode, handleDeleteApp, removingIds, handleDrop]
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
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.header}>iOS Home Screen</Text>
          </View>

          <View style={styles.placeholderButton} />
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
                  dimensions={{
                    columns: COLUMNS,
                    itemWidth: ITEM_WIDTH,
                    itemHeight: ITEM_HEIGHT,
                    rowGap: GAP,
                    columnGap: GAP,
                  }}
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
              ? "✓  Tap empty area to exit edit mode"
              : "☰  Long press empty area to rearrange apps"}
          </Text>
        </BlurView>

        <Footer />
      </SafeAreaView>
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
  header: {
    fontSize: 18,
    fontFamily: fonts.displayBold,
    textAlign: "center",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  placeholderButton: {
    width: 80,
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
  appIcon: {
    width: ITEM_WIDTH - 8,
    height: ITEM_WIDTH - 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  appName: {
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
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
