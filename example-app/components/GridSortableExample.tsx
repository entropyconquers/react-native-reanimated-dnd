import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  SortableGrid,
  SortableGridItem,
  SortableGridRenderItemProps,
  GridOrientation,
  GridStrategy,
} from "@/external-lib";
import { Footer } from "./Footer";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface AppItem {
  id: string;
  name: string;
  icon: any;
}

// iOS-style app data - using actual icon images
const APP_DATA: AppItem[] = [
  {
    id: "1",
    name: "Numbers",
    icon: require("../assets/icons/App Icon-1.png"),
  },
  {
    id: "2",
    name: "Pages",
    icon: require("../assets/icons/App Icon-2.png"),
  },
  {
    id: "3",
    name: "Keynote",
    icon: require("../assets/icons/App Icon-3.png"),
  },
  {
    id: "4",
    name: "TestFlight",
    icon: require("../assets/icons/App Icon-4.png"),
  },
  {
    id: "5",
    name: "Books",
    icon: require("../assets/icons/App Icon-5.png"),
  },
  {
    id: "6",
    name: "Calculator",
    icon: require("../assets/icons/App Icon-6.png"),
  },
  {
    id: "7",
    name: "Calendar",
    icon: require("../assets/icons/App Icon-7.png"),
  },
  {
    id: "8",
    name: "Camera",
    icon: require("../assets/icons/App Icon-8.png"),
  },
  {
    id: "9",
    name: "Music",
    icon: require("../assets/icons/App Icon-9.png"),
  },
  {
    id: "10",
    name: "Clock",
    icon: require("../assets/icons/App Icon-10.png"),
  },
  {
    id: "11",
    name: "Compass",
    icon: require("../assets/icons/App Icon-11.png"),
  },
];

// Grid configuration
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const COLUMNS = 4;
const ROWS = 3;
const GAP = 20;
const PADDING = 24;
const ITEM_WIDTH = (windowWidth - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
const ITEM_HEIGHT = ITEM_WIDTH + 24; // Extra height for app name

interface GridSortableExampleProps {
  onBack?: () => void;
}

// Jiggle animation component
const JigglingIcon: React.FC<{
  children: React.ReactNode;
  isEditMode: boolean;
  onDelete: () => void;
}> = ({ children, isEditMode, onDelete }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isEditMode) {
      // Start jiggle animation
      rotation.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 100 }),
          withTiming(-2, { duration: 100 })
        ),
        -1,
        true
      );
    } else {
      // Stop animation
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 100 });
    }
  }, [isEditMode, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleDeletePress = (e: any) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Animated.View style={[styles.jigglingContainer, animatedStyle]} pointerEvents="box-none">
      {children}
      {isEditMode && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePress}
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

export function GridSortableExample({ onBack }: GridSortableExampleProps = {}) {
  const [data, setData] = useState<AppItem[]>(APP_DATA);
  const [isEditMode, setIsEditMode] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const isEditModeShared = useSharedValue(false);

  // Sync shared value with state
  useEffect(() => {
    isEditModeShared.value = isEditMode;
  }, [isEditMode, isEditModeShared]);

  // Long press gesture to enter edit mode
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      "worklet";
      if (!isEditModeShared.value) {
        isEditModeShared.value = true;
        runOnJS(setIsEditMode)(true);
      }
    });

  // Handle background tap to exit edit mode
  const handleBackgroundTap = useCallback(() => {
    if (isEditMode) {
      setIsEditMode(false);
    }
  }, [isEditMode]);

  // Delete app with animation
  const handleDeleteApp = useCallback((id: string) => {
    // Mark as removing to trigger animation
    setRemovingIds((prev) => new Set(prev).add(id));

    // After animation completes, remove from data
    setTimeout(() => {
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 250); // Slightly longer than animation duration to ensure it completes
  }, []);

  // Handle drop to persist reordering
  const handleDrop = useCallback(
    (id: string, newPosition: number, allPositions: any) => {
      // Reorder data array based on new positions
      const newData = [...data];
      const sortedEntries = Object.entries(allPositions).sort(
        ([, a]: any, [, b]: any) => a.index - b.index
      );
      const reorderedData = sortedEntries
        .map(([itemId]) => newData.find((item) => item.id === itemId))
        .filter((item): item is AppItem => item !== undefined);
      setData(reorderedData);
    },
    [data]
  );

  // Render each grid item
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
        orientation: gridOrientation,
        strategy: gridStrategy,
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
          orientation={gridOrientation}
          strategy={gridStrategy}
          containerWidth={windowWidth}
          containerHeight={windowHeight * 0.7}
          style={styles.itemContainer}
          activationDelay={isEditMode ? 150 : Number.MAX_SAFE_INTEGER} // Enable drag only in edit mode with short delay
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
      <SafeAreaView style={styles.container}>
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
            {isEditMode && (
              <Text style={styles.editModeText}>Tap empty area to exit</Text>
            )}
            {!isEditMode && (
              <Text style={styles.tipText}>Long press empty area to edit</Text>
            )}
          </View>

          <View style={styles.placeholderButton} />
        </BlurView>

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
                    rows: ROWS,
                    itemWidth: ITEM_WIDTH,
                    itemHeight: ITEM_HEIGHT,
                    rowGap: GAP,
                    columnGap: GAP,
                  }}
                  orientation={GridOrientation.Vertical}
                  strategy={GridStrategy.Insert}
                  style={styles.grid}
                  contentContainerStyle={styles.gridContent}
                  // @ts-ignore - scrollEnabled prop might not be supported yet
                  scrollEnabled={false} // No scrolling
                />
              </View>
            </TouchableOpacity>
          </View>
        </GestureDetector>

        <Footer blur />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#1C1C1E",
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
    paddingBottom: 16,
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
    color: "#FFFFFF",
    fontWeight: "400",
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
  editModeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
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
    fontWeight: "500",
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
});
