import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Sortable,
  SortableItem,
  SortableRenderItemProps,
} from "react-native-reanimated-dnd";
import { Footer } from "@/components/Footer";
import { BottomSheet } from "@/components/BottomSheet";

interface ItineraryItem {
  id: string;
  title: string;
  details: string;
  time: string;
  type: "activity" | "dining" | "transit" | "rest" | "shopping";
  expanded: boolean;
}

interface DynamicHeightExampleProps {
  onBack: () => void;
}

const TYPE_STYLES: Record<
  ItineraryItem["type"],
  { color: string; bg: string; label: string }
> = {
  activity: {
    color: "#818CF8",
    bg: "rgba(129, 140, 248, 0.12)",
    label: "ACTIVITY",
  },
  dining: {
    color: "#FB923C",
    bg: "rgba(251, 146, 60, 0.12)",
    label: "DINING",
  },
  transit: {
    color: "#22D3EE",
    bg: "rgba(34, 211, 238, 0.12)",
    label: "TRANSIT",
  },
  rest: {
    color: "#34D399",
    bg: "rgba(52, 211, 153, 0.12)",
    label: "REST",
  },
  shopping: {
    color: "#F472B6",
    bg: "rgba(244, 114, 182, 0.12)",
    label: "SHOPPING",
  },
};

const INITIAL_ITINERARY: ItineraryItem[] = [
  {
    id: "1",
    title: "Flight to Tokyo",
    details:
      "Depart LAX 11:30 PM, arrive NRT 5:00 AM+1. Terminal 4, Gate 52B. Download boarding pass and check baggage allowance before heading to the airport.",
    time: "Day 1",
    type: "transit",
    expanded: false,
  },
  {
    id: "2",
    title: "Hotel Check-in",
    details:
      "Grand Hyatt Roppongi Hills. Check-in from 3 PM. Request a high-floor room with city view. The hotel is a 5-minute walk from Roppongi Station.",
    time: "Day 1",
    type: "rest",
    expanded: false,
  },
  {
    id: "3",
    title: "Tsukiji Fish Market",
    details:
      "Arrive early for the freshest seafood and try the tuna auction viewing. Recommended stalls include Sushi Dai and Daiwa Sushi. Bring cash as most vendors don't take cards.",
    time: "Day 2",
    type: "activity",
    expanded: false,
  },
  {
    id: "4",
    title: "Ramen at Fuunji",
    details:
      "Famous tsukemen spot near Shinjuku Station south exit. Expect a 20-minute wait during lunch hours but it's well worth it.",
    time: "Day 2",
    type: "dining",
    expanded: false,
  },
  {
    id: "5",
    title: "Meiji Shrine",
    details:
      "Historic Shinto shrine set in a lush forest in the heart of Shibuya. Allow 1-2 hours to walk through the towering torii gates and explore the inner gardens.",
    time: "Day 2",
    type: "activity",
    expanded: false,
  },
  {
    id: "6",
    title: "Shinkansen to Kyoto",
    details:
      "Nozomi bullet train from Tokyo Station. Reserved seats in Car 7. The ride takes about 2 hours and 15 minutes with views of Mt. Fuji on clear days.",
    time: "Day 3",
    type: "transit",
    expanded: false,
  },
  {
    id: "7",
    title: "Fushimi Inari Shrine",
    details:
      "Thousands of vermillion torii gates winding up the mountainside. The full hike to the summit takes 2-3 hours. Best photos at sunrise or golden hour.",
    time: "Day 3",
    type: "activity",
    expanded: false,
  },
  {
    id: "8",
    title: "Street Food Tour",
    details:
      "Meeting point at Nishiki Market entrance. The guided tour covers 8 food stops including takoyaki, matcha desserts, wagyu skewers, and sake tasting.",
    time: "Day 3",
    type: "dining",
    expanded: false,
  },
  {
    id: "9",
    title: "Bamboo Grove",
    details:
      "Walk through the towering bamboo stalks of Arashiyama. Go early in the morning to avoid crowds and get the best photos of the light filtering through.",
    time: "Day 4",
    type: "activity",
    expanded: false,
  },
  {
    id: "10",
    title: "Souvenir Shopping",
    details:
      "Browse Teramachi and Shinkyogoku shopping streets for traditional crafts, ceramics, matcha products, and handmade washi paper goods.",
    time: "Day 4",
    type: "shopping",
    expanded: false,
  },
  {
    id: "11",
    title: "Kaiseki Dinner",
    details:
      "Traditional multi-course dinner at Kikunoi, a Michelin 3-star restaurant. Dress code is smart casual. Reservation at 7 PM for two guests.",
    time: "Day 4",
    type: "dining",
    expanded: false,
  },
  {
    id: "12",
    title: "Return Flight",
    details:
      "Depart KIX at 10:00 AM, arrive LAX 7:00 AM same day. Check in online 24 hours before departure. Allow extra time for duty-free shopping.",
    time: "Day 5",
    type: "transit",
    expanded: false,
  },
];

// Creative items for adding new activities
const CREATIVE_TITLES: Record<ItineraryItem["type"], string[]> = {
  activity: [
    "Akihabara Arcade Tour",
    "Origami Workshop",
    "Tea Ceremony",
    "Samurai Museum",
    "Sumo Wrestling Match",
    "Calligraphy Class",
    "Kimono Experience",
    "Mount Fuji Viewpoint",
  ],
  dining: [
    "Izakaya Hopping",
    "Sushi Omakase",
    "Matcha Tasting",
    "Wagyu BBQ",
    "Tempura Dinner",
    "Okonomiyaki Experience",
    "Udon Noodle Shop",
    "Conveyor Belt Sushi",
  ],
  transit: [
    "Airport Limousine Bus",
    "Subway Day Pass",
    "Taxi to Ginza",
    "Rickshaw Ride",
    "Ferry to Odaiba",
    "Local Train to Kamakura",
  ],
  rest: [
    "Onsen Bath",
    "Capsule Hotel Stay",
    "Ryokan Check-in",
    "Spa Treatment",
    "Park Picnic",
    "Garden Meditation",
  ],
  shopping: [
    "Shibuya 109",
    "Don Quijote Run",
    "Vintage Kimono Hunt",
    "Tsukiji Knife Shop",
    "Harajuku Fashion Walk",
    "Depachika Food Hall",
  ],
};

const CREATIVE_DETAILS: Record<ItineraryItem["type"], string[]> = {
  activity: [
    "Explore multi-floor arcades with retro games and crane machines. Try the rhythm games on the top floor for the full experience.",
    "Learn traditional paper folding at a cozy studio near Asakusa. All materials provided, suitable for beginners.",
    "Experience a formal tea ceremony in a traditional tatami room. Wear comfortable clothes as you'll be sitting on the floor.",
    "Interactive museum with real armor replicas and sword demonstrations. Photo ops in samurai gear available.",
    "Watch a live sumo tournament at Ryogoku Kokugikan. Arrive early for the lower-division matches to get good seats.",
    "Practice Japanese calligraphy with a master instructor. Take home your artwork as a unique souvenir.",
  ],
  dining: [
    "Bar-hop through the narrow alleys of Golden Gai in Shinjuku. Each tiny bar seats only 6-8 people for an intimate experience.",
    "Chef's choice sushi at a high-end counter restaurant. Typically 12-15 courses of the freshest seasonal fish.",
    "Visit a traditional matcha house in Uji, the birthplace of Japanese green tea. Sample different grades and preparations.",
    "Premium wagyu beef grilled tableside at a Kobe-style restaurant. The marbling on A5 grade is unlike anything else.",
    "Light and crispy tempura from a counter-style restaurant in Nihonbashi. Watch the chef fry each piece to order.",
    "Cook your own savory pancake on a hot griddle. Osaka-style with cabbage, pork, and special sauce.",
  ],
  transit: [
    "Direct airport bus from Narita to major hotels. Runs every 20 minutes and takes about 90 minutes depending on traffic.",
    "Unlimited rides on Tokyo Metro and Toei lines for 24 hours. The most cost-effective way to get around the city.",
    "Premium taxi ride through the illuminated streets of Ginza. Best experienced at night when the district comes alive.",
    "Traditional pulled rickshaw through the historic streets of Asakusa. Guides share fascinating local history along the way.",
    "Scenic ferry ride across Tokyo Bay to the futuristic island of Odaiba. Great views of Rainbow Bridge at sunset.",
    "Take the Enoden line from Kamakura along the scenic coast. Stop at Enoshima island for panoramic ocean views.",
  ],
  rest: [
    "Soak in natural hot spring baths with indoor and outdoor pools. Separate facilities for men and women with towels provided.",
    "Try the unique Japanese capsule hotel experience. Modern pods with TV, charging ports, and surprisingly comfortable mattresses.",
    "Traditional Japanese inn with futon beds and sliding paper doors. Includes a multi-course kaiseki dinner and yukata robes.",
    "Relax with a traditional Japanese shiatsu massage at a luxury spa. Treatments range from 60 to 120 minutes.",
    "Unwind at Shinjuku Gyoen National Garden with a bento box lunch. Cherry blossom viewing if visiting in spring season.",
    "Find peace at a Zen garden with guided meditation by a Buddhist monk. Sessions last 45 minutes in a serene temple setting.",
  ],
  shopping: [
    "Multi-floor fashion mall in the heart of Shibuya. Trendy Japanese brands and limited-edition collaborations on every floor.",
    "Giant discount store open until late night. Everything from snacks to electronics at surprisingly low prices.",
    "Hunt for beautiful pre-owned kimono at vintage shops in Shimokitazawa. Prices range from affordable to collector-grade pieces.",
    "Browse handcrafted Japanese kitchen knives forged by master smiths. Custom engraving available for a personal touch.",
    "Walk down Takeshita Street for the latest in Japanese street fashion. Stop by the crepe stands for a sweet treat.",
    "Explore basement food halls of luxury department stores. Free samples of wagyu, pastries, and artisan chocolates.",
  ],
};

const TYPES: ItineraryItem["type"][] = [
  "activity",
  "dining",
  "transit",
  "rest",
  "shopping",
];

let nextId = 100;

function generateRandomItem(): ItineraryItem {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const titles = CREATIVE_TITLES[type];
  const details = CREATIVE_DETAILS[type];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const detail = details[Math.floor(Math.random() * details.length)];
  nextId++;
  return {
    id: `new-${nextId}`,
    title,
    details: detail,
    time: "New",
    type,
    expanded: false,
  };
}

// --- Controls Content ---

interface ControlsContentProps {
  data: ItineraryItem[];
  isDragHandleMode: boolean;
  onToggleDragMode: () => void;
  onAddNewItem: () => void;
  onAddMultipleItems: (count: number) => void;
  onRemoveLastItem: () => void;
  onResetItems: () => void;
}

function ControlsContent({
  data,
  isDragHandleMode,
  onToggleDragMode,
  onAddNewItem,
  onAddMultipleItems,
  onRemoveLastItem,
  onResetItems,
}: ControlsContentProps) {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.controlSection}>
        <Text style={styles.controlSectionTitle}>Drag Mode</Text>
        <View style={styles.controlRow}>
          <TouchableOpacity
            testID="dynamic-drag-mode-full"
            style={[
              styles.modeButton,
              !isDragHandleMode && styles.modeButtonActive,
            ]}
            onPress={onToggleDragMode}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.modeButtonText,
                !isDragHandleMode && styles.modeButtonTextActive,
              ]}
            >
              Full Item
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="dynamic-drag-mode-handle"
            style={[
              styles.modeButton,
              isDragHandleMode && styles.modeButtonActive,
            ]}
            onPress={onToggleDragMode}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.modeButtonText,
                isDragHandleMode && styles.modeButtonTextActive,
              ]}
            >
              Handle Only
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.controlDescription}>
          {isDragHandleMode
            ? "Drag items using the handle on the right"
            : "Hold and drag anywhere on the item"}
        </Text>
      </View>

      <View style={styles.controlSection}>
        <Text style={styles.controlSectionTitle}>Add Activities</Text>
        <TouchableOpacity
          testID="dynamic-add-single"
          style={styles.addButton}
          onPress={onAddNewItem}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ Add Activity</Text>
        </TouchableOpacity>

        <View style={styles.multiAddContainer}>
          <Text style={styles.multiAddLabel}>Add Multiple:</Text>
          <View style={styles.multiAddButtons}>
            {[3, 5].map((count) => (
              <TouchableOpacity
                key={count}
                testID={`dynamic-add-${count}`}
                style={styles.multiAddButton}
                onPress={() => onAddMultipleItems(count)}
                activeOpacity={0.7}
              >
                <Text style={styles.multiAddButtonText}>{count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.controlSection}>
        <Text style={styles.controlSectionTitle}>Remove</Text>
        <View style={styles.controlRow}>
          <TouchableOpacity
            testID="dynamic-remove-last"
            style={styles.removeActionButton}
            onPress={onRemoveLastItem}
            activeOpacity={0.7}
            disabled={data.length === 0}
          >
            <Text
              style={[
                styles.removeActionText,
                data.length === 0 && styles.disabledText,
              ]}
            >
              Remove Last
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="dynamic-reset"
            style={styles.resetButton}
            onPress={onResetItems}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.controlDescription}>
          Tap an expanded item's remove button to delete it
        </Text>
      </View>

      <View style={styles.controlSection}>
        <Text style={styles.controlSectionTitle}>Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text testID="dynamic-stats-total" style={styles.statNumber}>
              {data.length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text testID="dynamic-stats-added" style={styles.statNumber}>
              {data.filter((item) => item.id.startsWith("new-")).length}
            </Text>
            <Text style={styles.statLabel}>Added</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {data.filter((item) => item.expanded).length}
            </Text>
            <Text style={styles.statLabel}>Expanded</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// --- Main Component ---

export function DynamicHeightExample({ onBack }: DynamicHeightExampleProps) {
  const [itinerary, setItinerary] =
    useState<ItineraryItem[]>(INITIAL_ITINERARY);
  const [isDragHandleMode, setIsDragHandleMode] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [sortableKey, setSortableKey] = useState(0);

  const toggleExpanded = useCallback((id: string) => {
    setItinerary((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItinerary((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleToggleDragMode = useCallback(() => {
    setIsDragHandleMode((prev) => !prev);
  }, []);

  const handleAddNewItem = useCallback(() => {
    setItinerary((prev) => [generateRandomItem(), ...prev]);
  }, []);

  const handleAddMultipleItems = useCallback((count: number) => {
    const newItems: ItineraryItem[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push(generateRandomItem());
    }
    setItinerary((prev) => [...newItems, ...prev]);
  }, []);

  const handleRemoveLastItem = useCallback(() => {
    setItinerary((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  const handleResetItems = useCallback(() => {
    setItinerary(INITIAL_ITINERARY);
    setSortableKey((k) => k + 1);
  }, []);

  const handleCloseControls = useCallback(() => {
    setShowControls(false);
  }, []);

  const handleOpenControls = useCallback(() => {
    setShowControls(true);
  }, []);

  const renderItem = useCallback(
    ({ item, ...props }: SortableRenderItemProps<ItineraryItem>) => {
      const typeStyle = TYPE_STYLES[item.type];
      return (
        <SortableItem key={props.id} data={item} {...props}>
          <View
            style={[styles.cardRow, { borderLeftColor: typeStyle.color }]}
          >
            <TouchableOpacity
              testID={`dynamic-item-${item.id}`}
              style={styles.cardContent}
              onPress={() => toggleExpanded(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: typeStyle.bg },
                  ]}
                >
                  <Text
                    style={[styles.typeBadgeText, { color: typeStyle.color }]}
                  >
                    {typeStyle.label}
                  </Text>
                </View>
                <View style={styles.headerRight}>
                  <Text style={styles.dayLabel}>{item.time}</Text>
                  {item.expanded && (
                    <TouchableOpacity
                      testID={`dynamic-remove-${item.id}`}
                      onPress={() => removeItem(item.id)}
                      style={styles.removeItemButton}
                      hitSlop={8}
                    >
                      <Text style={styles.removeItemText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <Text
                testID={`dynamic-item-${item.id}-title`}
                style={styles.cardTitle}
              >
                {item.title}
              </Text>
              {item.expanded && (
                <Text
                  testID={`dynamic-item-${item.id}-description`}
                  style={styles.cardBody}
                >
                  {item.details}
                </Text>
              )}
              {!item.expanded && item.details.length > 50 && (
                <Text
                  testID={`dynamic-item-${item.id}-preview`}
                  style={styles.cardPreview}
                >
                  {item.details.substring(0, 50)}...
                </Text>
              )}
            </TouchableOpacity>
            {isDragHandleMode && (
              <SortableItem.Handle style={styles.dragHandle}>
                <View
                  testID={`dynamic-item-${item.id}-handle`}
                  style={styles.dragIconContainer}
                >
                  <View style={styles.dragColumn}>
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                  </View>
                  <View style={styles.dragColumn}>
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                    <View style={styles.dragDot} />
                  </View>
                </View>
              </SortableItem.Handle>
            )}
          </View>
        </SortableItem>
      );
    },
    [toggleExpanded, removeItem, isDragHandleMode]
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader} edges={["top"]}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              testID="header-back-button"
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>{"\u2039"}</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text testID="header-title-text" style={styles.header}>
                Dynamic Heights
              </Text>
              <Text style={styles.tipText}>
                {isDragHandleMode
                  ? "Drag the handle to reorder"
                  : "Tap to expand. Hold to reorder."}
              </Text>
            </View>

            <View style={styles.controlsButtonContainer}>
              <TouchableOpacity
                testID="dynamic-controls-button"
                style={styles.controlsButton}
                onPress={handleOpenControls}
                activeOpacity={0.7}
              >
                <View style={styles.controlsIcon}>
                  <View style={styles.controlsDot} />
                  <View style={styles.controlsDot} />
                  <View style={styles.controlsDot} />
                </View>
                <Text style={styles.controlsText}>Controls</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <Sortable
        key={sortableKey}
        data={itinerary}
        renderItem={renderItem}
        enableDynamicHeights
        estimatedItemHeight={90}
        style={styles.sortable}
      />

      <Footer />

      <BottomSheet
        isVisible={showControls}
        onClose={handleCloseControls}
        title="Itinerary Controls"
      >
        <ControlsContent
          data={itinerary}
          isDragHandleMode={isDragHandleMode}
          onToggleDragMode={handleToggleDragMode}
          onAddNewItem={handleAddNewItem}
          onAddMultipleItems={handleAddMultipleItems}
          onRemoveLastItem={handleRemoveLastItem}
          onResetItems={handleResetItems}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090E",
  },
  // Header
  safeHeader: {
    backgroundColor: "#08090E",
  },
  headerContainer: {
    backgroundColor: "#08090E",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1A1C26",
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
    fontFamily: "Syne_700Bold",
    textAlign: "center",
    color: "#F1F5F9",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  tipText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 16,
  },
  controlsButtonContainer: {
    width: 80,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  controlsButton: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#1E2028",
    borderRadius: 8,
    backgroundColor: "#12141C",
    minWidth: 70,
  },
  controlsIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    marginBottom: 4,
  },
  controlsDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#94A3B8",
  },
  controlsText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Sortable
  sortable: {
    flex: 1,
    backgroundColor: "#08090E",
  },
  // Card
  cardRow: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#08090E",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1E2028",
    borderLeftWidth: 4,
  },
  cardContent: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    paddingLeft: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: "Outfit_600SemiBold",
    letterSpacing: 0.5,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: "Outfit_500Medium",
    color: "#475569",
  },
  removeItemButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  removeItemText: {
    fontSize: 11,
    fontFamily: "Outfit_500Medium",
    color: "#EF4444",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  cardBody: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 20,
    marginTop: 4,
  },
  cardPreview: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 2,
  },
  // Drag handle
  dragHandle: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dragIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  dragColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dragDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: "#64748B",
  },
  // Controls bottom sheet
  controlsContainer: {
    paddingBottom: 20,
  },
  controlSection: {
    marginBottom: 32,
  },
  controlSectionTitle: {
    fontSize: 18,
    fontFamily: "Syne_700Bold",
    letterSpacing: -0.3,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  controlRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#1E2028",
    borderRadius: 8,
    backgroundColor: "#1A1C26",
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#818CF8",
    borderColor: "#818CF8",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  modeButtonTextActive: {
    color: "#FFFFFF",
  },
  controlDescription: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#818CF8",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  multiAddContainer: {
    marginBottom: 12,
  },
  multiAddLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  multiAddButtons: {
    flexDirection: "row",
    gap: 8,
  },
  multiAddButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#1A1C26",
    borderWidth: 1,
    borderColor: "#1E2028",
    borderRadius: 6,
    alignItems: "center",
    minWidth: 50,
  },
  multiAddButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  removeActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    alignItems: "center",
  },
  removeActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#1E2028",
    borderRadius: 8,
    backgroundColor: "#1A1C26",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  disabledText: {
    opacity: 0.4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#818CF8",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
