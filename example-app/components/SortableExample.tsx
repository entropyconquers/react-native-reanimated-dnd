import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";
import { Sortable } from "../components/Sortable";
import { SortableItem } from "../components/SortableItem";
import { SortableRenderItemProps } from "@/types";
import { Footer } from "./Footer";
import { BottomSheet } from "./BottomSheet";

interface Item {
  id: string;
  name: string;
  cover_image_url: string;
  artist: string;
  duration: string;
}

const MUSIC_DATA_RAW = [
  {
    id: 1,
    name: "Thinking Out Loud",
    cover_image_url: "https://picsum.photos/id/11/200/200",
    artist: "Ed Sheeran",
    duration: "5:09",
  },
  {
    id: 2,
    name: "Let Her Go",
    cover_image_url: "https://picsum.photos/id/12/200/200",
    artist: "Passenger",
    duration: "5:29",
  },
  {
    id: 3,
    name: "Counting Stars",
    cover_image_url: "https://picsum.photos/id/13/200/200",
    artist: "OneRepublic",
    duration: "4:04",
  },
  {
    id: 4,
    name: "Cheap Thrills",
    cover_image_url: "https://picsum.photos/id/14/200/200",
    artist: "Sia",
    duration: "2:19",
  },
  {
    id: 5,
    name: "Faded",
    cover_image_url: "https://picsum.photos/id/15/200/200",
    artist: "Alan Walker",
    duration: "5:56",
  },
  {
    id: 6,
    name: "Senorita",
    cover_image_url: "https://picsum.photos/id/16/200/200",
    artist: "Shawn Mendes & Camila Cabello",
    duration: "2:01",
  },
  {
    id: 7,
    name: "Old Town Road",
    cover_image_url: "https://picsum.photos/id/17/200/200",
    artist: "Lil Nas X",
    duration: "3:47",
  },
  {
    id: 8,
    name: "Sunflower",
    cover_image_url: "https://picsum.photos/id/18/200/200",
    artist: "Post Malone & Swae Lee",
    duration: "4:33",
  },
  {
    id: 9,
    name: "All of Me",
    cover_image_url: "https://picsum.photos/id/19/200/200",
    artist: "John Legend",
    duration: "3:12",
  },
  {
    id: 10,
    name: "Bad Guy",
    cover_image_url: "https://picsum.photos/id/20/200/200",
    artist: "Billie Eilish",
    duration: "2:45",
  },
  {
    id: 11,
    name: "Waka Waka",
    cover_image_url: "https://picsum.photos/id/21/200/200",
    artist: "Shakira",
    duration: "4:11",
  },
  {
    id: 12,
    name: "Counting Stars",
    cover_image_url: "https://picsum.photos/id/22/200/200",
    artist: "OneRepublic",
    duration: "3:56",
  },
  {
    id: 13,
    name: "Perfect",
    cover_image_url: "https://picsum.photos/id/23/200/200",
    artist: "Ed Sheeran",
    duration: "2:34",
  },
  {
    id: 14,
    name: "Rockstar",
    cover_image_url: "https://picsum.photos/id/24/200/200",
    artist: "Post Malone ft. 21 Savage",
    duration: "4:52",
  },
  {
    id: 15,
    name: "Blinding Lights",
    cover_image_url: "https://picsum.photos/id/25/200/200",
    artist: "The Weeknd",
    duration: "3:18",
  },
  {
    id: 16,
    name: "Happy",
    cover_image_url: "https://picsum.photos/id/26/200/200",
    artist: "Pharrell Williams",
    duration: "5:23",
  },
  {
    id: 17,
    name: "Memories",
    cover_image_url: "https://picsum.photos/id/27/200/200",
    artist: "Maroon 5",
    duration: "2:47",
  },
  {
    id: 18,
    name: "Shape of You",
    cover_image_url: "https://picsum.photos/id/28/200/200",
    artist: "Ed Sheeran",
    duration: "4:09",
  },
  {
    id: 19,
    name: "Uptown Funk",
    cover_image_url: "https://picsum.photos/id/29/200/200",
    artist: "Mark Ronson ft. Bruno Mars",
    duration: "3:55",
  },
  {
    id: 20,
    name: "Dance Monkey",
    cover_image_url: "https://picsum.photos/id/30/200/200",
    artist: "Tones and I",
    duration: "2:22",
  },
  {
    id: 21,
    name: "Roar",
    cover_image_url: "https://picsum.photos/id/31/200/200",
    artist: "Katy Perry",
    duration: "4:44",
  },
  {
    id: 22,
    name: "Girls Like You",
    cover_image_url: "https://picsum.photos/id/32/200/200",
    artist: "Maroon 5 ft. Cardi B",
    duration: "3:27",
  },
  {
    id: 23,
    name: "Rolling in the Deep",
    cover_image_url: "https://picsum.photos/id/33/200/200",
    artist: "Adele",
    duration: "5:31",
  },
  {
    id: 24,
    name: "Havana",
    cover_image_url: "https://picsum.photos/id/34/200/200",
    artist: "Camila Cabello",
    duration: "2:53",
  },
  {
    id: 25,
    name: "Despacito",
    cover_image_url: "https://picsum.photos/id/35/200/200",
    artist: "Luis Fonsi & Daddy Yankee",
    duration: "4:17",
  },
  {
    id: 26,
    name: "Grenade",
    cover_image_url: "https://picsum.photos/id/36/200/200",
    artist: "Bruno Mars",
    duration: "3:08",
  },
  {
    id: 27,
    name: "Shallow",
    cover_image_url: "https://picsum.photos/id/37/200/200",
    artist: "Lady Gaga & Bradley Cooper",
    duration: "5:02",
  },
  {
    id: 28,
    name: "Someone Like You",
    cover_image_url: "https://picsum.photos/id/38/200/200",
    artist: "Adele",
    duration: "2:39",
  },
  {
    id: 29,
    name: "Believer",
    cover_image_url: "https://picsum.photos/id/39/200/200",
    artist: "Imagine Dragons",
    duration: "4:21",
  },
  {
    id: 30,
    name: "Love Yourself",
    cover_image_url: "https://picsum.photos/id/40/200/200",
    artist: "Justin Bieber",
    duration: "3:14",
  },
];

// Creative song names and artists for new items
const CREATIVE_SONGS = [
  "Midnight Dreams",
  "Electric Pulse",
  "Neon Nights",
  "Digital Love",
  "Cosmic Journey",
  "Urban Symphony",
  "Velvet Thunder",
  "Crystal Waves",
  "Phoenix Rising",
  "Stellar Drift",
  "Quantum Leap",
  "Mystic Echoes",
  "Infinite Loop",
  "Solar Flare",
  "Ocean Depths",
  "Mountain High",
  "Desert Wind",
  "Forest Whispers",
  "City Lights",
  "Starlight Serenade",
];

const CREATIVE_ARTISTS = [
  "Luna Eclipse",
  "Neon Pulse",
  "Digital Dreams",
  "Cosmic Riders",
  "Urban Legends",
  "Velvet Storm",
  "Crystal Vision",
  "Phoenix Fire",
  "Stellar Winds",
  "Quantum Beat",
  "Mystic Souls",
  "Infinite Sound",
  "Solar System",
  "Ocean Waves",
  "Mountain Echo",
  "Desert Storm",
  "Forest Moon",
  "City Nights",
  "Star Gazers",
  "Midnight Express",
];

const INITIAL_MOCK_DATA: Item[] = MUSIC_DATA_RAW.map((item) => ({
  ...item,
  id: String(item.id),
}));

// Item height for sortable list
const ITEM_HEIGHT = 70;
const windowHeight = Dimensions.get("window").height;

// Generate random duration
const generateRandomDuration = (): string => {
  const minutes = Math.floor(Math.random() * 4) + 2; // 2-5 minutes
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Generate random image URL
const generateRandomImageUrl = (): string => {
  const randomId = Math.floor(Math.random() * 100) + 100;
  return `https://picsum.photos/id/${randomId}/200/200`;
};

interface SortableExampleProps {
  onBack?: () => void;
}

export function SortableExample({ onBack }: SortableExampleProps = {}) {
  const [isDragHandleMode, setIsDragHandleMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showWebModal, setShowWebModal] = useState(Platform.OS === "web");
  const [showControls, setShowControls] = useState(false);
  const [data, setData] = useState<Item[]>(INITIAL_MOCK_DATA);

  // this is just to defer loading a large list during navigation
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsDragHandleMode(false);
    }, 500);
  }, []);

  // Memoized callbacks for controls
  const handleToggleDragMode = useCallback(() => {
    setIsDragHandleMode((prev) => !prev);
  }, []);

  const handleAddNewItem = useCallback(() => {
    const randomSong =
      CREATIVE_SONGS[Math.floor(Math.random() * CREATIVE_SONGS.length)];
    const randomArtist =
      CREATIVE_ARTISTS[Math.floor(Math.random() * CREATIVE_ARTISTS.length)];
    const newId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newItem: Item = {
      id: newId,
      name: randomSong,
      artist: randomArtist,
      cover_image_url: generateRandomImageUrl(),
      duration: generateRandomDuration(),
    };

    setData((prevData) => [newItem, ...prevData]);
  }, []);

  const handleAddMultipleItems = useCallback((count: number) => {
    const newItems: Item[] = [];
    const usedSongs = new Set<string>();
    const usedArtists = new Set<string>();

    for (let i = 0; i < count; i++) {
      let randomSong: string;
      let randomArtist: string;

      // Ensure unique combinations
      do {
        randomSong =
          CREATIVE_SONGS[Math.floor(Math.random() * CREATIVE_SONGS.length)];
        randomArtist =
          CREATIVE_ARTISTS[Math.floor(Math.random() * CREATIVE_ARTISTS.length)];
      } while (usedSongs.has(randomSong) && usedArtists.has(randomArtist));

      usedSongs.add(randomSong);
      usedArtists.add(randomArtist);

      const newId = `new-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;

      newItems.push({
        id: newId,
        name: randomSong,
        artist: randomArtist,
        cover_image_url: generateRandomImageUrl(),
        duration: generateRandomDuration(),
      });
    }

    setData((prevData) => [...newItems, ...prevData]);
  }, []);

  const handleCloseControls = useCallback(() => {
    setShowControls(false);
  }, []);

  const handleOpenControls = useCallback(() => {
    setShowControls(true);
  }, []);

  // Memoized controls content
  const controlsContent = useMemo(
    () => (
      <View style={styles.controlsContainer}>
        {/* Drag Mode Section */}
        <View style={styles.controlSection}>
          <Text style={styles.controlSectionTitle}>Drag Mode</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                !isDragHandleMode && styles.modeButtonActive,
              ]}
              onPress={handleToggleDragMode}
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
              style={[
                styles.modeButton,
                isDragHandleMode && styles.modeButtonActive,
              ]}
              onPress={handleToggleDragMode}
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

        {/* Add Items Section */}
        <View style={styles.controlSection}>
          <Text style={styles.controlSectionTitle}>Add New Items</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNewItem}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ Add Single Item</Text>
          </TouchableOpacity>

          <View style={styles.multiAddContainer}>
            <Text style={styles.multiAddLabel}>Add Multiple:</Text>
            <View style={styles.multiAddButtons}>
              {[3, 5, 10].map((count) => (
                <TouchableOpacity
                  key={count}
                  style={styles.multiAddButton}
                  onPress={() => handleAddMultipleItems(count)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.multiAddButtonText}>{count}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.controlDescription}>
            New items will be added to the top of the list with creative names
            and artists
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.controlSection}>
          <Text style={styles.controlSectionTitle}>Playlist Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{data.length}</Text>
              <Text style={styles.statLabel}>Total Songs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {data.filter((item) => item.id.startsWith("new-")).length}
              </Text>
              <Text style={styles.statLabel}>Added Songs</Text>
            </View>
          </View>
        </View>
      </View>
    ),
    [
      isDragHandleMode,
      data.length,
      handleToggleDragMode,
      handleAddNewItem,
      handleAddMultipleItems,
    ]
  );

  // Render each sortable item
  const renderItem = useCallback(
    (props: SortableRenderItemProps<Item>) => {
      const {
        item,
        id,
        positions,
        lowerBound,
        autoScrollDirection,
        itemsCount,
        itemHeight,
      } = props;

      return (
        <SortableItem
          key={id}
          id={id}
          data={item}
          positions={positions}
          lowerBound={lowerBound}
          autoScrollDirection={autoScrollDirection}
          itemsCount={itemsCount}
          itemHeight={itemHeight}
          containerHeight={windowHeight * 0.8}
          style={styles.itemContainer}
          onMove={(currentId, from, to) => {
            console.log(`Item ${currentId} moved from ${from} to ${to}`);
          }}
          onDragStart={(currentId, position) => {
            console.log(`Item ${currentId} dragged from ${position}`);
          }}
          onDrop={(currentId, position) => {
            console.log(`Item ${currentId} dropped at ${position}`);
          }}
          onDragging={(currentId, overItemId, yPosition) => {
            console.log(
              `Item ${currentId} dragging over ${overItemId} at ${yPosition}`
            );
          }}
        >
          <View style={styles.itemContent}>
            <Image
              source={{ uri: item.cover_image_url }}
              style={styles.coverImage}
            />
            <View style={styles.textContainer}>
              <Text style={styles.songName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
            <Text style={styles.durationText}>{item.duration}</Text>
            {isDragHandleMode && (
              <SortableItem.Handle style={styles.dragHandle}>
                <View style={styles.dragIconContainer}>
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
    [isDragHandleMode]
  );

  const isWeb = Platform.OS === "web";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.header}>Playing Now</Text>
            <Text style={styles.tipText}>
              {isDragHandleMode
                ? "Drag the handle to reorder items"
                : "Hold and drag items to reorder"}
            </Text>
          </View>

          <View style={styles.controlsButtonContainer}>
            {!isLoading && (
              <TouchableOpacity
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
            )}
          </View>
        </View>
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#FF3B30" />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <Sortable
            data={data}
            renderItem={renderItem}
            itemHeight={ITEM_HEIGHT}
            style={styles.list}
          />
        </View>
      )}
      <Footer />

      {/* Controls Bottom Sheet */}
      <BottomSheet
        isVisible={showControls}
        onClose={handleCloseControls}
        title="Playlist Controls"
      >
        {controlsContent}
      </BottomSheet>

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
              This sortable example doesn't work on web due to platform
              limitations with React Native Reanimated and Gesture Handler.
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#000000",
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
    borderColor: "#3A3A3C",
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
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
    backgroundColor: "#8E8E93",
  },
  controlsText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  list: {
    flex: 1,
    backgroundColor: "#000000",
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C2C2E",
    backgroundColor: "#000000",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#000000",
    height: "100%",
  },
  coverImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 12,
  },
  songName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
    lineHeight: 20,
  },
  artistName: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
    lineHeight: 18,
  },
  durationText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    marginRight: 12,
    minWidth: 40,
    textAlign: "right",
  },
  dragHandle: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#6D6D70",
  },
  // Controls styles
  controlsContainer: {
    paddingBottom: 20,
  },
  controlSection: {
    marginBottom: 32,
  },
  controlSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
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
    borderColor: "#3A3A3C",
    borderRadius: 8,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  modeButtonTextActive: {
    color: "#FFFFFF",
  },
  controlDescription: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#FF3B30",
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
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "#3A3A3C",
    borderRadius: 6,
    alignItems: "center",
    minWidth: 50,
  },
  multiAddButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF3B30",
    marginBottom: 4,
  },
  statLabel: {
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
    fontFamily: "KumbhSans_700Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "KumbhSans_400Regular",
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
});
