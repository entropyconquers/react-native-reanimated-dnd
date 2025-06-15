import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  MajorMonoDisplay_400Regular,
} from "@expo-google-fonts/major-mono-display";
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
} from "@expo-google-fonts/kumbh-sans";
import { Footer } from "./Footer";

interface Example {
  id: string;
  title: string;
  description: string;
  component: string;
  icon: string;
}

const examples: Example[] = [
  {
    id: "sortable",
    title: "Sortable Music Queue",
    description: "Reorderable Vertical list with drag handles.",
    component: "SortableExample",
    icon: "♫",
  },
  {
    id: "horizontalSortable",
    title: "Horizontal Sortable",
    description: "Reorderable Horizontal list with drag handles.",
    component: "HorizontalSortableExample",
    icon: "↔️",
  },
  {
    id: "basicDragDrop",
    title: "Basic Drag & Drop",
    description: "Simple drag and drop with multiple zones",
    component: "BasicDragDropExample",
    icon: "👆",
  },
  {
    id: "dragHandles",
    title: "Drag Handles",
    description: "Precise dragging control with dedicated handles",
    component: "DragHandlesExample",
    icon: "🔧",
  },
  {
    id: "alignment",
    title: "Alignment & Offset",
    description: "Control drop positioning with alignment and offset options",
    component: "AlignmentOffsetExample",
    icon: "📐",
  },
  {
    id: "animation",
    title: "Custom Animations",
    description: "Various animation types, durations, and easing functions",
    component: "AnimationExample",
    icon: "🎬",
  },
  {
    id: "activeStyles",
    title: "Active Drop Styles",
    description: "Custom visual effects when hovering over drop zones",
    component: "ActiveStylesExample",
    icon: "✨",
  },
  {
    id: "collision",
    title: "Collision Detection",
    description: "Different algorithms: center, intersect, and contain",
    component: "CollisionDetectionExample",
    icon: "🎯",
  },
  {
    id: "capacity",
    title: "Drop Zone Capacity",
    description: "Zones with different item capacity limits",
    component: "CapacityExample",
    icon: "🗂️",
  },
  {
    id: "bounded",
    title: "Bounded Dragging",
    description: "Constrain dragging within specific boundaries",
    component: "BoundedDraggingExample",
    icon: "📦",
  },
  {
    id: "xAxis",
    title: "X-Axis Constraints",
    description: "Horizontal-only dragging movement",
    component: "XAxisConstrainedExample",
    icon: "↔️",
  },
  {
    id: "yAxis",
    title: "Y-Axis Constraints",
    description: "Vertical-only dragging movement",
    component: "YAxisConstrainedExample",
    icon: "↕️",
  },
  {
    id: "boundedYAxis",
    title: "Bounded Y-Axis",
    description: "Vertical dragging within boundaries",
    component: "BoundedYAxisExample",
    icon: "📏",
  },
  {
    id: "dragState",
    title: "Drag State Management",
    description: "Demonstrates DraggableState enum and onStateChange callback",
    component: "DragStateExample",
    icon: "⚡",
  },
  {
    id: "droppedItems",
    title: "Dropped Items Map",
    description:
      "Track which draggables are currently dropped on which droppables",
    component: "DroppedItemsMapExample",
    icon: "📍",
  },
  {
    id: "customDraggable",
    title: "Custom Draggable",
    description: "Custom implementation with handle support",
    component: "CustomDraggableExample",
    icon: "⚙️",
  },
];

interface ExamplesNavigationPageProps {
  onNavigateToExample: (component: string) => void;
}

export function ExamplesNavigationPage({
  onNavigateToExample,
}: ExamplesNavigationPageProps) {
  let [fontsLoaded] = useFonts({
    MajorMonoDisplay_400Regular,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>React native reanimated DND</Text>
        <View style={styles.redAccent} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {examples.map((example) => (
          <TouchableOpacity
            key={example.id}
            style={styles.exampleItem}
            onPress={() => onNavigateToExample(example.component)}
            activeOpacity={0.7}
          >
            <View style={styles.exampleContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{example.icon}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.exampleTitle}>{example.title}</Text>
                <Text style={styles.exampleDescription}>
                  {example.description}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  headerContainer: {
    backgroundColor: "#000000",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C2C2E",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  header: {
    fontSize: 20,
    fontFamily: "MajorMonoDisplay_400Regular",
    textAlign: "left",
    color: "#FFFFFF",
    marginBottom: 4,
    lineHeight: 30,
  },
  redAccent: {
    width: 46,
    height: 3,
    backgroundColor: "#FF3B30",
    borderRadius: 1.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  exampleItem: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  exampleContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  exampleTitle: {
    fontSize: 17,
    fontFamily: "KumbhSans_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  exampleDescription: {
    fontSize: 15,
    fontFamily: "KumbhSans_400Regular",
    color: "#8E8E93",
    lineHeight: 20,
  },
  chevron: {
    fontSize: 20,
    fontFamily: "KumbhSans_400Regular",
    color: "#8E8E93",
    fontWeight: "300",
  },
});
