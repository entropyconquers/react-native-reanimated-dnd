import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Sortable } from "../components/Sortable";
import { SortableItem } from "../components/SortableItem";
import { SortableRenderItemProps, SortableDirection } from "../types/sortable";
import { ExampleHeader } from "./ExampleHeader";
import { Footer } from "./Footer";

interface TagItem {
  id: string;
  label: string;
  color: string;
  category: string;
  count: number;
  image?: string;
}

const MOCK_TAGS: TagItem[] = [
  {
    id: "1",
    label: "React",
    color: "#61DAFB",
    category: "Library",
    count: 1250,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png",
  },
  {
    id: "2",
    label: "TypeScript",
    color: "#3178C6",
    category: "Language",
    count: 980,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
  },
  {
    id: "3",
    label: "JavaScript",
    color: "#F7DF1E",
    category: "Language",
    count: 2100,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/640px-JavaScript-logo.png",
  },
  {
    id: "4",
    label: "React Native",
    color: "#0FA5E9",
    category: "Framework",
    count: 750,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png",
  },
  {
    id: "5",
    label: "Node.js",
    color: "#68A063",
    category: "Runtime",
    count: 1400,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png",
  },
  {
    id: "6",
    label: "Vue",
    color: "#4FC08D",
    category: "Framework",
    count: 650,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png",
  },
  {
    id: "7",
    label: "Angular",
    color: "#DD0031",
    category: "Framework",
    count: 580,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png",
  },
  {
    id: "8",
    label: "Python",
    color: "#3776AB",
    category: "Language",
    count: 1800,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
  },
  {
    id: "9",
    label: "Swift",
    color: "#FA7343",
    category: "Language",
    count: 420,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Swift_logo.svg/1200px-Swift_logo.svg.png",
  },
  {
    id: "10",
    label: "Kotlin",
    color: "#7F52FF",
    category: "Language",
    count: 380,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kotlin_Icon.svg/1200px-Kotlin_Icon.svg.png",
  },
  {
    id: "11",
    label: "Flutter",
    color: "#02569B",
    category: "Framework",
    count: 320,
    image:
      "https://storage.googleapis.com/cms-storage-bucket/c823e53b3a1a7b0d36a9.png",
  },
  {
    id: "12",
    label: "Go",
    color: "#00ADD8",
    category: "Language",
    count: 290,
    image: "https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_Blue.png",
  },
  {
    id: "13",
    label: "Rust",
    color: "#b7410e",
    category: "Language",
    count: 150,
    image: "https://prev.rust-lang.org/logos/rust-logo-512x512.png",
  },
  {
    id: "14",
    label: "Docker",
    color: "#2496ED",
    category: "Tool",
    count: 890,
    image:
      "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png",
  },
  {
    id: "15",
    label: "GraphQL",
    color: "#E10098",
    category: "Query Language",
    count: 340,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/1200px-GraphQL_Logo.svg.png",
  },
];

// Item width for horizontal sortable list
const ITEM_WIDTH = 120;
const ITEM_GAP = 12;
const PADDING_HORIZONTAL = 12;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface HorizontalSortableExampleProps {
  onBack: () => void;
}

export function HorizontalSortableExample({
  onBack,
}: HorizontalSortableExampleProps) {
  const [isDragHandleMode, setIsDragHandleMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWebModal, setShowWebModal] = useState(Platform.OS === "web");

  // this is just to defer loading a large list during navigation
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Render each horizontal sortable item
  const renderItem = useCallback(
    (props: SortableRenderItemProps<TagItem>) => {
      const {
        item,
        id,
        positions,
        leftBound,
        autoScrollHorizontalDirection,
        itemsCount,
        itemWidth,
        gap,
        paddingHorizontal,
      } = props;

      return (
        <SortableItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          direction={SortableDirection.Horizontal}
          leftBound={leftBound}
          autoScrollHorizontalDirection={autoScrollHorizontalDirection}
          itemsCount={itemsCount}
          itemWidth={itemWidth}
          gap={gap}
          paddingHorizontal={paddingHorizontal}
          containerWidth={windowWidth}
          style={styles.itemContainer}
          onMove={(currentId, from, to) => {
            console.log(`Tag ${currentId} moved from ${from} to ${to}`);
          }}
          onDragStart={(currentId, position) => {
            console.log(`Tag ${currentId} dragged from ${position}`);
          }}
          onDrop={(currentId, position) => {
            console.log(`Tag ${currentId} dropped at ${position}`);
          }}
          onDraggingHorizontal={(currentId, overItemId, xPosition) => {
            if (overItemId) {
              console.log(
                `Tag ${currentId} is over ${overItemId} at X: ${xPosition}`
              );
            }
          }}
        >
          <View
            style={[
              styles.tagItem,
              {
                borderColor: item.color,
                borderWidth: 2,
                backgroundColor: "rgb(11, 11, 11)28)",
              },
            ]}
          >
            <View
              style={[
                styles.logoContainer,
                { borderRadius: 10, height: 32, width: 32, borderWidth: 2 },

                isDragHandleMode && {
                  borderColor: item.color,
                  shadowColor: item.color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                },
              ]}
            >
              {isDragHandleMode ? (
                <SortableItem.Handle>
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  )}
                </SortableItem.Handle>
              ) : (
                <View style={styles.logoContainer}>
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}
            </View>

            <View style={{ marginTop: 4 }}>
              <Text style={[styles.tagLabel, { color: item.color }]}>
                {item.label}
              </Text>
              <Text style={[styles.tagCategory]}>{item.category}</Text>
            </View>
            <Text style={[styles.tagCount]}>{item.count}+ downloads</Text>
          </View>
        </SortableItem>
      );
    },
    [isDragHandleMode]
  );

  const isWeb = Platform.OS === "web";

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ExampleHeader title="Horizontal Sortable" onBack={onBack} />

        <ScrollView style={styles.scrollView} scrollEventThrottle={16}>
          <View style={styles.section}>
            <Text style={styles.sectionDescription}>
              This example demonstrates horizontal drag-and-drop sorting with
              technology tags. You can switch between full-item dragging and
              handle-only dragging modes. Try reordering the tags by dragging
              them horizontally.
            </Text>

            <View style={styles.controlsContainer}>
              <View style={styles.toggleButtonContainer}>
                {!isLoading && (
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setIsDragHandleMode(!isDragHandleMode)}
                  >
                    <Text style={styles.toggleText}>
                      {isDragHandleMode ? "Handle Mode" : "Full Item Mode"}
                    </Text>
                    <View
                      style={[
                        styles.toggleIndicator,
                        {
                          backgroundColor: isDragHandleMode
                            ? "#FF3B30"
                            : "#8E8E93",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF3B30" />
              </View>
            ) : (
              <View style={styles.contentContainer}>
                <View style={styles.statsContainer}>
                  <Text style={styles.statsText}>
                    {MOCK_TAGS.length} Technology Tags
                  </Text>
                  <Text style={styles.statsSubtext}>
                    {isDragHandleMode
                      ? "Drag the logo handle to reorder horizontally"
                      : "Hold and drag tags to reorder horizontally"}
                  </Text>
                </View>

                <View style={styles.listContainer}>
                  <Sortable
                    data={MOCK_TAGS}
                    renderItem={renderItem}
                    direction={SortableDirection.Horizontal}
                    itemWidth={ITEM_WIDTH}
                    gap={ITEM_GAP}
                    paddingHorizontal={PADDING_HORIZONTAL}
                    style={styles.list}
                  />
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
                      Handle Mode: Only the logo area is draggable for precise
                      control
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <View
                      style={[
                        styles.infoIndicator,
                        { backgroundColor: "#8E8E93" },
                      ]}
                    />
                    <Text style={styles.infoText}>
                      Full Item Mode: The entire tag card is draggable
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <Footer />

        {/* Web Platform Modal */}
        <Modal
          visible={showWebModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowWebModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Web Platform Notice</Text>
              <Text style={styles.modalMessage}>
                This horizontal sortable example doesn't work on web due to
                platform limitations with React Native Reanimated and Gesture
                Handler.
              </Text>
              <Text style={styles.modalSubMessage}>
                Please try this example on iOS or Android.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowWebModal(false)}
                >
                  <Text style={styles.modalButtonText}>Continue Anyway</Text>
                </TouchableOpacity>
                {onBack && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={onBack}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        styles.modalButtonTextPrimary,
                      ]}
                    >
                      Go Back
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
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
  controlsContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerContainer: {
    backgroundColor: "#000000",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C2C2E",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: 50,
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
    color: "#FF3B30",
    fontWeight: "300",
    marginRight: 6,
    lineHeight: 28,
  },
  backText: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "400",
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 16,
  },
  toggleButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
    minWidth: 140,
    justifyContent: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  toggleIndicator: {
    width: 12,
    height: 2.5,
    borderRadius: 1.25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  contentContainer: {
    flexDirection: "column",
    backgroundColor: "#000000",
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 28,
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statsSubtext: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
    textAlign: "center",
  },
  listContainer: {
    height: 200,
    paddingVertical: 20,

    borderRadius: 12,
    backgroundColor: "#1C1C1E",
    marginBottom: 24,
  },
  list: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tagItem: {
    width: ITEM_WIDTH,
    height: 160,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  tagCategory: {
    fontSize: 10,
    fontWeight: "500",
    color: "#FFFFFF",
    opacity: 0.6,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: -2,
  },
  tagCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 6,
  },
  dragHandle: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  handleIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  handleDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
  },
  infoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    marginBottom: 16,
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
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  popularDot: {
    backgroundColor: "#FFD700",
  },
  normalDot: {
    backgroundColor: "#8E8E93",
  },
  legendText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  modalSubMessage: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 12,
    color: "#FF3B30",
  },
  modalButtonPrimary: {
    backgroundColor: "#FF3B30",
  },
  modalButtonTextPrimary: {
    color: "#FFFFFF",
  },
  logoContainer: {
    width: 24,
    height: 24,
    borderRadius: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  logoImage: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#222",
  },
});
