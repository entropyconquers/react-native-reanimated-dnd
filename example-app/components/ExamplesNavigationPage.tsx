import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Footer } from "./Footer";
import { colors, fonts, categoryColors } from "../theme";

// ─── Data ────────────────────────────────────────────────────

interface Example {
  id: string;
  title: string;
  description: string;
  component: string;
  icon: string;
}

interface Category {
  key: keyof typeof categoryColors;
  name: string;
  examples: Example[];
}

// U+FE0E forces text presentation (prevents emoji rendering on iOS)
const TEXT = "\uFE0E";

const categories: Category[] = [
  {
    key: "sortable",
    name: "Sortable",
    examples: [
      {
        id: "sortable",
        title: "Music Queue",
        description: "Reorderable vertical list with drag handles",
        component: "SortableExample",
        icon: `♫${TEXT}`,
      },
      {
        id: "horizontalSortable",
        title: "Horizontal Tags",
        description: "Reorderable horizontal scrolling list",
        component: "HorizontalSortableExample",
        icon: `⇌${TEXT}`,
      },
      {
        id: "gridSortable",
        title: "Grid Sortable",
        description: "Reorderable 2D grid with insert/swap",
        component: "GridSortableExample",
        icon: `⊞${TEXT}`,
      },
      {
        id: "dynamicHeight",
        title: "Dynamic Heights",
        description: "Sortable list with variable item heights",
        component: "DynamicHeightExample",
        icon: `↕${TEXT}`,
      },
    ],
  },
  {
    key: "gettingStarted",
    name: "Getting Started",
    examples: [
      {
        id: "basicDragDrop",
        title: "Basic Drag & Drop",
        description: "Drag items to multiple drop zones",
        component: "BasicDragDropExample",
        icon: `◎${TEXT}`,
      },
      {
        id: "dragHandles",
        title: "Drag Handles",
        description: "Dedicated regions for drag control",
        component: "DragHandlesExample",
        icon: `⋮⋮`,
      },
    ],
  },
  {
    key: "motionStyle",
    name: "Motion & Style",
    examples: [
      {
        id: "animation",
        title: "Custom Animations",
        description: "Spring, timing, bounce & easing",
        component: "AnimationExample",
        icon: `◆${TEXT}`,
      },
      {
        id: "activeStyles",
        title: "Active Drop Styles",
        description: "Visual effects on hover",
        component: "ActiveStylesExample",
        icon: `◈${TEXT}`,
      },
      {
        id: "alignment",
        title: "Alignment & Offset",
        description: "Precise drop positioning",
        component: "AlignmentOffsetExample",
        icon: `⬡${TEXT}`,
      },
    ],
  },
  {
    key: "constraints",
    name: "Constraints",
    examples: [
      {
        id: "bounded",
        title: "Bounded Dragging",
        description: "Constrain within boundaries",
        component: "BoundedDraggingExample",
        icon: `▣${TEXT}`,
      },
      {
        id: "xAxis",
        title: "X-Axis Lock",
        description: "Horizontal-only movement",
        component: "XAxisConstrainedExample",
        icon: `⟷${TEXT}`,
      },
      {
        id: "yAxis",
        title: "Y-Axis Lock",
        description: "Vertical-only movement",
        component: "YAxisConstrainedExample",
        icon: `↕${TEXT}`,
      },
      {
        id: "boundedYAxis",
        title: "Bounded Y-Axis",
        description: "Vertical within bounds",
        component: "BoundedYAxisExample",
        icon: `⊞${TEXT}`,
      },
    ],
  },
  {
    key: "dropZones",
    name: "Drop Zones",
    examples: [
      {
        id: "capacity",
        title: "Capacity Limits",
        description: "Zones with item capacity limits",
        component: "CapacityExample",
        icon: `▦${TEXT}`,
      },
      {
        id: "droppedItems",
        title: "Dropped Items Map",
        description: "Track items across zones",
        component: "DroppedItemsMapExample",
        icon: `◉${TEXT}`,
      },
      {
        id: "collision",
        title: "Collision Detection",
        description: "Center, intersect & contain",
        component: "CollisionDetectionExample",
        icon: `⊕${TEXT}`,
      },
    ],
  },
  {
    key: "advanced",
    name: "Advanced",
    examples: [
      {
        id: "dragState",
        title: "Drag State",
        description: "State enum & onStateChange",
        component: "DragStateExample",
        icon: `⚡${TEXT}`,
      },
      {
        id: "customDraggable",
        title: "Custom Draggable",
        description: "useDraggable hook implementation",
        component: "CustomDraggableExample",
        icon: `⚙${TEXT}`,
      },
    ],
  },
];

// ─── Components ──────────────────────────────────────────────

interface ExamplesNavigationPageProps {
  onNavigateToExample: (component: string) => void;
}

export function ExamplesNavigationPage({
  onNavigateToExample,
}: ExamplesNavigationPageProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>reanimated </Text>
            <View style={styles.dndGroup}>
              <Text style={styles.heroTitle}>DND</Text>
              <View style={styles.redAccent} />
            </View>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v2</Text>
            </View>
          </View>
          <Text style={styles.heroSubtitle}>
            Drag & drop toolkit for React Native
          </Text>
        </View>

        {/* Sections */}
        {categories.map((category) => {
          const cat = categoryColors[category.key];
          return (
            <View key={category.key} style={styles.section}>
              <Text style={styles.sectionLabel}>{category.name}</Text>
              <View style={styles.groupCard}>
                {category.examples.map((example, idx) => (
                  <React.Fragment key={example.id}>
                    {idx > 0 && <View style={styles.separator} />}
                    <TouchableOpacity
                      testID={`nav-${example.id}-button`}
                      style={styles.row}
                      onPress={() => onNavigateToExample(example.component)}
                      activeOpacity={0.6}
                    >
                      <View
                        style={[styles.iconBadge, { backgroundColor: cat.bg }]}
                      >
                        <Text style={[styles.iconText, { color: cat.color }]}>
                          {example.icon}
                        </Text>
                      </View>
                      <View style={styles.rowText}>
                        <Text style={styles.rowTitle}>{example.title}</Text>
                        <Text style={styles.rowDescription} numberOfLines={1}>
                          {example.description}
                        </Text>
                      </View>
                      <Text style={styles.chevron}>{">"}</Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  // Hero
  hero: {
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 2,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dndGroup: {
    alignItems: "center",
  },
  versionBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: "MajorMonoDisplay_400Regular",
    color: colors.textPrimary,
    lineHeight: 30,
  },
  redAccent: {
    alignSelf: "stretch",
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
    marginTop: 2,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: fonts.bodyRegular,
    color: colors.textMuted,
    marginTop: 8,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 4,
  },

  // Group card
  groupCard: {
    backgroundColor: "#171921",
    borderRadius: 12,
    overflow: "hidden",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#1E2030",
    marginLeft: 58,
  },

  // Icon
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
  },

  // Text
  rowText: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontFamily: fonts.bodySemiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 13,
    fontFamily: fonts.bodyRegular,
    color: colors.textMuted,
    lineHeight: 17,
  },

  // Chevron
  chevron: {
    fontSize: 16,
    color: colors.textDim,
    fontFamily: fonts.bodyRegular,
  },

  bottomSpacer: {
    height: 4,
  },
});
